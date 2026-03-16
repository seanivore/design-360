#!/usr/bin/env python3
"""
MANIFEST GENERATOR (v5.0)
Scans portfolio entry JSON files and builds slug → file path mapping
Run this script after adding/updating/removing any JSON entries

Usage:
    python generate_manifest.py
    
Output:
    /assets/js/manifest.json
"""

import json
import os
from pathlib import Path
from typing import Dict, Tuple
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


def main():
    print("=" * 60)
    print("MANIFEST GENERATOR v5.0")
    print("Flat slug → JSON path mapping")
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
    
    print()
    print("=" * 60)
    print("✅ DONE!")
    print("=" * 60)


if __name__ == '__main__':
    main()
