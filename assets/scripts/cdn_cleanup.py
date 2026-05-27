#!/usr/bin/env python3
"""
CDN ORPHAN REPORT (v4.2.3)

Scans local JSON sources (entries, collections, items) for every CDN URL
referenced, lists every object actually present in the R2 bucket, and writes
a markdown report of orphaned objects (present in R2 but unreferenced).

The script never deletes anything. The report contains commented-out
`aws s3 rm ...` one-liners that Sean uncomments after manual review.

Usage:
    python assets/scripts/cdn_cleanup.py

Output:
    assets/docs/archive/v4_2/cdn_orphans_<YYYY_MM_DD>.md
"""

import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path
from typing import Iterable, List, Set, Tuple

# ---------------------------------------------------------------------------
# R2 / CDN constants
# ---------------------------------------------------------------------------

R2_BUCKET = "portfolio"
R2_ENDPOINT = (
    "https://17f4ab52f79f8d24931df7044fcc7aa2.r2.cloudflarestorage.com"
)
R2_PROFILE = "r2"

CDN_HOST_PREFIX = "https://cdn.august.style/"

# Regex to extract CDN URLs anywhere inside a string (e.g. inside an
# embedded iframe `src=`, raw embed HTML, etc.). Match runs until whitespace,
# quote, or angle bracket.
CDN_URL_REGEX = re.compile(
    r"https://cdn\.august\.style/[^\s\"'<>]+"
)


# ---------------------------------------------------------------------------
# JSON scanning helpers
# ---------------------------------------------------------------------------


def _load_json(path: Path) -> dict:
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️  failed to parse {path}: {e}", file=sys.stderr)
        return {}


def _collect_urls_from_value(value, out: Set[str]) -> None:
    """
    Recursively pull every CDN URL out of a JSON-like value. Strings are
    regex-scanned (catches both bare URLs and URLs embedded inside
    media_embed HTML). Lists and dicts are walked.
    """
    if value is None:
        return
    if isinstance(value, str):
        for match in CDN_URL_REGEX.findall(value):
            out.add(match)
    elif isinstance(value, list):
        for item in value:
            _collect_urls_from_value(item, out)
    elif isinstance(value, dict):
        for sub in value.values():
            _collect_urls_from_value(sub, out)


def collect_referenced_urls(
    entries_dir: Path,
    collections_dir: Path,
    items_dir: Path,
) -> Set[str]:
    """
    Walk every entry, collection, and item JSON and harvest every CDN URL.
    We use a recursive walk so future schema additions get picked up
    automatically. The IMPLEMENT spec lists the fields-of-interest; those
    fields are all reachable via the recursive walk.
    """
    urls: Set[str] = set()

    for source_dir, pattern in (
        (entries_dir, "uid-*.json"),
        (collections_dir, "uid-col-*.json"),
        (items_dir, "uid-itm-*.json"),
    ):
        if not source_dir.exists():
            continue
        for json_file in sorted(source_dir.glob(pattern)):
            data = _load_json(json_file)
            _collect_urls_from_value(data, urls)

    return urls


def cdn_urls_to_s3_paths(urls: Iterable[str]) -> Set[str]:
    """
    Strip the CDN host prefix from each URL to get the S3 object path.
    Example:
        https://cdn.august.style/media/foo/bar.webp -> media/foo/bar.webp
    URLs that do not start with the CDN host are dropped (defensive).
    """
    paths: Set[str] = set()
    for url in urls:
        if url.startswith(CDN_HOST_PREFIX):
            paths.add(url[len(CDN_HOST_PREFIX):])
    return paths


# ---------------------------------------------------------------------------
# R2 listing
# ---------------------------------------------------------------------------


def list_r2_objects() -> Set[str]:
    """
    Run `aws s3 ls --recursive` under media/ in the portfolio bucket and
    parse the output into a set of object paths (each starts with "media/").

    Raises SystemExit(1) if the aws command fails.
    """
    cmd = [
        "aws",
        "s3",
        "ls",
        f"s3://{R2_BUCKET}/media/",
        "--recursive",
        "--profile",
        R2_PROFILE,
        "--endpoint-url",
        R2_ENDPOINT,
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    except FileNotFoundError:
        print(
            "❌ `aws` CLI not found in PATH. Install awscli and configure the "
            "`r2` profile before running this script.",
            file=sys.stderr,
        )
        sys.exit(1)

    if result.returncode != 0:
        print("❌ aws s3 ls failed:", file=sys.stderr)
        if result.stderr:
            print(result.stderr.strip(), file=sys.stderr)
        if result.stdout:
            print(result.stdout.strip(), file=sys.stderr)
        sys.exit(1)

    objects: Set[str] = set()
    for line in result.stdout.splitlines():
        line = line.rstrip()
        if not line:
            continue
        # Each line: "2026-05-27 12:34:56     12345 media/slug/file.ext"
        parts = line.split(None, 3)
        if len(parts) < 4:
            continue
        path = parts[3]
        if path.startswith("media/"):
            objects.add(path)

    return objects


# ---------------------------------------------------------------------------
# Report writing
# ---------------------------------------------------------------------------


def _orphan_slug_segment(path: str) -> str:
    """
    Group orphans by their first path segment after `media/`. For both
    `media/{slug}/...` and `media/collection/{slug}/...` /
    `media/item/{slug}.ext`, this returns the first segment after `media/`.
    """
    # path looks like "media/foo/bar/baz.ext"
    parts = path.split("/", 2)
    if len(parts) >= 2:
        return parts[1]
    return "(top-level)"


def _rm_one_liner(path: str) -> str:
    return (
        f"# aws s3 rm s3://{R2_BUCKET}/{path} "
        f"--profile {R2_PROFILE} --endpoint-url {R2_ENDPOINT}"
    )


def write_report(
    report_path: Path,
    total_r2: int,
    total_referenced: int,
    orphans: List[str],
) -> None:
    """Write the markdown orphan report."""
    report_path.parent.mkdir(parents=True, exist_ok=True)

    grouped: dict = {}
    for path in orphans:
        grouped.setdefault(_orphan_slug_segment(path), []).append(path)

    today = date.today().isoformat()

    lines: List[str] = []
    lines.append(f"# CDN Orphan Report — {today}")
    lines.append("")
    lines.append(
        "Auto-generated by `assets/scripts/cdn_cleanup.py`. "
        "Lists R2 objects under `media/` that are not referenced by any "
        "local JSON source (entries, collections, items)."
    )
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- Total CDN objects scanned: **{total_r2}**")
    lines.append(f"- Total referenced in local JSON: **{total_referenced}**")
    lines.append(f"- Orphans: **{len(orphans)}**")
    lines.append("")
    lines.append(
        "Each orphan below is paired with a commented-out `aws s3 rm` "
        "one-liner. Uncomment lines to delete those objects after review."
    )
    lines.append("")

    if not orphans:
        lines.append("_No orphans found. CDN is in sync with local JSON sources._")
        lines.append("")
    else:
        for slug_key in sorted(grouped.keys()):
            entries = sorted(grouped[slug_key])
            lines.append(f"## {slug_key} ({len(entries)})")
            lines.append("")
            for path in entries:
                lines.append(f"- `{path}`")
                lines.append(f"  ```bash")
                lines.append(f"  {_rm_one_liner(path)}")
                lines.append(f"  ```")
            lines.append("")

    report_path.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    print("=" * 60)
    print("CDN CLEANUP — orphan report")
    print("=" * 60)
    print()

    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parents[1]

    entries_dir = project_root / "assets" / "entries"
    collections_dir = project_root / "assets" / "collections"
    items_dir = project_root / "assets" / "items"

    # 1. Walk local JSON and collect referenced CDN URLs
    print("Scanning local JSON sources for CDN URLs…")
    referenced_urls = collect_referenced_urls(
        entries_dir, collections_dir, items_dir
    )
    referenced_paths = cdn_urls_to_s3_paths(referenced_urls)
    print(f"  referenced URLs:  {len(referenced_urls)}")
    print(f"  → S3 paths:       {len(referenced_paths)}")
    print()

    # 2. List R2 objects under media/
    print("Listing R2 objects under media/…")
    r2_objects = list_r2_objects()
    print(f"  R2 objects:       {len(r2_objects)}")
    print()

    # 3. Diff
    orphans = sorted(r2_objects - referenced_paths)
    print(f"Orphans (in R2, not referenced): {len(orphans)}")
    print()

    # 4. Write report
    today = date.today().isoformat().replace("-", "_")
    report_path = (
        project_root
        / "assets" / "docs" / "archive" / "v4_2"
        / f"cdn_orphans_{today}.md"
    )
    write_report(report_path, len(r2_objects), len(referenced_paths), orphans)

    print(f"✨ Report written to: {report_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
