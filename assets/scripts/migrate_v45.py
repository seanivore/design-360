#!/usr/bin/env python3
"""
v4.5.0 migration — clean retired/dead fields from every entry JSON and add the
`featured` boolean (which replaces the retired `placement` tag category).

What it does (idempotent):
  - Strips retired media fields (img, mobile_img, slideshows, grid(s), bleed,
    bleed_slides) and dead editorial fields (placement, media_url, role_headline,
    hero_btn_cta, final_cta_text, final_btn_cta, skill_summary, process, metric).
  - Sets `featured` = True for any entry that previously had placement "Featured",
    otherwise False.
  - Leaves all role/skill/product/company tags and content fields untouched.
  - Preserves non-ASCII (em-dashes, curly quotes) and 2-space indentation.

Run once from the repo root:  python3 assets/scripts/migrate_v45.py
"""
import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ENTRIES = REPO / "assets" / "entries"

STRIP_KEYS = [
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


def main() -> None:
    count = 0
    for fp in sorted(ENTRIES.glob("uid-*.json")):
        data = json.loads(fp.read_text())
        was_featured = "Featured" in (data.get("placement") or [])
        for key in STRIP_KEYS:
            data.pop(key, None)
        data["featured"] = bool(was_featured)
        fp.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
        count += 1
        flag = "  ★ featured" if was_featured else ""
        print(f"  {fp.name:26}{flag}")
    print(f"\nMigrated {count} entries.")


if __name__ == "__main__":
    main()
