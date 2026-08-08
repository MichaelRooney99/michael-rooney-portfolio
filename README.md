# michaelrooney.dev

Personal portfolio and build journal. Static site, no framework, no build step — plain HTML, CSS, and vanilla JS, deployed as-is.

**Live:** [michaelrooney.dev](https://michaelrooney.dev)
**Author:** Michael Rooney

---

## What this is

A portfolio site with a public build journal attached to it. The journal is the actual point — session-by-session notes on homelab infrastructure, front-end work, and Network+ study, written to be readable by someone who isn't already inside my head. A dedicated sub-journal tracks the Madison College internship capstone (the `status.michaelrooney.dev` status page) separately, with its own hours log.

No React, no bundler, no npm install. Every page is a hand-written `.html` file sharing one stylesheet and one script file.

---

## Tech stack

|Layer|Technology|
|---|---|
|Markup|Semantic HTML, hand-written per page|
|Styling|CSS custom properties (`--text`, `--accent`, `--muted`, `--border`, `--bg-raised`), warm dark color scheme|
|Typography|DM Serif Display (headings) / DM Sans (body)|
|Interactivity|Vanilla JS — no framework|
|Hosting|Static file hosting, no build pipeline|

---

## Site structure

```
michaelrooney.dev/
├── index.html                    ← home — hero, #about, #contact
├── journal.html                  ← journal index — filter bar, capstone banner, entry list
├── portfolio-showcase.html       ← "Work" — project showcase cards
├── robots.txt
├── sitemap.xml
│
├── journal/                      ← general (non-capstone) dated entries
│   ├── 03-16-2026.html … 07-30-2026.html    ← homelab / learning / projects / certs
│   └── n10-009-01.html … n10-009-05.html    ← Network+ N10-009 study notes
│
├── capstone/                     ← capstone-only sub-journal (separate from journal/)
│   ├── capstone-index.html       ← capstone landing — stack, data sources, hours table
│   └── 06-08-2026.html … 07-31-2026.html    ← numbered "Session N" entries
│
├── css/
│   └── styles.css                ← single shared stylesheet, all pages
├── js/
│   └── main.js                   ← nav toggle, scroll-reveal, active-nav-on-scroll,
│                                    magnetic link hover, journal filter buttons
└── img/
    └── favicon/
        └── favicon.svg           ← left-foot footprint — required on every page's <head>
```

**Nav is identical across every page**: `MR` logo → home, then `Work` / `About` / `Journal` / `Contact`, plus a `Capstone` link that only appears active on pages inside `/capstone/`. Relative paths shift by one level inside `/journal/` and `/capstone/` (`../css/styles.css`, `../index.html`, etc.) — this is the most common copy-paste mistake when starting a new entry from an old one.

**`journal/` vs `capstone/` — how to tell which one a new entry belongs in:** determined by content, not date. Capstone-app work (the status page itself — features, bugs, deploys) goes in `capstone/` and needs an hours table row. General homelab/Ansible/networking work goes in `journal/` and does not.

---

## Journal entry anatomy

Every dated entry — general or capstone — follows the same internal structure:

```
entry-header   ← title, date, tags
entry-meta     ← reading time / category chips
prose          ← the actual write-up, semantic headings
entry-nav      ← prev/next links to adjacent entries
```

Capstone entries additionally carry a **Session N** heading (sequential, continuous — never restarts) and contribute a row to the hours table in both `capstone-index.html` and the capstone Obsidian doc (`00-Overview.md`).

---

## Adding a new journal entry — bundled checklist

A new entry is never just the entry file. Each one is one deliverable made of several coordinated edits:

1. New entry `.html` in `journal/` or `capstone/`, matching the `entry-header`/`entry-meta`/`prose`/`entry-nav` structure above
2. Previous most-recent entry's `entry-nav` updated to link forward to the new one
3. `journal.html`'s entry list — new `<li>` prepended (list is `reversed`, newest first)
4. `sitemap.xml` — new `<url>` entry appended
5. If capstone: hours table row added to `capstone-index.html` **and** `00-Overview.md` (same numbers, both places — this project has had a real hours-log math error from these drifting, so ask before guessing on the actual figure)
6. Obsidian changelog entry (Summary/Added/Fixed/Investigated/Verified/Pending)

Favicon (`img/favicon/favicon.svg`, or the correct relative path from subdirectories) must be present in the `<head>` of any new page — it's been missed before.

---

## Accessibility

- Skip-to-content link (`.skip-link`) as the first focusable element on every page
- `role="navigation"` / `aria-label="Primary"` on the nav, `aria-expanded`/`aria-controls` on the hamburger toggle
- Full-card links on project/entry cards rather than a link buried in the text
- Mobile tap targets sized for touch, hamburger nav on all pages (not just some)
- Skills table uses `data-label` attributes so it degrades to a readable stacked layout on narrow viewports instead of a squeezed table

---

## Related

The capstone build journal documents `status.michaelrooney.dev`, a separate live application with its own repo and README — see that project's `README.md` for its architecture, tech stack, and API. This README covers the portfolio/journal site only.

---

## License

Personal site. No license file — reach out before reusing wholesale.