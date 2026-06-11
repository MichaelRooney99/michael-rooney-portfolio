# michaelrooney.dev

Personal portfolio and journal — built from scratch with semantic HTML, CSS custom properties, and vanilla JavaScript. 
No frameworks, no build step.

**Live site:** [michaelrooney.dev](https://michaelrooney.dev)

---

## Overview

A portfolio site that doubles as a public journal documenting a career transition into IT and networking. 
The design prioritizes readability and performance over tooling complexity — everything ships as static files.

The journal section is the main living area of the site. 
It covers homelab infrastructure (five-node Proxmox cluster, OPNsense, Prometheus/Grafana, Ansible, Vaultwarden), 
front-end coursework projects, and the process of studying toward Network+ and CCNA while working full-time.

---

## Structure

```
/
├── index.html              # Homepage with hero, work teasers, about, contact
├── journal.html            # Journal index with tag filtering
├── portfolio-showcase.html # Full project list
├── sitemap.xml
├── css/
│   └── styles.css          # All styles — design tokens, components, responsive
├── js/
│   └── main.js             # Scroll reveal, nav active state, magnetic hover, tag filter
└── journal/
    └── *.html              # Individual journal entries
```

---

## Design

- **Typography:** DM Serif Display (headings) + DM Sans (body)
- **Theme:** Warm dark — `#0e0d0b` background, `#c8622a` accent
- **Motion:** Scroll-triggered reveal animations; all motion respects `prefers-reduced-motion`
- **Accessibility:** Skip link, semantic landmarks, `focus-visible` states, `aria-label` on interactive elements

---

## Features

- Tag-based journal filtering (Homelab, Learning, Projects, Certs) — client-side, no page reload
- Magnetic hover effect on pointer devices
- Scroll-spy nav with active underline
- Intersection Observer scroll reveal and stagger animations
- Responsive down to 375px

---

## Adding a Journal Entry

1. Create `journal/MM-DD-YYYY.html` using the existing entry structure:
   - `back-link` → `entry-header` (with `entry-meta` + tags) → `prose` div → `entry-nav`
2. Add a `<li>` to the entry list in `journal.html` with the correct `data-tags` attribute
3. Add the URL to `sitemap.xml`

---

## Local Development

No build step required. Open with any static file server:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

---

## License

Content and writing © Michael Rooney. Code is available for reference.