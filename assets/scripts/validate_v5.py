#!/usr/bin/env python3
"""
Entry Validator (v5.0)
Validates all portfolio entry JSON files against v5.0 schema requirements.
Run after creating/updating entries.

Usage:
    python assets/scripts/validate_v5.py
"""

import json
import sys
from pathlib import Path

LOCKED_COMPANIES = ["Freelance", "Silent Labs", "SEANIVORE GROUP LLC", "PETA, Inc."]

REQUIRED_FIELDS = [
    "id", "slug", "title", "subtitle", "seo_title", "seo_description",
    "role", "skill", "product", "company",
    "thumb", "thumb_alt", "img", "img_alt",
    "tiles", "challenge", "approach", "result"
]

REQUIRED_ARRAYS = ["role", "skill", "product", "thumb", "img", "tiles"]


def validate_entry(file_path: Path, tags_registry: dict) -> list:
    """Validate a single entry file. Returns list of error strings."""
    errors = []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return [f"Invalid JSON: {e}"]
    except Exception as e:
        return [f"Error reading file: {e}"]

    # Check schema version
    metadata = data.get("_metadata", {})
    if metadata.get("schema_version") != "5.0":
        errors.append(f"Schema version is '{metadata.get('schema_version')}', expected '5.0'")

    # Check required fields exist and are non-empty
    for field in REQUIRED_FIELDS:
        if field not in data:
            errors.append(f"Missing required field: {field}")
        elif data[field] is None or data[field] == "" or data[field] == []:
            errors.append(f"Required field is empty: {field}")

    # Check required arrays have at least one item
    for field in REQUIRED_ARRAYS:
        if field in data and isinstance(data[field], list) and len(data[field]) == 0:
            errors.append(f"Required array is empty: {field}")

    # Check company is one of locked values
    company = data.get("company", "")
    if company and company not in LOCKED_COMPANIES:
        errors.append(f"Invalid company '{company}'. Must be one of: {LOCKED_COMPANIES}")

    # Check thumb paths exist on disk (skip CDN URLs)
    project_root = file_path.parents[2]  # assets/entries/file.json -> project root
    for thumb_path in data.get("thumb", []):
        if thumb_path.startswith("http"):
            continue
        full_path = project_root / thumb_path
        if not full_path.exists():
            errors.append(f"Thumbnail not found on disk: {thumb_path}")

    # Check img paths exist on disk (skip CDN URLs)
    for img_path in data.get("img", []):
        if not img_path or img_path.startswith("http"):
            continue
        full_path = project_root / img_path
        if not full_path.exists():
            errors.append(f"Image not found on disk: {img_path}")

    # Check process structure if present
    process = data.get("process")
    if process is not None:
        if not isinstance(process, list):
            errors.append("'process' must be an array")
        elif len(process) != 3:
            errors.append(f"'process' must have exactly 3 steps, found {len(process)}")
        else:
            for i, step in enumerate(process):
                for key in ["word", "summary", "link_text", "link_slug"]:
                    if key not in step:
                        errors.append(f"Process step {i+1} missing key: {key}")

    # Check metric structure if present
    metric = data.get("metric")
    if metric is not None:
        for key in ["value", "kpi", "context"]:
            if key not in metric:
                errors.append(f"'metric' missing key: {key}")

    # Check achievement structure if present
    achievement = data.get("achievement")
    if achievement is not None:
        for key in ["headline", "details"]:
            if key not in achievement:
                errors.append(f"'achievement' missing key: {key}")

    # Check grids[] shape if present (optional grouped grid schema)
    grids = data.get("grids")
    if grids is not None:
        if not isinstance(grids, list):
            errors.append("'grids' must be an array")
        else:
            for i, group in enumerate(grids):
                if not isinstance(group, dict):
                    errors.append(f"grids[{i}] must be an object")
                    continue
                images = group.get("images")
                if not isinstance(images, list) or len(images) == 0:
                    errors.append(f"grids[{i}] must have non-empty 'images' array")

    # Check all tags exist in tags registry
    if tags_registry:
        for tag_type in ["role", "skill", "product"]:
            for tag in data.get(tag_type, []):
                if tag not in tags_registry.get(tag_type, []):
                    errors.append(f"Tag '{tag}' (type: {tag_type}) not in tags.json registry")

    # Check no duplicate slugs (handled at collection level, not here)

    return errors


def load_tags_registry(project_root: Path) -> dict:
    """Load tags.json registry."""
    tags_path = project_root / "assets" / "docs" / "tags.json"
    if not tags_path.exists():
        print("Warning: tags.json not found, skipping tag registry validation")
        return {}
    try:
        with open(tags_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


def main():
    print("=" * 60)
    print("ENTRY VALIDATOR v5.0")
    print("=" * 60)
    print()

    # Find project root
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parents[1]  # assets/scripts -> project root
    entries_dir = project_root / "assets" / "entries"

    if not entries_dir.exists():
        print(f"Entries directory not found: {entries_dir}")
        sys.exit(1)

    # Load tags registry
    tags_registry = load_tags_registry(project_root)

    # Find all entry files
    entry_files = sorted(entries_dir.glob("uid-*.json"))
    if not entry_files:
        print("No entry files found")
        sys.exit(1)

    print(f"Found {len(entry_files)} entry files")
    print()

    # Track results
    total_errors = 0
    slugs_seen = {}
    files_with_errors = 0

    for entry_file in entry_files:
        errors = validate_entry(entry_file, tags_registry)

        # Check for duplicate slugs
        try:
            with open(entry_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            slug = data.get("slug", "")
            if slug in slugs_seen:
                errors.append(f"Duplicate slug '{slug}' (also in {slugs_seen[slug]})")
            else:
                slugs_seen[slug] = entry_file.name
        except Exception:
            pass

        if errors:
            files_with_errors += 1
            total_errors += len(errors)
            print(f"FAIL {entry_file.name}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"  OK {entry_file.name}")

    print()
    print("=" * 60)
    if total_errors == 0:
        print(f"ALL {len(entry_files)} ENTRIES PASSED")
    else:
        print(f"FAILED: {files_with_errors} files with {total_errors} total errors")
    print("=" * 60)

    sys.exit(1 if total_errors > 0 else 0)


if __name__ == "__main__":
    main()
