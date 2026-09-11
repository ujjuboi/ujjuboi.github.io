#!/usr/bin/env python3
"""
Extract metadata, table of contents, text, and cover from a non-DRM MOBI/AZW3
book, for the quick-book skill.

MOBI is a proprietary PalmDB-derived format, so extraction goes through the
`mobi` library — a CLI-free fork of KindleUnpack. It unpacks an old MOBI7 book
into an HTML file + NCX, and a KF8/AZW3 (or combination) book into an EPUB,
which is then handled by reusing extract_epub.py.

If the `mobi` package is not installed, the script installs it via
`python3 -m pip install --user mobi` and retries once (mirroring
extract_pdf.py's pypdf handling).

Usage:
  python3 extract_mobi.py <mobi-path>                  Print JSON with metadata + outline
  python3 extract_mobi.py <mobi-path> --text <n>       Print raw text of chapter n (1-based)
  python3 extract_mobi.py <mobi-path> --text-range a:b Print raw text of chapters a..b (1-based, inclusive)
  python3 extract_mobi.py <mobi-path> --cover <out>    Extract the cover image to <out>

Output for the default mode is a single JSON document on stdout with the same
shape as the EPUB extractor:
  {
    "source": <mobi path>,
    "filename": <basename>,
    "num_chapters": <int>,
    "metadata": {"title": ..., "creator": ..., ...},
    "outline": [ {"title": ..., "level": <int>, "page": <int|null>}, ... ],
    "outline_source": "ncx" | "nav" | "spine",
    "warning": <optional message>
  }
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extract_epub
from extract_epub import (
    TextExtractParser,
    clean_text,
    info_from_opf,
    local_name,
    NAMESPACES,
    parse_xml_bytes,
)

FILEPOS_ANCHOR_RE = re.compile(r'<a\s+id="filepos(\d+)"\s*/>')


def ensure_mobi():
    """Import the mobi library, installing it via pip --user on first failure."""
    try:
        import mobi
        return mobi
    except ImportError:
        print("mobi not found. Installing it with pip --user ...", file=sys.stderr)
        result = subprocess.run(
            [sys.executable, '-m', 'pip', 'install', '--user', '--quiet', 'mobi'],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print("Failed to install mobi:", result.stderr, file=sys.stderr)
            return None
        try:
            import mobi
            return mobi
        except ImportError:
            return None


def ensure_pillow():
    """Import Pillow, installing it via pip --user on first failure (for covers)."""
    try:
        from PIL import Image  # noqa: F401
        return True
    except ImportError:
        print("Pillow not found. Installing it with pip --user ...", file=sys.stderr)
        result = subprocess.run(
            [sys.executable, '-m', 'pip', 'install', '--user', '--quiet', 'Pillow'],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print("Failed to install Pillow:", result.stderr, file=sys.stderr)
            return False
        return True


def read_text_file(path):
    """Read a file as text, tolerating encoding problems."""
    with open(path, 'r', encoding='utf-8', errors='replace') as fh:
        return fh.read()


def read_xml_file(path):
    """Parse an XML file from disk."""
    with open(path, 'rb') as fh:
        return parse_xml_bytes(fh.read())


def disk_opf_metadata(opf_path):
    """Return (metadata, spine, manifest, cover_href) from an OPF on disk."""
    root = read_xml_file(opf_path)
    opf_dir = os.path.dirname(opf_path)
    metadata, spine, manifest, cover_href, cover_id = info_from_opf(root, opf_dir)
    return metadata, spine, manifest, cover_href, cover_id


def disk_ncx_entries(ncx_path):
    """Return [{title, level, pos}] parsed from an NCX file on disk."""
    root = read_xml_file(ncx_path)
    nav_map = root.find('ncx:navMap', NAMESPACES)
    if nav_map is None:
        return []
    entries = []

    def walk(elements, level):
        for el in elements:
            if local_name(el.tag) != 'navPoint':
                continue
            label_el = el.find('ncx:navLabel/ncx:text', NAMESPACES)
            title = (label_el.text or '').strip() if label_el is not None else ''
            content_el = el.find('ncx:content', NAMESPACES)
            src = content_el.get('src', '') if content_el is not None else ''
            match = re.search(r'#filepos(\d+)', src)
            entries.append({
                'title': title,
                'level': level,
                'pos': int(match.group(1)) if match else None,
            })
            children = el.findall('ncx:navPoint', NAMESPACES)
            if children:
                walk(children, level + 1)

    walk(list(nav_map), 0)
    return entries


def html_chunks(html_path, positions):
    """Slice the MOBI7 html at `<a id="fileposN" />` anchors; return {pos: text}."""
    html = read_text_file(html_path)
    matches = {int(m.group(1)): m for m in FILEPOS_ANCHOR_RE.finditer(html)}
    found = [p for p in positions if p is not None and p in matches]
    chunks = {}
    for i, pos in enumerate(found):
        start = matches[pos].end()
        end = matches[found[i + 1]].start() if i + 1 < len(found) else len(html)
        chunks[pos] = html[start:end]
    return chunks


def chunk_text(chunk):
    """Return cleaned plain text for a raw HTML chunk."""
    if not chunk:
        return ''
    parser = TextExtractParser()
    try:
        parser.feed(chunk)
    except Exception:
        return ''
    parser.close()
    return parser.text()


def build_mobi7_result(mobi_path, base_dir):
    """Assemble the default-mode JSON result for an old (MOBI7) book."""
    content_opf_path = os.path.join(base_dir, 'content.opf')
    ncx_path = os.path.join(base_dir, 'toc.ncx')
    metadata, spine, manifest, cover_href, cover_id = disk_opf_metadata(content_opf_path)
    entries = disk_ncx_entries(ncx_path)

    outline = [{'title': e['title'], 'level': e['level'], 'page': None} for e in entries]
    result = {
        'source': mobi_path,
        'filename': os.path.basename(mobi_path),
        'num_chapters': len(outline) or len(spine),
        'metadata': {k: (v or '').strip() for k, v in metadata.items()},
        'outline': outline,
        'outline_source': 'ncx',
    }
    if outline:
        result['warning'] = (
            'Outline read from the unpacked MOBI (NCX) file; it may include '
            'front-matter entries. Verify the chapter list with the user.'
        )
    else:
        result['warning'] = (
            'No chapter list could be extracted from the MOBI. Provide the '
            'chapter list manually or in the questionnaire.'
        )
    return result


def mobi7_text(base_dir, entries, index):
    """Return cleaned text of the `index`-th MOBI chapter (1-based)."""
    html_path = os.path.join(base_dir, 'book.html')
    positions = [e['pos'] for e in entries]
    chunks = html_chunks(html_path, positions)
    pos = positions[index - 1]
    return chunk_text(chunks.get(pos))


def mobi7_cover(base_dir, cover_href, out_path):
    """Copy the MOBI cover image (resolved from the OPF) to out_path."""
    if not cover_href:
        raise ValueError('no cover image found in the MOBI')
    cover_path = os.path.join(base_dir, cover_href)
    if not os.path.isfile(cover_path):
        raise ValueError(f'cover image not found: {cover_href}')
    shutil.copyfile(cover_path, out_path)


def run(mobi_path, args):
    """Run extraction for a MOBI file. Prints output; returns an exit code."""
    mobi = ensure_mobi()
    if mobi is None:
        print('Error: could not install the mobi library.', file=sys.stderr)
        return 1
    if args.cover and not ensure_pillow():
        print('Error: could not install Pillow.', file=sys.stderr)
        return 1

    try:
        tempdir, out_file = mobi.extract(mobi_path)
    except Exception as exc:
        print(f"Error: could not unpack {mobi_path}: {exc}", file=sys.stderr)
        return 1
    try:
        out_ext = os.path.splitext(out_file)[1].lower()
        if out_ext == '.epub':
            return run_epub_branch(mobi_path, out_file, args)
        if out_ext in ('.html', '.htm'):
            return run_mobi7_branch(mobi_path, out_file, args)
        print(
            'Error: this MOBI is a Kindle Print Replica (opened to a PDF), '
            'which is not supported.',
            file=sys.stderr,
        )
        return 1
    finally:
        shutil.rmtree(tempdir, ignore_errors=True)


def run_epub_branch(mobi_path, epub_path, args):
    """Handle a KF8/AZW3 MOBI unpacked to an EPUB, mirroring extract_epub.py."""
    try:
        if args.cover:
            extract_epub.cover(epub_path, os.path.expanduser(args.cover))
            print(f"Saved cover to {os.path.expanduser(args.cover)}", file=sys.stderr)
            return 0

        info = extract_epub.extract(epub_path)
        num = info['num_chapters'] or max(len(info['outline']), 1)
        if args.text:
            index = extract_epub.parse_index(args.text)
            if not (1 <= index <= num):
                print(f"Error: chapter {index} out of range (1-{num}).", file=sys.stderr)
                return 2
            print(clean_text(extract_epub.chapter_text(epub_path, index)))
            return 0
        if args.text_range:
            start, end = extract_epub.parse_range(args.text_range)
            if not (1 <= start <= num) or not (1 <= end <= num):
                print(f"Error: range {start}:{end} out of bounds (1-{num}).", file=sys.stderr)
                return 2
            for page in range(start, end + 1):
                print(f"===== CHAPTER {page} =====")
                print(clean_text(extract_epub.chapter_text(epub_path, page)))
            return 0

        info['source'] = mobi_path
        info['filename'] = os.path.basename(mobi_path)
        existing = info.pop('warning', None)
        note = 'Source unpacked from a KF8/AZW3 ebook.'
        info['warning'] = f'{note} {existing}' if existing else f'{note} Verify the chapter list with the user.'
        print(json.dumps(info, ensure_ascii=False, indent=2))
        return 0
    except ValueError as exc:
        print(f'Error: {exc}', file=sys.stderr)
        return 2


def run_mobi7_branch(mobi_path, out_file, args):
    """Handle an old (MOBI7) book unpacked to book.html."""
    base_dir = os.path.dirname(out_file)
    if args.cover:
        metadata, spine, manifest, cover_href, cover_id = disk_opf_metadata(
            os.path.join(base_dir, 'content.opf')
        )
        try:
            mobi7_cover(base_dir, cover_href, os.path.expanduser(args.cover))
        except ValueError as exc:
            print(f'Error: {exc}', file=sys.stderr)
            return 2
        print(f"Saved cover to {os.path.expanduser(args.cover)}", file=sys.stderr)
        return 0

    entries = disk_ncx_entries(os.path.join(base_dir, 'toc.ncx'))

    if args.text:
        index = int(re.sub(r'[^0-9]', '', args.text) or '0')
        if not entries:
            print('Error: no chapter list available to extract text by chapter.', file=sys.stderr)
            return 2
        if not (1 <= index <= len(entries)):
            print(f"Error: chapter {index} out of range (1-{len(entries)}).", file=sys.stderr)
            return 2
        print(clean_text(mobi7_text(base_dir, entries, index)))
        return 0
    if args.text_range:
        match = re.fullmatch(r'(\d+):(\d+)', args.text_range)
        if not match:
            print(f"Error: --text-range expects a:b, got '{args.text_range}'.", file=sys.stderr)
            return 2
        start, end = int(match.group(1)), int(match.group(2))
        if not entries or not (1 <= start <= len(entries)) or not (1 <= end <= len(entries)):
            print(f"Error: range {start}:{end} out of bounds (1-{len(entries)}).", file=sys.stderr)
            return 2
        positions = [e['pos'] for e in entries]
        chunks = html_chunks(os.path.join(base_dir, 'book.html'), positions)
        for page in range(start, end + 1):
            print(f"===== CHAPTER {page} =====")
            print(clean_text(chunk_text(chunks.get(positions[page - 1]))))
        return 0

    result = build_mobi7_result(mobi_path, base_dir)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


def main():
    parser = argparse.ArgumentParser(description='Extract metadata and TOC from a MOBI/AZW3 file.')
    parser.add_argument('mobi', help='Path to the MOBI/AZW3 file')
    parser.add_argument('--text', metavar='N', help='Dump raw text of chapter N (1-based)')
    parser.add_argument('--text-range', metavar='A:B', help='Dump raw text of chapters A..B (1-based, inclusive)')
    parser.add_argument('--cover', metavar='OUT', help='Extract the cover image to OUT')
    args = parser.parse_args()

    mobi_path = os.path.expanduser(args.mobi)
    if not os.path.isfile(mobi_path):
        print(f"Error: no such file: {mobi_path}", file=sys.stderr)
        sys.exit(2)

    sys.exit(run(mobi_path, args))


if __name__ == '__main__':
    main()