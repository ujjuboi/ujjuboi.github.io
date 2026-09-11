#!/usr/bin/env python3
"""
Extract metadata, table of contents, and raw text from an EPUB using only the
Python standard library (zipfile + XML/HTML parsing), for the quick-book skill.

An EPUB is a ZIP archive. This script reads the OPF package document for
metadata and the spine, the navigation document (nav.xhtml) or NCX (toc.ncx)
for the chapter list, and the manifest for the cover image.

The module also exposes library functions (load_epub, extract, chapter_text,
chapter_range_text, write_cover) reused by sibling scripts such as
extract_mobi.py when a MOBI/KF8 file is first unpacked to an EPUB.

Usage:
  python3 extract_epub.py <epub-path>                  Print JSON with metadata + outline
  python3 extract_epub.py <epub-path> --text <n>       Print raw text of spine item n (1-based)
  python3 extract_epub.py <epub-path> --text-range a:b Print raw text of spine items a..b (1-based, inclusive)
  python3 extract_epub.py <epub-path> --cover <out>    Extract the cover image to <out>

Output for the default mode is a single JSON document on stdout:
  {
    "source": <epub path>,
    "filename": <basename>,
    "num_chapters": <int>,
    "metadata": {"title": ..., "author": ..., "publisher": ..., "subject": ...},
    "outline": [ {"title": ..., "level": <int>, "page": <int|null>}, ... ],
    "outline_source": "nav" | "ncx",
    "warning": <optional message>
  }
"""

import argparse
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from html.parser import HTMLParser
from urllib.parse import unquote, urljoin

NAMESPACES = {
    'opf': 'http://www.idpf.org/2007/opf',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'container': 'urn:oasis:names:tc:opendocument:xmlns:container',
    'ncx': 'http://www.daisy.org/z3986/2005/ncx/',
    'xhtml': 'http://www.w3.org/1999/xhtml',
}

WHITESPACE_RE = re.compile(r'\s+')

TEXT_LIMIT = 4000


class TextExtractParser(HTMLParser):
    """Collect visible text from an HTML fragment, skipping scripts/styles."""

    SKIP_TAGS = {'script', 'style', 'head'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP_TAGS:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP_TAGS and self._skip_depth:
            self._skip_depth -= 1
        elif tag in ('p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'br', 'section'):
            self.parts.append('\n')

    def handle_data(self, data):
        if self._skip_depth == 0:
            self.parts.append(data)

    def text(self):
        raw = ''.join(self.parts)
        raw = WHITESPACE_RE.sub(' ', raw)
        return raw.strip()


def parse_xml_bytes(data):
    """Parse raw bytes as XML, tolerating a leading BOM."""
    if data.startswith(b'\xef\xbb\xbf'):
        data = data[3:]
    return ET.fromstring(data)


def local_name(tag):
    """Strip any XML namespace from a tag name."""
    if isinstance(tag, str) and '}' in tag:
        return tag.split('}', 1)[1]
    return tag


def find_opf_path(zf):
    """Read META-INF/container.xml and return the path of the OPF file."""
    try:
        container = parse_xml_bytes(zf.read('META-INF/container.xml'))
    except (KeyError, ET.ParseError) as exc:
        raise RuntimeError('missing or invalid META-INF/container.xml: %s' % exc)
    rootfile = container.find('.//container:rootfile', NAMESPACES)
    if rootfile is None:
        raise RuntimeError('no rootfile element in container.xml')
    return rootfile.get('full-path')


def info_from_opf(opf_root, opf_dir):
    """Return (metadata dict, spine hrefs, manifest id->href, nav/cover hints)."""
    metadata = {}
    metadata_el = opf_root.find('opf:metadata', NAMESPACES)
    if metadata_el is not None:
        for child in metadata_el:
            name = local_name(child.tag)
            if name in ('title', 'creator', 'publisher', 'subject', 'language') and name not in metadata:
                metadata[name] = (child.text or '').strip()
            if name in ('description',) and 'description' not in metadata:
                metadata[name] = (child.text or '').strip()

    manifest = {}
    manifest_el = opf_root.find('opf:manifest', NAMESPACES)
    if manifest_el is not None:
        for item in manifest_el.findall('opf:item', NAMESPACES):
            item_id = item.get('id')
            manifest[item_id] = {
                'href': item.get('href', ''),
                'media_type': item.get('media-type', ''),
                'properties': item.get('properties', ''),
            }

    spine = []
    spine_el = opf_root.find('opf:spine', NAMESPACES)
    if spine_el is not None:
        for itemref in spine_el.findall('opf:itemref', NAMESPACES):
            item_id = itemref.get('idref')
            if item_id in manifest:
                spine.append(manifest[item_id])

    cover_id = None
    meta_items = metadata_el.findall('opf:meta', NAMESPACES) if metadata_el is not None else []
    for meta in meta_items:
        if meta.get('name') == 'cover':
            cover_id = meta.get('content')
    # Resolve cover href: prefer the cover property, else any image in manifest.
    cover_href = None
    if cover_id and cover_id in manifest:
        cover_href = manifest[cover_id]['href']
    if not cover_href:
        for item in manifest.values():
            if item['media_type'].startswith('image/'):
                cover_href = item['href']
                break

    return metadata, spine, manifest, cover_href, cover_id


def relative_path(opf_dir, href):
    """Join an href relative to the OPF directory, normalising separators."""
    combined = urljoin(opf_dir + '/', href)
    return unquote(combined)


def resolve_nav(opf_dir, manifest):
    """Find an EPUB3 nav document (nav.xhtml) inside the package."""
    nav_href = None
    # Look for a manifest item with property containing 'nav'.
    for item in manifest.values():
        if 'nav' in item['properties'].split():
            nav_href = item['href']
            break
    # Fall back to the common filename.
    if nav_href is None:
        for item in manifest.values():
            if 'nav' in item['href'].lower():
                nav_href = item['href']
                break
    if nav_href is None:
        return None
    return relative_path(opf_dir, nav_href)


def resolve_ncx(opf_dir, spine_el, manifest):
    """Find the NCX file referenced by the spine's toc attribute."""
    toc_id = spine_el.get('toc')
    if toc_id is None:
        return None
    item = manifest.get(toc_id)
    if item is None:
        return None
    return relative_path(opf_dir, item.get('href', ''))


def _strip_leading(rel):
    """Strip a leading slash that may appear after urljoin."""
    return rel.lstrip('/')


def read_zip_path(zf, rel_path):
    """Read a member of the zip by its (absolute-style) epub path."""
    lookup = _strip_leading(rel_path)
    try:
        return zf.read(lookup)
    except KeyError:
        # Some authors put a leading slash in hrefs.
        raise


def parse_nav_outline_epub3(zf, nav_path):
    """Return a flattened outline from an EPUB3 nav.xhtml."""
    try:
        data = read_zip_path(zf, nav_path)
    except KeyError:
        return [], False

    parser = HTMLParserWithLinks()
    try:
        parser.feed(data.decode('utf-8', errors='replace'))
    except Exception:
        return [], False
    parser.close()

    entries = []
    for item in parser.links:
        entries.append({
            'title': WHITESPACE_RE.sub(' ', item['title']).strip(),
            'level': item['level'],
            'page': None,
        })
    return entries, True


class HTMLParserWithLinks(HTMLParser):
    """Track nested nav-list items, capturing anchor text and depth."""

    LIST_TAGS = {'ol', 'ul'}
    ITEM_TAGS = {'li'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self._stack = []          # list of (tag, level) for open elements
        self._item_depth = None   # level when an <li> opened
        self._title = []
        self._in_anchor = False
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        self._stack.append((tag, None))
        if tag in self.LIST_TAGS or tag == 'nav':
            self._stack[-1] = (tag, len(self._stack))
        if tag == 'li':
            self._item_depth = len(self._stack)
            self._title = []
        elif tag == 'a':
            self._in_anchor = True

    def handle_endtag(self, tag):
        if self._in_anchor and tag == 'a':
            self._in_anchor = False
            title = WHITESPACE_RE.sub(' ', ''.join(self._title)).strip()
            if title and self._item_depth is not None:
                # Count ancestor list levels to compute nesting depth.
                level = self._depth_at(self._item_depth)
                self.links.append({'title': title, 'level': level})
        if tag == 'li':
            self._item_depth = None
        if self._stack:
            self._stack.pop()

    def _depth_at(self, index):
        """Number of enclosing <ol>/<ul> at stack position index."""
        # Recompute by scanning the stored list tags whose level is set.
        return len([None for (t, lvl) in self._stack[:index] if lvl is not None and t in self.LIST_TAGS])

    def handle_data(self, data):
        if self._in_anchor:
            self._title.append(data)


def parse_ncx_outline(zf, ncx_path):
    """Return a flattened outline from an EPUB2 NCX file."""
    try:
        data = read_zip_path(zf, ncx_path)
    except KeyError:
        return [], False
    try:
        root = parse_xml_bytes(data)
    except ET.ParseError:
        return [], False

    entries = []
    nav_map = root.find('ncx:navMap', NAMESPACES)
    if nav_map is None:
        return [], False

    def walk(elements, level):
        for el in elements:
            if local_name(el.tag) != 'navPoint':
                continue
            label_el = el.find('ncx:navLabel/ncx:text', NAMESPACES)
            title = (label_el.text or '').strip() if label_el is not None else ''
            entries.append({'title': title, 'level': level, 'page': None})
            children = el.findall('ncx:navPoint', NAMESPACES)
            if children:
                walk(children, level + 1)

    walk(list(nav_map), 0)
    return entries, True


def clean_text(text, limit=TEXT_LIMIT):
    """Collapse whitespace and optionally truncate text."""
    text = WHITESPACE_RE.sub(' ', text or '')
    text = text.strip()
    if limit and len(text) > limit:
        text = text[:limit] + ' ... [truncated]'
    return text


def extract_doc_text(zf, rel_path):
    """Return plain text of a spine XHTML document."""
    try:
        data = read_zip_path(zf, rel_path)
    except KeyError:
        return ''
    parser = TextExtractParser()
    try:
        parser.feed(data.decode('utf-8', errors='replace'))
    except Exception:
        return ''
    parser.close()
    return parser.text()


def load_epub(epub_path):
    """Open an EPUB package and return its parsed parts for reuse by callers.

    Returns (zf, opf_dir, spine_el, metadata, spine, manifest, cover_href,
    cover_id). Raises ValueError with a human-friendly message on any error.
    """
    if not os.path.isfile(epub_path):
        raise ValueError(f'no such file: {epub_path}')
    try:
        zf = zipfile.ZipFile(epub_path)
    except zipfile.BadZipFile:
        raise ValueError('not a valid EPUB (not a zip archive)')

    try:
        opf_path = find_opf_path(zf)
    except RuntimeError as exc:
        raise ValueError(str(exc))
    opf_dir = os.path.dirname(opf_path)
    try:
        opf_data = read_zip_path(zf, opf_path)
    except KeyError:
        raise ValueError(f'OPF file missing from archive: {opf_path}')
    try:
        opf_root = parse_xml_bytes(opf_data)
    except ET.ParseError as exc:
        raise ValueError(f'could not parse OPF file: {exc}')

    metadata, spine, manifest, cover_href, cover_id = info_from_opf(opf_root, opf_dir)
    spine_el = opf_root.find('opf:spine', NAMESPACES)
    return zf, opf_dir, spine_el, metadata, spine, manifest, cover_href, cover_id


def build_outline(zf, opf_dir, spine_el, manifest, spine):
    """Return (outline, outline_source, warning) for an opened EPUB."""
    outline = []
    outline_source = None
    warning = None

    nav_path = resolve_nav(opf_dir, manifest)
    if nav_path:
        outline, ok = parse_nav_outline_epub3(zf, nav_path)
        if ok and outline:
            outline_source = 'nav'

    if not outline and spine_el is not None:
        ncx_path = resolve_ncx(opf_dir, spine_el, manifest)
        if ncx_path:
            outline, ok = parse_ncx_outline(zf, ncx_path)
            if ok and outline:
                outline_source = 'ncx'

    if not outline:
        # Fall back to the spine document titles.
        outline = [
            {'title': f"Chapter {i}", 'level': 0, 'page': None}
            for i in range(1, len(spine) + 1)
        ]
        outline_source = 'spine'
        if len(spine) > 1:
            warning = (
                'No navigation document (nav.xhtml / toc.ncx) found; the chapter '
                'list was derived from the spine and may use generic names. '
                'Verify the chapter list with the user.'
            )

    return outline, outline_source, warning


def compose_result(epub_path, metadata, spine, outline, outline_source, warning):
    """Assemble the default-mode JSON result dict for an EPUB."""
    clean_meta = {k: (v or '').strip() for k, v in metadata.items()}
    result = {
        'source': epub_path,
        'filename': os.path.basename(epub_path),
        'num_chapters': len(spine),
        'metadata': clean_meta,
        'outline': outline,
        'outline_source': outline_source,
    }
    if warning:
        result['warning'] = warning
    elif outline_source in ('ncx',):
        result['warning'] = (
            'Outline read from the EPUB2 NCX file. Verify the chapter list with the user.'
        )
    return result


def extract(epub_path):
    """Return the default-mode JSON result dict for an EPUB. Raises ValueError on errors."""
    zf, opf_dir, spine_el, metadata, spine, manifest, cover_href, cover_id = load_epub(epub_path)
    outline, outline_source, warning = build_outline(zf, opf_dir, spine_el, manifest, spine)
    return compose_result(epub_path, metadata, spine, outline, outline_source, warning)


def extract_chapter_text(zf, spine, opf_dir, index):
    """Return cleaned text of spine chapter `index` (1-based)."""
    if not (1 <= index <= len(spine)):
        raise IndexError(f'chapter {index} out of range (1-{len(spine)})')
    href = spine[index - 1]['href']
    return extract_doc_text(zf, relative_path(opf_dir, href))


def chapter_text(epub_path, index):
    """Return cleaned text of spine chapter `index` for the EPUB at epub_path."""
    zf, opf_dir, spine_el, metadata, spine, manifest, cover_href, cover_id = load_epub(epub_path)
    return extract_chapter_text(zf, spine, opf_dir, index)


def chapter_range_text(epub_path, start, end):
    """Return a list of cleaned text for spine chapters start..end (1-based, inclusive)."""
    zf, opf_dir, spine_el, metadata, spine, manifest, cover_href, cover_id = load_epub(epub_path)
    return [extract_chapter_text(zf, spine, opf_dir, i) for i in range(start, end + 1)]


def write_cover(zf, opf_dir, cover_href, out_path):
    """Write the cover image member to out_path. Raises ValueError if unavailable."""
    if not cover_href:
        raise ValueError('no cover image found in the EPUB')
    try:
        data = read_zip_path(zf, relative_path(opf_dir, cover_href))
    except KeyError:
        raise ValueError(f'cover image not found in archive: {cover_href}')
    with open(out_path, 'wb') as fh:
        fh.write(data)


def cover(epub_path, out_path):
    """Write the EPUB cover image to out_path. Raises ValueError on errors."""
    zf, opf_dir, spine_el, metadata, spine, manifest, cover_href, cover_id = load_epub(epub_path)
    write_cover(zf, opf_dir, cover_href, out_path)


def parse_index(text_arg):
    """Parse a --text value into a 1-based page number, dropping non-digits."""
    try:
        return int(text_arg)
    except ValueError:
        return int(re.sub(r'[^0-9]', '', text_arg) or '0')


def parse_range(range_arg):
    """Parse a --text-range value 'a:b' into (start, end)."""
    match = re.fullmatch(r'(\d+):(\d+)', range_arg)
    if not match:
        raise ValueError(f"--text-range expects a:b, got '{range_arg}'")
    return int(match.group(1)), int(match.group(2))


def main():
    parser = argparse.ArgumentParser(description='Extract metadata and TOC from an EPUB.')
    parser.add_argument('epub', help='Path to the EPUB file')
    parser.add_argument('--text', metavar='N', help='Dump raw text of spine chapter N (1-based)')
    parser.add_argument('--text-range', metavar='A:B', help='Dump raw text of spine chapters A..B (1-based, inclusive)')
    parser.add_argument('--cover', metavar='OUT', help='Extract the cover image to OUT')
    args = parser.parse_args()

    epub_path = os.path.expanduser(args.epub)
    try:
        zf, opf_dir, spine_el, metadata, spine, manifest, cover_href, cover_id = load_epub(epub_path)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(2)

    if args.cover:
        try:
            write_cover(zf, opf_dir, cover_href, os.path.expanduser(args.cover))
        except ValueError as exc:
            print(f"Error: {exc}", file=sys.stderr)
            sys.exit(2)
        print(f"Saved cover to {os.path.expanduser(args.cover)}", file=sys.stderr)
        return

    if args.text or args.text_range:
        num = len(spine)
        try:
            if args.text:
                index = parse_index(args.text)
                if not (1 <= index <= num):
                    print(f"Error: chapter {index} out of range (1-{num}).", file=sys.stderr)
                    sys.exit(2)
                print(clean_text(extract_chapter_text(zf, spine, opf_dir, index)))
                return
            start, end = parse_range(args.text_range)
            if not (1 <= start <= num) or not (1 <= end <= num):
                print(f"Error: range {start}:{end} out of bounds (1-{num}).", file=sys.stderr)
                sys.exit(2)
            for page in range(start, end + 1):
                print(f"===== CHAPTER {page} =====")
                print(clean_text(extract_chapter_text(zf, spine, opf_dir, page)))
            return
        except ValueError as exc:
            print(f'Error: {exc}', file=sys.stderr)
            sys.exit(2)

    result = compose_result(epub_path, metadata, spine, *build_outline(zf, opf_dir, spine_el, manifest, spine))
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()