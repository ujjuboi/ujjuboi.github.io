#!/usr/bin/env python3
"""
Extract metadata, outline (table of contents), and raw text from a PDF using
pypdf, for the quick-book skill.

Usage:
  python3 extract_pdf.py <pdf-path>                  Print JSON with metadata + outline
  python3 extract_pdf.py <pdf-path> --text <n>       Print raw text of page n (1-based)
  python3 extract_pdf.py <pdf-path> --text a:b       Print raw text of pages a..b (1-based, inclusive)
  python3 extract_pdf.py <pdf-path> --cover <out>    Extract the page-1 cover image to <out> (PNG)

If pypdf is not installed, the script installs it via `python3 -m pip install
--user pypdf` and retries once.

Output for the default mode is a single JSON document on stdout:
  {
    "source": <pdf path>,
    "filename": <basename>,
    "num_pages": <int>,
    "metadata": {"title": ..., "author": ..., "creator": ..., "producer": ..., "subject": ...},
    "outline": [ {"title": ..., "level": <int>, "page": <int|null>}, ... ],
    "outline_source": "bookmarks" | "scanned",
    "warning": <optional message>
  }

An outline is read from the PDF's bookmarks when present. When the PDF has no
bookmarks, headings matching `CHAPTER n` / `PART n` are scanned from the page
text and returned as the outline (outline_source = "scanned").
"""

import argparse
import json
import os
import re
import subprocess
import sys

TOC_HEADING_RE = re.compile(r'^\s*(?:chapter|part)\s+([0-9]+|[ivxlcdm]+)\s*[:\.\-]?\s*(.*)$', re.IGNORECASE)


def ensure_pypdf():
    """Import pypdf, installing it via pip --user on first failure."""
    try:
        import pypdf  # noqa: F401
        return True
    except ImportError:
        print("pypdf not found. Installing it with pip --user ...", file=sys.stderr)
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--user", "--quiet", "pypdf"],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print("Failed to install pypdf:", result.stderr, file=sys.stderr)
            return False
        return True


def ensure_pillow():
    """Import Pillow, installing it via pip --user on first failure."""
    try:
        from PIL import Image  # noqa: F401
        return True
    except ImportError:
        print("Pillow not found. Installing it with pip --user ...", file=sys.stderr)
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--user", "--quiet", "Pillow"],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print("Failed to install Pillow:", result.stderr, file=sys.stderr)
            return False
        return True


def dump_cover(reader, out_path):
    """Extract the first embedded image on page 1 and write it to out_path."""
    from PIL import Image
    import io

    try:
        images = list(reader.pages[0].images)
    except Exception as exc:
        print(f"Error: could not read cover image from page 1: {exc}", file=sys.stderr)
        sys.exit(2)
    if not images:
        print("Error: no images found on page 1.", file=sys.stderr)
        sys.exit(2)

    img = images[0]
    image = Image.open(io.BytesIO(img.data))
    image.save(out_path)
    print(f"Saved cover to {out_path} ({image.width}x{image.height})", file=sys.stderr)


def load_reader(path):
    """Open the PDF and return a pypdf PdfReader."""
    from pypdf import PdfReader
    return PdfReader(path)


def clean_text(text, limit=None):
    """Collapse whitespace and optionally truncate a page's text."""
    text = re.sub(r'\s+', ' ', text or '')
    text = text.strip()
    if limit and len(text) > limit:
        text = text[:limit] + ' ... [truncated]'
    return text


def resolve_page(reader, dest):
    """Return the 1-based page number for a bookmark/destination, or None."""
    if dest is None:
        return None
    try:
        num = reader.get_destination_page_number(dest)
        return num + 1 if num is not None else None
    except Exception:
        return None


def flatten_outline(reader, items, level=0):
    """Flatten a pypdf outline tree into a list of dicts."""
    if not items:
        return []
    entries = []
    for items_ in items:
        if isinstance(items_, (list, tuple)):
            if len(items_) == 0:
                continue
            title = items_[0] if isinstance(items_[0], str) else str(items_[0])
            dest = items_[1] if len(items_) > 1 else None
            entries.append({
                'title': title,
                'level': level,
                'page': resolve_page(reader, dest),
            })
            if len(items_) > 2 and isinstance(items_[2], list):
                entries.extend(flatten_outline(reader, items_[2], level + 1))
        else:
            title = getattr(items_, 'title', '') or ''
            entries.append({
                'title': title,
                'level': level,
                'page': resolve_page(reader, items_),
            })
    return entries


def scan_toc(reader):
    """Derive a TOC by scanning page text for chapter/part headings."""
    entries = []
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ''
        except Exception:
            continue
        for line in text.splitlines():
            match = TOC_HEADING_RE.match(line.strip())
            if match:
                entries.append({
                    'title': f"CHAPTER {match.group(1)}{': ' + match.group(2).strip() if match.group(2).strip() else ''}",
                    'level': 0,
                    'page': i + 1,
                })
                break
    return entries


def dump_text(reader, args):
    """Print raw text for --text / --text-range pages."""
    if args.text:
        try:
            page = int(args.text)
        except ValueError:
            page = int(re.sub(r'[^0-9]', '', args.text) or '0')
        if not (1 <= page <= len(reader.pages)):
            print(f"Error: page {page} out of range (1-{len(reader.pages)}).", file=sys.stderr)
            sys.exit(2)
        print(clean_text(reader.pages[page - 1].extract_text(), 4000))
        return

    if args.text_range:
        match = re.fullmatch(r'(\d+):(\d+)', args.text_range)
        if not match:
            print(f"Error: --text-range expects a:b, got '{args.text_range}'.", file=sys.stderr)
            sys.exit(2)
        start, end = int(match.group(1)), int(match.group(2))
        if not (1 <= start <= len(reader.pages)) or not (1 <= end <= len(reader.pages)):
            print(f"Error: range {start}:{end} out of bounds (1-{len(reader.pages)}).", file=sys.stderr)
            sys.exit(2)
        for page in range(start, end + 1):
            print(f"===== PAGE {page} =====")
            print(clean_text(reader.pages[page - 1].extract_text(), 4000))
        return

    print("Error: nothing to do. Use default mode or --text/--text-range.", file=sys.stderr)
    sys.exit(2)


def main():
    parser = argparse.ArgumentParser(description='Extract metadata and TOC from a PDF with pypdf.')
    parser.add_argument('pdf', help='Path to the PDF file')
    parser.add_argument('--text', metavar='N', help='Dump raw text of page N (1-based)')
    parser.add_argument('--text-range', metavar='A:B', help='Dump raw text of pages A..B (1-based, inclusive)')
    parser.add_argument('--cover', metavar='OUT', help='Extract the page-1 cover image to OUT (PNG)')
    args = parser.parse_args()

    pdf_path = os.path.expanduser(args.pdf)
    if not os.path.isfile(pdf_path):
        print(f"Error: no such file: {pdf_path}", file=sys.stderr)
        sys.exit(2)

    if not ensure_pypdf():
        sys.exit(1)

    reader = load_reader(pdf_path)
    if args.cover:
        if not ensure_pillow():
            sys.exit(1)
        dump_cover(reader, os.path.expanduser(args.cover))
        return
    if args.text or args.text_range:
        dump_text(reader, args)
        return

    metadata = {}
    meta = reader.metadata
    if meta:
        for key in ('title', 'author', 'creator', 'producer', 'subject'):
            metadata[key] = str(getattr(meta, key, '') or '').strip()

    outline = None
    source = 'bookmarks'
    try:
        outline = flatten_outline(reader, reader.outline or [])
    except Exception as exc:
        print(f"Warning: failed to read bookmarks ({exc}); scanning headings instead.", file=sys.stderr)
        outline = None
    if not outline:
        outline = scan_toc(reader)
        source = 'scanned'

    result = {
        'source': pdf_path,
        'filename': os.path.basename(pdf_path),
        'num_pages': len(reader.pages),
        'metadata': metadata,
        'outline': outline,
        'outline_source': source,
    }
    if source == 'scanned':
        result['warning'] = (
            'No PDF bookmarks found; the outline was scanned from chapter headings '
            'in the page text and may be incomplete. Verify the chapter list with the user.'
        )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()