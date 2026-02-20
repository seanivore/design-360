#!/usr/bin/env python3
"""
Migrate all entry JSONs from v3.2 → v4.0 schema.
- Promotes slug to categorization root
- Replaces placement + tagging with flat tags { role: [], skill: [] }
- Removes breadcrumb from teaser_copy
- Updates schema_version
"""
import json
import glob
import os
import sys

# ─── MAPPING TABLES ────────────────────────────────────────────────

# Old role string → new role tag(s)
ROLE_MAP = {
    "Web Developer": ["Web Developer"],
    "Graphic Designer": ["Graphic Designer"],
    "Creative Director": ["Creative Director"],
    "Social Media Producer": ["Social Media Manager"],
    "Digital Consultant": ["Digital Marketing Manager"],
    "App Developer": ["UX/UI Designer"],
}

# Old technology tags that map to skills
TECH_TO_SKILL = {
    "AI": "Generative AI",
    "Adobe Firefly": "Adobe Firefly",
    "After Effects": "After Effects",
    "Agentic": "Automation",
    "Arc AI": "Generative AI",
    "Behance": None,  # platform, not a skill
    "CMS": "CMS Management",
    "CSS": "HTML/CSS/JS",
    "Canva": None,  # drop
    "CapCut": "CapCut",
    "Claude AI": "Claude/Cursor",
    "Creative Cloud": "Creative Cloud",
    "Cursor": "Claude/Cursor",
    "DaVinci Resolve": "DaVinci Resolve",
    "Dia AI": "Generative AI",
    "Framer": "Framer",
    "Generative": "Generative AI",
    "Git": "Git",
    "GitHub Pages": "GitHub Pages",
    "HTML": "HTML/CSS/JS",
    "Illustrator": "Illustrator",
    "JavaScript": "HTML/CSS/JS",
    "Jekyll": "Jekyll",
    "Lightroom": "Lightroom",
    "Lottie": "Lottie",
    "Make.com": "Make.com",
    "Markdown": None,  # too generic
    "Notion API": "Notion",
    "Photoshop In-Painting": "Photoshop",
    "Python Script": "Python",
    "Responsive": "Responsive Design",
    "Webflow": "Webflow",
}

# Old media tags that are valid skills (deliverable/platform types)
MEDIA_TO_SKILL = {
    "Analytics Dashboard": "Data Visualization",
    "Blog": None,
    "Digital Art": "Illustration",
    "Digital Product": None,
    "E-Commerce": "E-Commerce",
    "Editorial": "Editorial Design",
    "Fashion": None,  # industry, dropping
    "Illustration": "Illustration",
    "Landing Page": "Landing Page Design",
    "Lookbook": "Lookbook Design",
    "Mobile App": None,  # covered by UX/UI Designer role
    "Motion": "Motion Graphics",
    "NFT": None,  # dropping
    "Painting": "Illustration",
    "Portfolio": None,
    "Poster": "Print Layout",
    "Presentation Deck": None,
    "Print": "Print Layout",
    "Progressive Web App": None,
    "Social Media": "Content Production",
    "Template": None,
    "Video": "Video Production",
    "Voice Interface": "Voice Interface",
    "Website": None,  # too generic
}

# Art style media tags — drop all (not job-relevant skills)
ART_STYLES = {
    "Abstract", "Art Deco", "Art Nouveau", "Baroque", "Bauhaus", "Bohemian",
    "Cityscape", "Clouds", "Constructivism", "Cubism", "Cyberpunk", "Fantasy",
    "Fauvism", "Film Noir", "Flora", "Floral", "Forms", "Geometric",
    "Glitch Art", "Gradient", "Impressionism", "Industrial", "Interior",
    "Landscape", "Maximalism", "Minimalism", "Neo-Expressionism", "Otherworldly",
    "Portrait", "Psychedelic", "SaaS", "Sculpture", "Steampunk", "Still Life",
    "Surrealism", "Synthetism", "Victorian", "Waves",
}

# Old skill tags → new skill tags (rename/keep/drop)
SKILL_MAP = {
    "Account Management": None,  # → role: Account Manager (if applicable)
    "Advertising": "Analytics",
    "Animation": "Animation",
    "Art History": "Art Direction",
    "Automation": "Automation",
    "Branding": None,  # → role: Brand Designer
    "Content Production": "Content Production",
    "Conversation Design": "Voice Interface",
    "Copywriting": "Copywriting",
    "DRY Principles": None,  # too technical/niche
    "Editorial Design": "Editorial Design",
    "Fashion Photography": "Photography",
    "Front-End": None,  # covered by Web Developer role
    "Full-Stack": None,  # covered by Web Developer role
    "Graphic Design": None,  # → role: Graphic Designer (no overlap)
    "Illustration": "Illustration",
    "Marketing": None,  # too generic
    "Modularity": None,
    "No-Code Development": "No-Code",
    "Optimization": "A/B Testing",
    "Product": None,  # too vague
    "Product Staging": "Product Staging",
    "Publishing": "Publishing",
    "SaaS": None,  # industry, dropping
    "Scaling System": "Scaling Systems",
    "System Design": "Scaling Systems",
    "Typography": "Typography",
    "UI/UI Writing": "Copywriting",
    "UX/UI Writing": "Copywriting",
    "User Design": None,  # covered by UX/UI Designer role
    "Web Design": None,  # covered by Web Developer role
}

# Additional role inference from old data
def infer_additional_roles(old_cat):
    """Infer additional roles based on old categorization data."""
    extra_roles = set()
    placement = old_cat.get("placement", {})
    tagging = old_cat.get("tagging", {})
    section = placement.get("section", "")
    sub_section = placement.get("sub_section", "")
    techs = tagging.get("technology", [])
    skills = tagging.get("skill", [])

    # Video section → Video Editor
    if section == "Video":
        extra_roles.add("Video Editor")

    # Automation-related → Automation Engineer
    if "Automation" in skills or "Agentic" in techs or "Make.com" in techs:
        extra_roles.add("Automation Engineer")

    # Branding-related → Brand Designer
    if "Branding" in skills:
        extra_roles.add("Brand Designer")

    # Content strategy signals
    if "Copywriting" in skills or "Content Production" in skills:
        extra_roles.add("Content Strategist")

    return list(extra_roles)


def migrate_entry(data):
    """Migrate a single entry from v3.2 to v4.0."""
    cat = data.get("categorization", {})
    placement = cat.get("placement", {})
    tagging = cat.get("tagging", {})

    # ── Build new role array ──
    old_role = tagging.get("role", "")
    new_roles = set()
    if old_role and old_role in ROLE_MAP:
        new_roles.update(ROLE_MAP[old_role])
    elif old_role:
        # Unmapped role — keep as-is but warn
        print(f"  ⚠️  Unmapped role: '{old_role}' — keeping as-is")
        new_roles.add(old_role)

    # Infer additional roles
    extra = infer_additional_roles(cat)
    new_roles.update(extra)

    # ── Build new skill array ──
    new_skills = set()

    # From technology tags
    for tech in tagging.get("technology", []):
        mapped = TECH_TO_SKILL.get(tech)
        if mapped:
            new_skills.add(mapped)
        elif tech not in TECH_TO_SKILL:
            print(f"  ⚠️  Unmapped technology: '{tech}'")

    # From media tags (only deliverable types, not art styles)
    for media in tagging.get("media", []):
        if media in ART_STYLES:
            continue  # drop art styles
        mapped = MEDIA_TO_SKILL.get(media)
        if mapped:
            new_skills.add(mapped)
        elif media not in MEDIA_TO_SKILL:
            print(f"  ⚠️  Unmapped media: '{media}'")

    # From skill tags
    for skill in tagging.get("skill", []):
        mapped = SKILL_MAP.get(skill)
        if mapped:
            new_skills.add(mapped)
        elif skill not in SKILL_MAP:
            print(f"  ⚠️  Unmapped skill: '{skill}'")

    # Remove any skills that duplicate a role name
    role_name_stems = {r.lower().replace(" ", "") for r in new_roles}
    new_skills = {s for s in new_skills if s.lower().replace(" ", "") not in role_name_stems}

    # ── Build new categorization ──
    new_cat = {
        "entry_id": cat.get("entry_id", ""),
        "slug": placement.get("slug", ""),
        "tags": {
            "role": sorted(list(new_roles)),
            "skill": sorted(list(new_skills)),
        }
    }

    # ── Update content (remove breadcrumb) ──
    content = data.get("content", {})
    teaser = content.get("teaser_copy", {})
    if "breadcrumb" in teaser:
        del teaser["breadcrumb"]

    # ── Build new data ──
    new_data = {
        "_metadata": data.get("_metadata", {}),
        "categorization": new_cat,
        "content": content,
    }

    # Update schema version
    if "_metadata" in new_data:
        new_data["_metadata"]["schema_version"] = "4.0"

    # Keep notes if present
    if "notes" in data:
        new_data["notes"] = data["notes"]

    return new_data


def main():
    entries_dir = "assets/entries"
    files = sorted(glob.glob(os.path.join(entries_dir, "uid-*.json")))

    if not files:
        print("❌ No entry files found!")
        sys.exit(1)

    print(f"📂 Found {len(files)} entries to migrate\n")

    errors = []
    for filepath in files:
        filename = os.path.basename(filepath)
        print(f"🔄 {filename}")

        try:
            with open(filepath, 'r') as f:
                data = json.load(f)

            new_data = migrate_entry(data)

            # Validate
            tags = new_data["categorization"]["tags"]
            if not tags["role"]:
                errors.append(f"{filename}: no roles assigned")
            if not tags["skill"]:
                errors.append(f"{filename}: no skills assigned")
            if not new_data["categorization"]["slug"]:
                errors.append(f"{filename}: missing slug")

            # Write back
            with open(filepath, 'w') as f:
                json.dump(new_data, f, indent=4, ensure_ascii=False)
                f.write('\n')

            roles_str = ", ".join(tags["role"])
            skills_str = ", ".join(tags["skill"][:5])
            if len(tags["skill"]) > 5:
                skills_str += f" (+{len(tags['skill'])-5} more)"
            print(f"   ✅ roles: [{roles_str}]")
            print(f"      skills: [{skills_str}]")

        except Exception as e:
            errors.append(f"{filename}: {str(e)}")
            print(f"   ❌ ERROR: {e}")

        print()

    # Summary
    print("=" * 60)
    if errors:
        print(f"\n⚠️  {len(errors)} issues:")
        for e in errors:
            print(f"  - {e}")
    else:
        print(f"\n✅ All {len(files)} entries migrated successfully!")


if __name__ == "__main__":
    main()
