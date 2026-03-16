#!/usr/bin/env python3
"""
Generate new project entry JSON files for the portfolio.
Creates a JSON file with a unique ID, ready for the user to fill in.
"""

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path


def _run_uid_command() -> str:
    """Run the uid command and extract the generated UID."""
    try:
        result = subprocess.run(["uid"], capture_output=True, text=True, check=True)
    except FileNotFoundError as exc:
        raise RuntimeError("Missing `uid` command in PATH.") from exc
    output = result.stdout.strip()
    match = re.search(r"(uid-[a-z]{3}-[0-9]{3})", output)
    if not match:
        raise RuntimeError(f"Unexpected uid output: {output}")
    return match.group(1)


def _load_template(template_path: Path) -> dict:
    """Load the entry template JSON."""
    with template_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_project(output_path: Path, data: dict) -> None:
    """Write the project JSON file with readable formatting."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=4, ensure_ascii=False)


def _apply_uid_and_metadata(data: dict, uid: str) -> dict:
    """Apply the UID and update metadata with actual values."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    data["_metadata"] = {
        "schema_version": "5.0",
        "template_type": "project_entry"
    }
    data["id"] = uid
    return data


def main() -> int:
    """Main entry point."""
    repo_root = Path(__file__).resolve().parents[2]
    template_path = repo_root / "assets" / "docs" / "_entry_template.json"
    docs_dir = repo_root / "assets" / "docs"

    if not template_path.exists():
        raise RuntimeError(f"Template not found: {template_path}")

    # Generate UID
    uid = _run_uid_command()

    # Load template and apply UID
    data = _load_template(template_path)
    data = _apply_uid_and_metadata(data, uid)

    # Write to docs directory
    output_path = docs_dir / f"{uid}.json"
    _write_project(output_path, data)

    print(f"Created project file: {output_path.relative_to(repo_root)}")
    print(f"Entry ID: {uid}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
