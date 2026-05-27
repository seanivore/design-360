#!/usr/bin/env python3
"""
VALIDATOR v6.1
Validates all portfolio JSON sources against the current schemas:
    - assets/entries/uid-*.json       -> entry v6.1
    - assets/collections/uid-col-*.json -> collection v6.0
    - assets/items/uid-itm-*.json     -> item v6.0

Cross-reference checks:
    - Every UID in collection.media[] resolves to an items file.
    - Every collection slug referenced by a flow `collection_preview`
      block resolves to a collections file.

Usage:
    python assets/scripts/validate.py

Exit code 1 on any validation error (so CI can gate on it).
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

LOCKED_COMPANIES: List[str] = [
    "Freelance",
    "Silent Labs",
    "SEANIVORE GROUP LLC",
    "PETA, Inc.",
]

VALID_LAYOUTS: Set[str] = {"columns", "flow"}

VALID_FLOW_TYPES: Set[str] = {
    "h3",
    "h4",
    "h5",
    "p",
    "img",
    "list",
    "chunk_break",
    "embed_html",
    "collection_preview",
}

VALID_MEDIA_TYPES: Set[str] = {"image", "video"}

# Entry v6.1 — required fields (non-empty)
ENTRY_REQUIRED_FIELDS: List[str] = [
    "id",
    "slug",
    "title",
    "subtitle",
    "seo_title",
    "seo_description",
    "role",
    "skill",
    "product",
    "company",
    "thumb",
    "thumb_alt",
    "layout",
]

# Collection v6.0 — required fields
COLLECTION_REQUIRED_FIELDS: List[str] = [
    "id",
    "slug",
    "title",
    "subtitle",
    "seo_title",
    "seo_description",
    "company",
    "thumb",
    "thumb_alt",
    "media",
]

# Item v6.0 — required fields
ITEM_REQUIRED_FIELDS: List[str] = [
    "id",
    "slug",
    "title",
    "media_type",
    "src",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _load_json(file_path: Path) -> Tuple[dict, List[str]]:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f), []
    except json.JSONDecodeError as e:
        return {}, [f"Invalid JSON: {e}"]
    except Exception as e:
        return {}, [f"Error reading file: {e}"]


def _check_required(data: dict, required: List[str]) -> List[str]:
    """Verify required fields are present and non-empty."""
    errors: List[str] = []
    for field in required:
        if field not in data:
            errors.append(f"Missing required field: {field}")
            continue
        value = data[field]
        if value is None or value == "" or value == []:
            errors.append(f"Required field is empty: {field}")
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


# ---------------------------------------------------------------------------
# Entry validation (v6.1)
# ---------------------------------------------------------------------------


def validate_entry(
    file_path: Path,
    tags_registry: dict,
) -> Tuple[List[str], dict]:
    """
    Validate a single entry file. Returns (errors, parsed_data).
    """
    data, errs = _load_json(file_path)
    if errs:
        return errs, {}

    errors: List[str] = []

    # Schema version
    metadata = data.get("_metadata", {})
    schema_version = metadata.get("schema_version")
    if schema_version != "6.1":
        errors.append(
            f"Schema version is '{schema_version}', expected '6.1'"
        )

    # Required fields
    errors.extend(_check_required(data, ENTRY_REQUIRED_FIELDS))

    # Layout
    layout = data.get("layout", "")
    if layout and layout not in VALID_LAYOUTS:
        errors.append(
            f"Invalid layout '{layout}'. Must be one of: {sorted(VALID_LAYOUTS)}"
        )

    # Company (locked list)
    company = data.get("company", "")
    if company and company not in LOCKED_COMPANIES:
        errors.append(
            f"Invalid company '{company}'. Must be one of: {LOCKED_COMPANIES}"
        )

    # Tag membership: role / skill / product / placement
    if tags_registry:
        for tag_type in ("role", "skill", "product", "placement"):
            allowed = set(tags_registry.get(tag_type, []))
            for tag in data.get(tag_type, []) or []:
                if tag not in allowed:
                    errors.append(
                        f"Tag '{tag}' (type: {tag_type}) not in tags.json registry"
                    )

    # placement[] specifically must come from tags.json.placement (covered above)
    # but additionally ensure it's a list
    placement = data.get("placement")
    if placement is not None and not isinstance(placement, list):
        errors.append("'placement' must be an array")

    # flow[] block validation
    flow = data.get("flow")
    if flow is not None:
        if not isinstance(flow, list):
            errors.append("'flow' must be an array")
        else:
            for i, block in enumerate(flow):
                if not isinstance(block, dict):
                    errors.append(f"flow[{i}] must be an object")
                    continue
                btype = block.get("type")
                if btype not in VALID_FLOW_TYPES:
                    errors.append(
                        f"flow[{i}] has invalid type '{btype}'. "
                        f"Must be one of: {sorted(VALID_FLOW_TYPES)}"
                    )

    # process[] structure (legacy field; validate shape if present)
    process = data.get("process")
    if process is not None and isinstance(process, list):
        for i, step in enumerate(process):
            if not isinstance(step, dict):
                errors.append(f"process[{i}] must be an object")
                continue
            for key in ("word", "summary", "link_text", "link_slug"):
                if key not in step:
                    errors.append(f"process[{i}] missing key: {key}")

    # metric structure
    metric = data.get("metric")
    if metric is not None and isinstance(metric, dict):
        for key in ("value", "kpi", "context"):
            if key not in metric:
                errors.append(f"'metric' missing key: {key}")

    # achievements[] structure
    achievements = data.get("achievements")
    if achievements is not None:
        if not isinstance(achievements, list):
            errors.append("'achievements' must be an array")
        else:
            for i, ach in enumerate(achievements):
                if not isinstance(ach, dict):
                    errors.append(f"achievements[{i}] must be an object")
                    continue
                for key in ("headline", "details"):
                    if key not in ach:
                        errors.append(f"achievements[{i}] missing key: {key}")

    # grids[] structure
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
                    errors.append(
                        f"grids[{i}] must have non-empty 'images' array"
                    )

    return errors, data


# ---------------------------------------------------------------------------
# Collection validation (v6.0)
# ---------------------------------------------------------------------------


def validate_collection(
    file_path: Path,
    item_uids: Set[str],
    tags_registry: dict,
) -> Tuple[List[str], dict]:
    """
    Validate a single collection file. Returns (errors, parsed_data).
    item_uids: set of all item UIDs known to exist in assets/items/.
    """
    data, errs = _load_json(file_path)
    if errs:
        return errs, {}

    errors: List[str] = []

    metadata = data.get("_metadata", {})
    schema_version = metadata.get("schema_version")
    if schema_version != "6.0":
        errors.append(
            f"Schema version is '{schema_version}', expected '6.0'"
        )

    errors.extend(_check_required(data, COLLECTION_REQUIRED_FIELDS))

    # Company (locked list)
    company = data.get("company", "")
    if company and company not in LOCKED_COMPANIES:
        errors.append(
            f"Invalid company '{company}'. Must be one of: {LOCKED_COMPANIES}"
        )

    # Tag membership: role / skill / product (collections do not use placement)
    if tags_registry:
        for tag_type in ("role", "skill", "product"):
            allowed = set(tags_registry.get(tag_type, []))
            for tag in data.get(tag_type, []) or []:
                if tag not in allowed:
                    errors.append(
                        f"Tag '{tag}' (type: {tag_type}) not in tags.json registry"
                    )

    # media[] cross-reference
    media = data.get("media")
    if media is not None:
        if not isinstance(media, list):
            errors.append("'media' must be an array")
        else:
            for uid in media:
                if uid not in item_uids:
                    errors.append(
                        f"media references unknown item UID '{uid}' "
                        f"(no matching file under assets/items/)"
                    )

    return errors, data


# ---------------------------------------------------------------------------
# Item validation (v6.0)
# ---------------------------------------------------------------------------


def validate_item(file_path: Path) -> Tuple[List[str], dict]:
    """
    Validate a single item file. tags[] is free-form, so no membership check.
    """
    data, errs = _load_json(file_path)
    if errs:
        return errs, {}

    errors: List[str] = []

    metadata = data.get("_metadata", {})
    schema_version = metadata.get("schema_version")
    if schema_version != "6.0":
        errors.append(
            f"Schema version is '{schema_version}', expected '6.0'"
        )

    errors.extend(_check_required(data, ITEM_REQUIRED_FIELDS))

    media_type = data.get("media_type", "")
    if media_type and media_type not in VALID_MEDIA_TYPES:
        errors.append(
            f"Invalid media_type '{media_type}'. "
            f"Must be one of: {sorted(VALID_MEDIA_TYPES)}"
        )

    return errors, data


# ---------------------------------------------------------------------------
# Cross-reference: collection_preview slugs
# ---------------------------------------------------------------------------


def collect_collection_previews(
    entries: List[Tuple[Path, dict]],
) -> List[Tuple[Path, str]]:
    """
    Return list of (file_path, collection_slug) for every collection_preview
    block referenced in any entry's flow[].
    """
    out: List[Tuple[Path, str]] = []
    for file_path, data in entries:
        flow = data.get("flow") or []
        if not isinstance(flow, list):
            continue
        for block in flow:
            if not isinstance(block, dict):
                continue
            if block.get("type") == "collection_preview":
                slug = block.get("collection", "")
                if slug:
                    out.append((file_path, slug))
    return out


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def _report(file_label: str, errors: List[str]) -> None:
    if errors:
        print(f"FAIL {file_label}")
        for error in errors:
            print(f"  - {error}")
    else:
        print(f"  OK {file_label}")


def main() -> None:
    print("=" * 60)
    print("VALIDATOR v6.1")
    print("=" * 60)
    print()

    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parents[1]  # assets/scripts -> project root

    entries_dir = project_root / "assets" / "entries"
    collections_dir = project_root / "assets" / "collections"
    items_dir = project_root / "assets" / "items"

    if not entries_dir.exists():
        print(f"Entries directory not found: {entries_dir}")
        sys.exit(1)

    tags_registry = load_tags_registry(project_root)

    total_errors = 0
    files_with_errors = 0
    slugs_seen: Dict[str, str] = {}

    # --- pass 1: scan items first so collections can cross-reference them
    item_files = sorted(items_dir.glob("uid-itm-*.json")) if items_dir.exists() else []
    item_uids: Set[str] = set()

    print(f"Items ({len(item_files)}):")
    for item_file in item_files:
        errors, data = validate_item(item_file)
        uid = data.get("id", "")
        if uid:
            item_uids.add(uid)

        slug = data.get("slug", "")
        if slug:
            if slug in slugs_seen:
                errors.append(
                    f"Duplicate slug '{slug}' (also in {slugs_seen[slug]})"
                )
            else:
                slugs_seen[slug] = item_file.name

        _report(item_file.name, errors)
        if errors:
            files_with_errors += 1
            total_errors += len(errors)
    print()

    # --- pass 2: collections (cross-ref into item_uids)
    collection_files = (
        sorted(collections_dir.glob("uid-col-*.json"))
        if collections_dir.exists()
        else []
    )
    collection_slugs: Set[str] = set()

    print(f"Collections ({len(collection_files)}):")
    for col_file in collection_files:
        errors, data = validate_collection(col_file, item_uids, tags_registry)
        slug = data.get("slug", "")
        if slug:
            collection_slugs.add(slug)
            if slug in slugs_seen:
                errors.append(
                    f"Duplicate slug '{slug}' (also in {slugs_seen[slug]})"
                )
            else:
                slugs_seen[slug] = col_file.name

        _report(col_file.name, errors)
        if errors:
            files_with_errors += 1
            total_errors += len(errors)
    print()

    # --- pass 3: entries
    entry_files = sorted(entries_dir.glob("uid-*.json"))
    if not entry_files:
        print("No entry files found")
        sys.exit(1)

    entries_parsed: List[Tuple[Path, dict]] = []
    print(f"Entries ({len(entry_files)}):")
    for entry_file in entry_files:
        errors, data = validate_entry(entry_file, tags_registry)
        if data:
            entries_parsed.append((entry_file, data))

        slug = data.get("slug", "")
        if slug:
            if slug in slugs_seen:
                errors.append(
                    f"Duplicate slug '{slug}' (also in {slugs_seen[slug]})"
                )
            else:
                slugs_seen[slug] = entry_file.name

        _report(entry_file.name, errors)
        if errors:
            files_with_errors += 1
            total_errors += len(errors)
    print()

    # --- pass 4: cross-reference collection_preview slugs from entry flows
    cross_errors: List[str] = []
    for file_path, slug in collect_collection_previews(entries_parsed):
        if slug not in collection_slugs:
            cross_errors.append(
                f"{file_path.name}: flow collection_preview references unknown "
                f"collection slug '{slug}' (no matching file under "
                f"assets/collections/)"
            )

    if cross_errors:
        print("Cross-reference errors:")
        for err in cross_errors:
            print(f"  - {err}")
        files_with_errors += len(cross_errors)
        total_errors += len(cross_errors)
        print()

    total_files = len(item_files) + len(collection_files) + len(entry_files)
    print("=" * 60)
    if total_errors == 0:
        print(f"ALL {total_files} FILES PASSED")
    else:
        print(
            f"FAILED: {files_with_errors} files / cross-refs with "
            f"{total_errors} total errors"
        )
    print("=" * 60)

    sys.exit(1 if total_errors > 0 else 0)


if __name__ == "__main__":
    main()
