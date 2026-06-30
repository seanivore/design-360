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

VALID_LAYOUTS: Set[str] = {"columns", "flow", "gallery", "url"}

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
    "project_link",
    "video",
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

# Fields retired in v4.5.0 — entries must no longer carry these. `placement`
# is replaced by the `featured` boolean + descriptive skill/product tags;
# gallery bleed derives from collections[]; the rest were dead media/editorial
# fields. Flagged so cleanup never silently regresses.
RETIRED_ENTRY_FIELDS: List[str] = [
    "placement",
    "img", "img_alt",
    "mobile_img", "mobile_img_alt",
    "slideshows",
    "grid", "grid_alt", "grids",
    "bleed", "bleed_slides",
    "media_url",
    "role_headline", "hero_btn_cta", "final_cta_text", "final_btn_cta",
    "skill_summary", "process", "metric",
]

# Collection — required fields shared by both schema versions.
# The media-list field is conditional and added per schema_version inside
# validate_collection():  6.0 requires "media" (UID array), 6.1 requires
# "images" (CDN URL array).
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
]

# Accepted collection schema versions and the media-list field each requires.
VALID_COLLECTION_SCHEMA_VERSIONS: Set[str] = {"6.0", "6.1"}
COLLECTION_MEDIA_FIELD_BY_VERSION: Dict[str, str] = {
    "6.0": "media",
    "6.1": "images",
}

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
    # 'url' layout is a redirect tile — the tile/image links go straight to external_url
    # (no internal entry page is rendered), so that field is required for this layout.
    if layout == "url" and not (data.get("external_url") or "").strip():
        errors.append("layout 'url' requires a non-empty 'external_url'")

    # Company (locked list)
    company = data.get("company", "")
    if company and company not in LOCKED_COMPANIES:
        errors.append(
            f"Invalid company '{company}'. Must be one of: {LOCKED_COMPANIES}"
        )

    # Tag membership: role / skill / product
    if tags_registry:
        for tag_type in ("role", "skill", "product"):
            allowed = set(tags_registry.get(tag_type, []))
            for tag in data.get(tag_type, []) or []:
                if tag not in allowed:
                    errors.append(
                        f"Tag '{tag}' (type: {tag_type}) not in tags.json registry"
                    )

    # Retired fields (v4.5.0) — must be fully removed.
    for retired in RETIRED_ENTRY_FIELDS:
        if retired in data:
            errors.append(f"'{retired}' is retired (v4.5.0) — remove it")

    # featured must be a boolean when present.
    featured = data.get("featured")
    if featured is not None and not isinstance(featured, bool):
        errors.append("'featured' must be a boolean (true/false)")

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
    if schema_version not in VALID_COLLECTION_SCHEMA_VERSIONS:
        errors.append(
            f"Schema version is '{schema_version}', expected one of: "
            f"{sorted(VALID_COLLECTION_SCHEMA_VERSIONS)}"
        )

    # Shared required fields, plus the media-list field required for this
    # schema version (6.0 -> 'media' UID array, 6.1 -> 'images' URL array).
    required = list(COLLECTION_REQUIRED_FIELDS)
    media_field = COLLECTION_MEDIA_FIELD_BY_VERSION.get(schema_version)
    if media_field:
        required.append(media_field)
    errors.extend(_check_required(data, required))

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

    # media[] cross-reference — only for collections that carry a media[]
    # UID array (schema 6.0). Schema 6.1 gallery collections use images[]
    # (CDN URLs), which do not resolve to local item UIDs, so skip them.
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
