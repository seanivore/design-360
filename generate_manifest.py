#!/usr/bin/env python3
"""
MANIFEST GENERATOR (v5.0)
Scans portfolio entry JSON files and builds slug → file path mapping,
then generates per-entry HTML files with pre-rendered SEO meta tags.

Usage:
    python generate_manifest.py

Output:
    /assets/js/manifest.json
    /_pages/{slug}.html (one per entry — SEO pre-rendered, Jekyll collection)
"""

import json
import os
import re
import html
from pathlib import Path
from typing import Dict, List, Tuple
import sys


def read_json_entry(file_path: Path) -> Tuple[Dict, str]:
    """
    Read a JSON entry file and extract slug
    Returns: (categorization_dict, error_message)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        if 'slug' not in data or not data['slug']:
            return None, f"Missing 'slug' in {file_path.name}"

        return data, None
        
    except json.JSONDecodeError as e:
        return None, f"Invalid JSON in {file_path.name}: {e}"
    except Exception as e:
        return None, f"Error reading {file_path.name}: {e}"


def build_manifest(entries_dir: Path) -> Dict:
    """
    Scan entries directory and build manifest structure
    Flat slug → JSON path mapping (no section hierarchy)
    """
    manifest = {
        "entries": {},
        "_metadata": {
            "generated": "auto",
            "description": "Maps slugs to JSON file paths for dynamic loading",
            "entry_count": 0
        }
    }
    
    errors = []
    
    json_files = list(entries_dir.glob('uid-*.json'))
    
    if not json_files:
        print(f"⚠️  No entry JSON files found in {entries_dir}")
        return manifest
        
    print(f"📂 Found {len(json_files)} JSON files in {entries_dir}")
    print()
    
    for json_file in sorted(json_files):
        data, error = read_json_entry(json_file)

        if error:
            errors.append(error)
            continue

        slug = data['slug']
        file_path = f"assets/entries/{json_file.name}"
        
        # Check for duplicate slugs
        if slug in manifest['entries']:
            errors.append(f"Duplicate slug '{slug}' in {json_file.name}")
            continue
        
        manifest['entries'][slug] = file_path
        
        roles = ', '.join(data.get('role', []))
        print(f"✅ {json_file.name} → /{slug}")
        print(f"   roles: [{roles}]")
        
    manifest['_metadata']['entry_count'] = len(manifest['entries'])
    
    if errors:
        print()
        print("❌ ERRORS:")
        for error in errors:
            print(f"   {error}")
            
    return manifest


def write_manifest(manifest: Dict, output_path: Path):
    """
    Write manifest to JSON file
    """
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)

        print()
        print(f"✨ Manifest written to: {output_path}")
        print(f"📊 Total entries: {manifest['_metadata']['entry_count']}")

    except Exception as e:
        print(f"❌ Error writing manifest: {e}")
        sys.exit(1)


def generate_entry_html(entries_dir: Path, project_root: Path) -> int:
    """
    Generate /{slug}/index.html for each entry with pre-rendered SEO meta tags.
    Uses entry.html as template, fills in meta tags from entry JSON data.
    Returns number of files generated.
    """
    template_path = project_root / 'entry.html'
    if not template_path.exists():
        print(f"⚠️  entry.html template not found, skipping HTML generation")
        return 0

    template = template_path.read_text(encoding='utf-8')
    generated = 0
    errors = []

    json_files = list(entries_dir.glob('uid-*.json'))
    for json_file in sorted(json_files):
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
        thumb_list = data.get('thumb', [])
        og_image = thumb_list[0] if thumb_list else ''
        if og_image and not og_image.startswith('http'):
            og_image = f'/{og_image}'
        thumb_alt = html.escape(data.get('thumb_alt', '') or data.get('title', ''))
        canonical = f'https://august.style/{slug}'

        # Build the page HTML from template with meta tags filled in
        page_html = template

        # Replace title
        page_html = page_html.replace(
            '<title><!-- Populated by JS --></title>',
            f'<title>{seo_title}</title>'
        )

        # Replace meta description
        page_html = page_html.replace(
            '<meta name="description" content="">',
            f'<meta name="description" content="{seo_desc}">'
        )

        # Replace og tags
        page_html = page_html.replace(
            '<meta property="og:title" content="">',
            f'<meta property="og:title" content="{seo_title}">'
        )
        page_html = page_html.replace(
            '<meta property="og:description" content="">',
            f'<meta property="og:description" content="{seo_desc}">'
        )
        page_html = page_html.replace(
            '<meta property="og:image" content="">',
            f'<meta property="og:image" content="{og_image}">'
        )
        page_html = page_html.replace(
            '<meta property="og:image:alt" content="">',
            f'<meta property="og:image:alt" content="{thumb_alt}">'
        )
        page_html = page_html.replace(
            '<meta property="og:url" content="">',
            f'<meta property="og:url" content="{canonical}">'
        )

        # Add auto-generated comment after <!DOCTYPE html>
        page_html = page_html.replace(
            '<!DOCTYPE html>\n<html lang="en">',
            f'<!DOCTYPE html>\n<!-- AUTO-GENERATED by generate_manifest.py — do not edit manually -->\n<html lang="en">'
        )

        # Add Jekyll front matter so the file is processed as a collection document
        page_html = f'---\n---\n{page_html}'

        # Write to /_pages/{slug}.html
        pages_dir = project_root / '_pages'
        pages_dir.mkdir(parents=True, exist_ok=True)
        out_file = pages_dir / f'{slug}.html'
        out_file.write_text(page_html, encoding='utf-8')
        generated += 1

    return generated


def clean_stale_pages(manifest: Dict, project_root: Path):
    """
    Remove _pages/*.html files for slugs no longer in the manifest.
    """
    pages_dir = project_root / '_pages'
    if not pages_dir.exists():
        return 0
    active_slugs = set(manifest.get('entries', {}).keys())
    removed = 0
    for html_file in pages_dir.glob('*.html'):
        slug = html_file.stem
        if slug not in active_slugs:
            html_file.unlink()
            removed += 1
            print(f"🗑️  Removed stale page: _pages/{html_file.name}")
    return removed


def main():
    print("=" * 60)
    print("MANIFEST GENERATOR v5.0")
    print("Flat slug → JSON path mapping + SEO HTML generation")
    print("=" * 60)
    print()

    script_dir = Path(__file__).parent
    project_root = script_dir

    entries_dir = project_root / 'assets' / 'entries'
    output_path = project_root / 'assets' / 'js' / 'manifest.json'

    if not entries_dir.exists():
        print(f"❌ Entries directory not found: {entries_dir}")
        sys.exit(1)

    manifest = build_manifest(entries_dir)
    write_manifest(manifest, output_path)

    # Generate per-entry HTML files with pre-rendered meta tags
    print()
    print("─" * 60)
    print("GENERATING ENTRY HTML FILES → _pages/")
    print("─" * 60)
    count = generate_entry_html(entries_dir, project_root)
    print(f"📄 Generated {count} entry HTML files")

    # Clean up stale pages
    removed = clean_stale_pages(manifest, project_root)
    if removed:
        print(f"🗑️  Cleaned {removed} stale pages")

    print()
    print("=" * 60)
    print("✅ DONE!")
    print("=" * 60)


if __name__ == '__main__':
    main()
