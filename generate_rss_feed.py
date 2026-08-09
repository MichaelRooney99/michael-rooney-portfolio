#!/usr/bin/env python3
"""
generate_rss_feed.py

Builds a single RSS 2.0 feed (feed.xml) from every journal/ and capstone/
entry, by reading the same og:title / og:description / og:url / <time
datetime> values already sitting in each file's <head> — no new content
to write, just repackaging what's already there.

Entries are sorted newest-first by date, with same-day entries ordered by
filename suffix (e.g. 08-09-2026, then b, then c, then d) so the feed
reads in the same order a human would expect from the site itself.

Usage:
    python generate_rss_feed.py --dry-run     # print the feed, don't write it
    python generate_rss_feed.py               # write feed.xml to repo root

Run from the repo root (the directory containing journal/ and capstone/).
Re-run any time a new entry is added — safe to run repeatedly, it always
rebuilds the whole feed from current files rather than appending.
"""

import argparse
import html
import re
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

SITE_TITLE = "Michael Rooney — Journal"
SITE_LINK = "https://michaelrooney.dev/journal.html"
SITE_DESCRIPTION = "Homelabbing, certifications, front-end development, and the process of transitioning into tech — documented as it happens."
FEED_SELF_URL = "https://michaelrooney.dev/feed.xml"

SKIP_FILENAMES = {
    "journal.html",
    "capstone-index.html",
    "portfolio-showcase.html",
    "index.html",
}

TARGET_DIRS = ["journal", "capstone"]

OG_TITLE_RE = re.compile(r'<meta property="og:title" content="([^"]*)"')
OG_DESC_RE = re.compile(r'<meta property="og:description" content="([^"]*)"')
OG_URL_RE = re.compile(r'<meta property="og:url" content="([^"]*)"')
TIME_RE = re.compile(r'<time datetime="([^"]*)"')


def normalize_date(raw: str):
    """Convert either MM-DD-YYYY or YYYY-MM-DD into a date() object. Returns None if unparseable."""
    iso_match = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", raw)
    if iso_match:
        y, m, d = iso_match.groups()
        try:
            return datetime(int(y), int(m), int(d), tzinfo=timezone.utc)
        except ValueError:
            return None

    mdy_match = re.fullmatch(r"(\d{2})-(\d{2})-(\d{4})", raw)
    if mdy_match:
        m, d, y = mdy_match.groups()
        try:
            return datetime(int(y), int(m), int(d), tzinfo=timezone.utc)
        except ValueError:
            return None

    return None


SITE_SUFFIX_RE = re.compile(r"\s+—\s+Michael Rooney\s*$")


def strip_site_suffix(title: str) -> str:
    """Remove only the trailing ' — Michael Rooney' site name, not any earlier
    em dash — titles like 'Session 24 — Two Columns...' have two dashes, and
    a naive split-on-first-dash truncates the real title down to 'Session 24'."""
    return SITE_SUFFIX_RE.sub("", title).strip()


def collect_entries():
    entries = []
    root = Path(".")

    for dirname in TARGET_DIRS:
        target_dir = root / dirname
        if not target_dir.is_dir():
            print(f"Warning: directory '{dirname}/' not found, skipping.")
            continue

        for html_file in sorted(target_dir.glob("*.html")):
            if html_file.name in SKIP_FILENAMES:
                continue

            text = html_file.read_text(encoding="utf-8")

            title_match = OG_TITLE_RE.search(text)
            desc_match = OG_DESC_RE.search(text)
            url_match = OG_URL_RE.search(text)
            time_match = TIME_RE.search(text)

            if not (title_match and desc_match and url_match and time_match):
                print(f"  SKIPPED {html_file} — missing required meta fields")
                continue

            pub_date = normalize_date(time_match.group(1))
            if pub_date is None:
                print(f"  SKIPPED {html_file} — unparseable date '{time_match.group(1)}'")
                continue

            entries.append({
                "title": html.unescape(strip_site_suffix(title_match.group(1))),
                "description": html.unescape(desc_match.group(1)),
                "url": url_match.group(1),
                "pub_date": pub_date,
                "filename": html_file.stem,  # used as a same-day tiebreaker
            })

    # Newest first: by date, then by filename (so same-day 'b'/'c'/'d' suffixes
    # sort after the base entry, matching the site's own newest-first ordering).
    entries.sort(key=lambda e: (e["pub_date"], e["filename"]), reverse=True)
    return entries


def build_rss(entries) -> str:
    now = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")

    items = []
    for entry in entries:
        pub_date_str = entry["pub_date"].strftime("%a, %d %b %Y %H:%M:%S GMT")
        items.append(f"""    <item>
      <title>{escape(entry['title'])}</title>
      <link>{escape(entry['url'])}</link>
      <guid isPermaLink="true">{escape(entry['url'])}</guid>
      <pubDate>{pub_date_str}</pubDate>
      <description><![CDATA[{entry['description']}]]></description>
    </item>""")

    items_xml = "\n".join(items)

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{escape(SITE_TITLE)}</title>
    <link>{escape(SITE_LINK)}</link>
    <description>{escape(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>{now}</lastBuildDate>
    <atom:link href="{escape(FEED_SELF_URL)}" rel="self" type="application/rss+xml" />
{items_xml}
  </channel>
</rss>
"""


def main():
    parser = argparse.ArgumentParser(description="Generate feed.xml from journal/capstone entries.")
    parser.add_argument("--dry-run", action="store_true", help="Print the feed without writing feed.xml.")
    args = parser.parse_args()

    print("Scanning entries...")
    entries = collect_entries()
    print(f"\nCollected {len(entries)} entries for the feed.")

    rss_xml = build_rss(entries)

    if args.dry_run:
        print("\n--- DRY RUN: feed.xml would contain ---\n")
        print(rss_xml)
    else:
        Path("feed.xml").write_text(rss_xml, encoding="utf-8")
        print(f"\nWrote feed.xml with {len(entries)} items to repo root.")
        print("Don't forget to add this to <head> on journal.html and index.html if not already present:")
        print('  <link rel="alternate" type="application/rss+xml" title="Michael Rooney — Journal" href="/feed.xml" />')


if __name__ == "__main__":
    main()
