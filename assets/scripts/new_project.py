#!/usr/bin/env python3
"""
Generate new project JSON files (entry, collection, or item) for the portfolio.

Creates a JSON skeleton with a unique ID, derived from the appropriate
template, ready for the user to fill in.

Usage:
    python assets/scripts/new_project.py [--type entry|collection|item]

Default --type is `entry`. The output is written to assets/docs/{uid}.json
(matching the existing convention); the user moves the file into the correct
directory (assets/entries, assets/collections, or assets/items) at the end of
the authoring pipeline.
"""

import argparse
import json
import re
import subprocess
from pathlib import Path
from typing import Dict


VALID_TYPES = ("entry", "collection", "item")

TEMPLATES: Dict[str, str] = {
    "entry": "_entry_template.json",
    "collection": "_collection_template.json",
    "item": "_item_template.json",
}

# Type-specific UID middle-segment overrides. Entries keep whatever
# segment the `uid` command produces (organic three-letter code).
UID_MIDDLE_OVERRIDES: Dict[str, str] = {
    "collection": "col",
    "item": "itm",
}


def _run_uid_command() -> str:
    """Run the uid command and extract the generated UID."""
    try:
        result = subprocess.run(
            ["uid"], capture_output=True, text=True, check=True
        )
    except FileNotFoundError as exc:
        raise RuntimeError("Missing `uid` command in PATH.") from exc
    output = result.stdout.strip()
    match = re.search(r"(uid-[a-z]{3}-[0-9]{3})", output)
    if not match:
        raise RuntimeError(f"Unexpected uid output: {output}")
    return match.group(1)


def _apply_uid_middle(uid: str, project_type: str) -> str:
    """
    Swap the three-letter middle segment of a UID for type-specific schemes:
        entry      -> keep as-is (e.g. uid-rfr-187)
        collection -> uid-col-###
        item       -> uid-itm-###
    """
    middle = UID_MIDDLE_OVERRIDES.get(project_type)
    if not middle:
        return uid
    # uid-XXX-### → uid-{middle}-###
    return re.sub(r"^uid-[a-z]{3}-([0-9]{3})$", rf"uid-{middle}-\1", uid)


def _load_template(template_path: Path) -> dict:
    """Load the JSON template."""
    with template_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_project(output_path: Path, data: dict) -> None:
    """Write the JSON file with readable formatting."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=4, ensure_ascii=False)


def _apply_uid_and_metadata(data: dict, uid: str) -> dict:
    """
    Stamp the UID onto the document. The template already carries its own
    `_metadata.schema_version`; we preserve it verbatim (entry: 6.1,
    collection: 6.0, item: 6.0).
    """
    data["id"] = uid
    return data


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a new entry / collection / item JSON skeleton."
    )
    parser.add_argument(
        "--type",
        choices=VALID_TYPES,
        default="entry",
        help="Type of project document to create (default: entry).",
    )
    return parser.parse_args()


def main() -> int:
    """Main entry point."""
    args = _parse_args()
    project_type: str = args.type

    repo_root = Path(__file__).resolve().parents[2]
    docs_dir = repo_root / "assets" / "docs"
    template_path = docs_dir / TEMPLATES[project_type]

    if not template_path.exists():
        raise RuntimeError(f"Template not found: {template_path}")

    # Generate UID, then rewrite middle segment per type convention
    raw_uid = _run_uid_command()
    uid = _apply_uid_middle(raw_uid, project_type)

    # Load template and apply UID (schema_version comes from template)
    data = _load_template(template_path)
    data = _apply_uid_and_metadata(data, uid)

    # Write to docs directory
    output_path = docs_dir / f"{uid}.json"
    _write_project(output_path, data)

    print(f"Created {project_type} file: {output_path.relative_to(repo_root)}")
    print(f"ID: {uid}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
