#!/usr/bin/env python3
"""
MANIFEST GENERATOR (v6.1)
Scans portfolio JSON sources (entries, collections, items) and builds a
slug → file path manifest, then generates per-page HTML files with
pre-rendered SEO meta tags.

Usage:
    python generate_manifest.py

Output:
    /assets/js/manifest.json
    /_pages/{slug}.html              (one per entry)
    /_pages/collection-{slug}.html   (one per collection)
    /_pages/media-{slug}.html        (one per item)
"""

import json
import os
import re
import html
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import sys


# ---------------------------------------------------------------------------
# JSON readers
# ---------------------------------------------------------------------------


def read_json_doc(file_path: Path) -> Tuple[Optional[Dict], Optional[str]]:
    """
    Read a JSON document and validate that it carries a slug field.
    Returns: (data_dict, error_message)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return None, f"Invalid JSON in {file_path.name}: {e}"
    except Exception as e:
        return None, f"Error reading {file_path.name}: {e}"

    if 'slug' not in data or not data['slug']:
        return None, f"Missing 'slug' in {file_path.name}"

    return data, None


# ---------------------------------------------------------------------------
# Manifest builders
# ---------------------------------------------------------------------------


def _build_slug_map(
    source_dir: Path,
    pattern: str,
    label: str,
    rel_dir: str,
) -> Tuple[Dict[str, str], List[str]]:
    """
    Scan a directory for JSON files matching the glob pattern and build a
    slug → relative-path map. Returns (slug_map, errors).
    """
    slug_map: Dict[str, str] = {}
    errors: List[str] = []

    if not source_dir.exists():
        print(f"ℹ️  {label} directory missing: {source_dir} — skipping")
        return slug_map, errors

    json_files = sorted(source_dir.glob(pattern))
    if not json_files:
        print(f"ℹ️  no {label} found in {source_dir}")
        return slug_map, errors

    print(f"📂 Found {len(json_files)} {label} file(s) in {source_dir}")

    for json_file in json_files:
        data, error = read_json_doc(json_file)
        if error:
            errors.append(error)
            continue

        slug = data['slug']
        rel_path = f"{rel_dir}/{json_file.name}"

        if slug in slug_map:
            errors.append(
                f"Duplicate slug '{slug}' in {json_file.name} "
                f"(also in {slug_map[slug]})"
            )
            continue

        slug_map[slug] = rel_path
        print(f"✅ {json_file.name} → /{slug}")

    return slug_map, errors


def build_manifest(
    entries_dir: Path,
    collections_dir: Path,
    items_dir: Path,
) -> Dict:
    """
    Scan entries, collections, and items directories and build the unified
    manifest structure.
    """
    manifest: Dict = {
        "entries": {},
        "collections": {},
        "items": {},
        "_metadata": {
            "generated": "auto",
            "description": "Maps slugs to JSON file paths for dynamic loading",
            "entry_count": 0,
            "collection_count": 0,
            "item_count": 0,
        },
    }

    all_errors: List[str] = []

    entries, errs = _build_slug_map(
        entries_dir, 'uid-*.json', 'entry', 'assets/entries'
    )
    manifest['entries'] = entries
    all_errors.extend(errs)

    print()
    collections, errs = _build_slug_map(
        collections_dir, 'uid-col-*.json', 'collection', 'assets/collections'
    )
    manifest['collections'] = collections
    all_errors.extend(errs)

    print()
    items, errs = _build_slug_map(
        items_dir, 'uid-itm-*.json', 'item', 'assets/items'
    )
    manifest['items'] = items
    all_errors.extend(errs)

    manifest['_metadata']['entry_count'] = len(manifest['entries'])
    manifest['_metadata']['collection_count'] = len(manifest['collections'])
    manifest['_metadata']['item_count'] = len(manifest['items'])

    if all_errors:
        print()
        print("❌ ERRORS:")
        for error in all_errors:
            print(f"   {error}")

    return manifest


def write_manifest(manifest: Dict, output_path: Path) -> None:
    """Write manifest to JSON file."""
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)

        print()
        print(f"✨ Manifest written to: {output_path}")
        print(
            f"📊 Totals — entries: {manifest['_metadata']['entry_count']}, "
            f"collections: {manifest['_metadata']['collection_count']}, "
            f"items: {manifest['_metadata']['item_count']}"
        )
    except Exception as e:
        print(f"❌ Error writing manifest: {e}")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Per-page HTML generation
# ---------------------------------------------------------------------------


def _render_seo_page(
    template: str,
    seo_title: str,
    seo_desc: str,
    og_image: str,
    og_image_alt: str,
    canonical: str,
) -> str:
    """Apply SEO placeholder substitutions shared by all page types."""
    page_html = template

    page_html = page_html.replace(
        '<title><!-- Populated by JS --></title>',
        f'<title>{seo_title}</title>',
    )
    page_html = page_html.replace(
        '<meta name="description" content="">',
        f'<meta name="description" content="{seo_desc}">',
    )
    page_html = page_html.replace(
        '<meta property="og:title" content="">',
        f'<meta property="og:title" content="{seo_title}">',
    )
    page_html = page_html.replace(
        '<meta property="og:description" content="">',
        f'<meta property="og:description" content="{seo_desc}">',
    )
    page_html = page_html.replace(
        '<meta property="og:image" content="">',
        f'<meta property="og:image" content="{og_image}">',
    )
    page_html = page_html.replace(
        '<meta property="og:image:alt" content="">',
        f'<meta property="og:image:alt" content="{og_image_alt}">',
    )
    page_html = page_html.replace(
        '<meta property="og:url" content="">',
        f'<meta property="og:url" content="{canonical}">',
    )

    # Auto-generated marker comment
    page_html = page_html.replace(
        '<!DOCTYPE html>\n<html lang="en">',
        '<!DOCTYPE html>\n'
        '<!-- AUTO-GENERATED by generate_manifest.py — do not edit manually -->\n'
        '<html lang="en">',
    )

    # Jekyll front matter so the file is processed as a collection document
    return f'---\n---\n{page_html}'


def generate_entry_html(entries_dir: Path, project_root: Path) -> int:
    """
    Generate /_pages/{slug}.html for each entry with pre-rendered SEO tags.
    """
    template_path = project_root / 'entry.html'
    if not template_path.exists():
        print(f"⚠️  entry.html template not found, skipping entry HTML generation")
        return 0

    template = template_path.read_text(encoding='utf-8')
    generated = 0

    json_files = sorted(entries_dir.glob('uid-*.json'))
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception:
            continue

        slug = data.get('slug', '')
        if not slug:
            continue

        seo_title = html.escape(data.get('seo_title', '') or data.get('title', ''))
        seo_desc = html.escape(data.get('seo_description', '') or '')
        thumb_list = data.get('thumb', []) or []
        og_image = thumb_list[0] if thumb_list else ''
        if og_image and not og_image.startswith('http'):
            og_image = f'/{og_image}'
        thumb_alt = html.escape(data.get('thumb_alt', '') or data.get('title', ''))
        canonical = f'https://august.style/{slug}'

        page_html = _render_seo_page(
            template, seo_title, seo_desc, og_image, thumb_alt, canonical
        )

        pages_dir = project_root / '_pages'
        pages_dir.mkdir(parents=True, exist_ok=True)
        out_file = pages_dir / f'{slug}.html'
        out_file.write_text(page_html, encoding='utf-8')
        generated += 1

    return generated


def generate_collection_html(collections_dir: Path, project_root: Path) -> int:
    """
    Generate /_pages/collection-{slug}.html for each collection.
    """
    template_path = project_root / 'collection.html'
    if not template_path.exists():
        print(
            "⚠️  collection.html template not found "
            "(parallel HTML subagent may not have landed it yet) — "
            "skipping collection HTML generation"
        )
        return 0

    if not collections_dir.exists():
        return 0

    template = template_path.read_text(encoding='utf-8')
    generated = 0

    json_files = sorted(collections_dir.glob('uid-col-*.json'))
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception:
            continue

        slug = data.get('slug', '')
        if not slug:
            continue

        seo_title = html.escape(data.get('seo_title', '') or data.get('title', ''))
        seo_desc = html.escape(data.get('seo_description', '') or '')
        thumb_list = data.get('thumb', []) or []
        og_image = thumb_list[0] if thumb_list else ''
        if og_image and not og_image.startswith('http'):
            og_image = f'/{og_image}'
        thumb_alt = html.escape(data.get('thumb_alt', '') or data.get('title', ''))
        canonical = f'https://august.style/collection/{slug}'

        page_html = _render_seo_page(
            template, seo_title, seo_desc, og_image, thumb_alt, canonical
        )

        pages_dir = project_root / '_pages'
        pages_dir.mkdir(parents=True, exist_ok=True)
        out_file = pages_dir / f'collection-{slug}.html'
        out_file.write_text(page_html, encoding='utf-8')
        generated += 1

    return generated


def generate_item_html(items_dir: Path, project_root: Path) -> int:
    """
    Generate /_pages/media-{slug}.html for each item.
    Uses `src` for og:image (items don't always carry `thumb`), falling
    back to `thumb[0]` if `src` is empty.
    """
    template_path = project_root / 'media.html'
    if not template_path.exists():
        print(
            "⚠️  media.html template not found "
            "(parallel HTML subagent may not have landed it yet) — "
            "skipping item HTML generation"
        )
        return 0

    if not items_dir.exists():
        return 0

    template = template_path.read_text(encoding='utf-8')
    generated = 0

    json_files = sorted(items_dir.glob('uid-itm-*.json'))
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception:
            continue

        slug = data.get('slug', '')
        if not slug:
            continue

        seo_title = html.escape(data.get('seo_title', '') or data.get('title', ''))
        seo_desc = html.escape(data.get('seo_description', '') or '')

        src = data.get('src', '') or ''
        thumb_list = data.get('thumb', []) or []
        og_image = src if src else (thumb_list[0] if thumb_list else '')
        if og_image and not og_image.startswith('http'):
            og_image = f'/{og_image}'

        thumb_alt = html.escape(data.get('thumb_alt', '') or data.get('title', ''))
        canonical = f'https://august.style/media/{slug}'

        page_html = _render_seo_page(
            template, seo_title, seo_desc, og_image, thumb_alt, canonical
        )

        pages_dir = project_root / '_pages'
        pages_dir.mkdir(parents=True, exist_ok=True)
        out_file = pages_dir / f'media-{slug}.html'
        out_file.write_text(page_html, encoding='utf-8')
        generated += 1

    return generated


# ---------------------------------------------------------------------------
# Stale-page cleanup
# ---------------------------------------------------------------------------


def clean_stale_pages(manifest: Dict, project_root: Path) -> int:
    """
    Remove _pages/*.html files for slugs no longer present in the manifest.
    Handles three page-type prefixes:
        {slug}.html              -> entries
        collection-{slug}.html   -> collections
        media-{slug}.html        -> items
    """
    pages_dir = project_root / '_pages'
    if not pages_dir.exists():
        return 0

    active_entries = set(manifest.get('entries', {}).keys())
    active_collections = set(manifest.get('collections', {}).keys())
    active_items = set(manifest.get('items', {}).keys())

    removed = 0
    for html_file in pages_dir.glob('*.html'):
        stem = html_file.stem

        if stem.startswith('collection-'):
            slug = stem[len('collection-'):]
            active_set = active_collections
        elif stem.startswith('media-'):
            slug = stem[len('media-'):]
            active_set = active_items
        else:
            slug = stem
            active_set = active_entries

        if slug not in active_set:
            html_file.unlink()
            removed += 1
            print(f"🗑️  Removed stale page: _pages/{html_file.name}")

    return removed


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    print("=" * 60)
    print("MANIFEST GENERATOR v6.1")
    print("Flat slug → JSON path mapping for entries + collections + items")
    print("=" * 60)
    print()

    script_dir = Path(__file__).parent
    project_root = script_dir

    entries_dir = project_root / 'assets' / 'entries'
    collections_dir = project_root / 'assets' / 'collections'
    items_dir = project_root / 'assets' / 'items'
    output_path = project_root / 'assets' / 'js' / 'manifest.json'

    if not entries_dir.exists():
        print(f"❌ Entries directory not found: {entries_dir}")
        sys.exit(1)

    manifest = build_manifest(entries_dir, collections_dir, items_dir)
    write_manifest(manifest, output_path)

    # Per-type HTML generation
    print()
    print("─" * 60)
    print("GENERATING PAGES → _pages/")
    print("─" * 60)

    entry_count = generate_entry_html(entries_dir, project_root)
    print(f"📄 Generated {entry_count} entry HTML file(s)")

    collection_count = generate_collection_html(collections_dir, project_root)
    print(f"📄 Generated {collection_count} collection HTML file(s)")

    item_count = generate_item_html(items_dir, project_root)
    print(f"📄 Generated {item_count} item HTML file(s)")

    # Stale cleanup
    removed = clean_stale_pages(manifest, project_root)
    if removed:
        print(f"🗑️  Cleaned {removed} stale page(s)")

    print()
    print("=" * 60)
    print("✅ DONE!")
    print("=" * 60)


if __name__ == '__main__':
    main()
