#!/usr/bin/env python3
"""
add_fallback_og_image.py

Inserts a site-wide fallback og:image + twitter:image on every page that
doesn't already have its own custom og:image, and upgrades
twitter:card from "summary" to "summary_large_image" to match (a
summary_large_image card with no image looks broken, so the two changes
always travel together).

Pages that already have a real, specific og:image (e.g. an entry with an
actual screenshot) are left completely untouched — a generic fallback
would be a downgrade there, not an upgrade.

Covers: the top-level pages (index.html, journal.html,
portfolio-showcase.html), capstone/capstone-index.html, and every entry
in journal/ and capstone/.

Usage:
    python add_fallback_og_image.py --dry-run
    python add_fallback_og_image.py

Run from the repo root. Safe to re-run — files that already have the
fallback (or their own custom image) are skipped automatically.
"""

import argparse
import re
from pathlib import Path

FALLBACK_IMAGE_URL = "https://michaelrooney.dev/img/og-image.png"

ROOT_PAGES = ["index.html", "journal.html", "portfolio-showcase.html"]
ENTRY_DIRS = ["journal", "capstone"]
CAPSTONE_INDEX = "capstone/capstone-index.html"

OG_IMAGE_EXISTS_RE = re.compile(r'<meta property="og:image"')
OG_SITE_NAME_RE = re.compile(r'([ \t]*)<meta property="og:site_name" content="[^"]*" />\n?')
TWITTER_CARD_SUMMARY_RE = re.compile(r'<meta name="twitter:card" content="summary" />')
TWITTER_CARD_LARGE_EXISTS_RE = re.compile(r'<meta name="twitter:card" content="summary_large_image" />')
TWITTER_DESC_RE = re.compile(r'([ \t]*)(<meta name="twitter:description" content="[^"]*" />)\n?')
HEAD_CLOSE_RE = re.compile(r"</head>", re.IGNORECASE)


def collect_target_files() -> list[Path]:
    root = Path(".")
    files = []

    for name in ROOT_PAGES:
        p = root / name
        if p.is_file():
            files.append(p)
        else:
            print(f"Warning: expected root page '{name}' not found, skipping.")

    capstone_index = root / CAPSTONE_INDEX
    if capstone_index.is_file():
        files.append(capstone_index)
    else:
        print(f"Warning: '{CAPSTONE_INDEX}' not found, skipping.")

    for dirname in ENTRY_DIRS:
        target_dir = root / dirname
        if not target_dir.is_dir():
            print(f"Warning: directory '{dirname}/' not found, skipping.")
            continue
        for html_file in sorted(target_dir.glob("*.html")):
            if html_file.name == "capstone-index.html":
                continue  # already added above
            files.append(html_file)

    return files


def process_file(path: Path, dry_run: bool) -> str:
    text = path.read_text(encoding="utf-8")

    if OG_IMAGE_EXISTS_RE.search(text):
        return "skipped (already has a custom og:image)"

    changed = False

    # Insert og:image right before og:site_name, matching its indentation.
    og_match = OG_SITE_NAME_RE.search(text)
    if og_match:
        indent = og_match.group(1)
        og_image_line = f'{indent}<meta property="og:image" content="{FALLBACK_IMAGE_URL}" />\n'
        text = text[: og_match.start()] + og_image_line + text[og_match.start():]
        changed = True
    else:
        # Fallback: insert before </head> if og:site_name isn't found.
        head_match = HEAD_CLOSE_RE.search(text)
        if not head_match:
            return "SKIPPED — no og:site_name and no </head> found"
        og_image_line = f'    <meta property="og:image" content="{FALLBACK_IMAGE_URL}" />\n'
        text = text[: head_match.start()] + og_image_line + text[head_match.start():]
        changed = True

    # Upgrade twitter:card summary -> summary_large_image, if needed.
    if TWITTER_CARD_SUMMARY_RE.search(text):
        text = TWITTER_CARD_SUMMARY_RE.sub(
            '<meta name="twitter:card" content="summary_large_image" />', text, count=1
        )
        changed = True
    elif not TWITTER_CARD_LARGE_EXISTS_RE.search(text):
        return "SKIPPED — no recognizable twitter:card tag found"

    # Insert twitter:image right after twitter:description, matching its indentation.
    tw_match = TWITTER_DESC_RE.search(text)
    if tw_match:
        indent = tw_match.group(1)
        insert_pos = tw_match.end()
        twitter_image_line = f'{indent}<meta name="twitter:image" content="{FALLBACK_IMAGE_URL}" />\n'
        text = text[:insert_pos] + twitter_image_line + text[insert_pos:]
        changed = True
    else:
        return "SKIPPED — no twitter:description found to anchor twitter:image"

    if not changed:
        return "skipped (nothing to change)"

    if not dry_run:
        path.write_text(text, encoding="utf-8")

    return "would update" if dry_run else "updated"


def main():
    parser = argparse.ArgumentParser(description="Add fallback og:image/twitter:image site-wide.")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing files.")
    args = parser.parse_args()

    files = collect_target_files()
    results = {}

    for f in files:
        results[str(f)] = process_file(f, args.dry_run)

    changed = sum(1 for s in results.values() if s in ("updated", "would update"))
    skipped = len(results) - changed

    print(f"\n{'DRY RUN — ' if args.dry_run else ''}Processed {len(results)} files:")
    for filepath, status in results.items():
        marker = "✓" if status in ("updated", "would update") else "·"
        print(f"  {marker} {filepath}: {status}")

    print(f"\n{changed} {'to update' if args.dry_run else 'updated'}, {skipped} skipped.")


if __name__ == "__main__":
    main()
