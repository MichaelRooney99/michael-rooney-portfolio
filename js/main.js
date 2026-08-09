/* ── Accessibility: Reduced Motion ── */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ── Hero Load ── */
if (!prefersReducedMotion) {
  window.addEventListener("load", () => {
    document.querySelector(".hero-load")?.classList.add("loaded");
  });
}

/* ── Scroll Reveal ── */
if (!prefersReducedMotion) {
  const revealEls = document.querySelectorAll(".reveal, .stagger");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ── Nav: scrolled border ── */
const nav = document.querySelector(".nav");
if (nav) {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

/* ── Nav: mobile collapse ── */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav ul");

if (navToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ── Nav Active Underline ── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a[data-section]");

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.dataset.section === entry.target.id
            );
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

/* ── Magnetic Hover (Pointer Devices Only) ── */
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((link) => {
    const strength = 28;

    link.addEventListener("mousemove", (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      link.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translate(0, 0)";
    });
  });
}

/* ── Journal Tag Filtering + Pagination ── */
const filterBtns  = document.querySelectorAll(".filter-btn");
const entryItems  = document.querySelectorAll(".entry-list li");
const noResults   = document.querySelector(".no-results");
const loadMoreBtn = document.querySelector(".load-more-btn");

const PAGE_SIZE = 10;
let currentFilter = "all";
let revealCount = PAGE_SIZE;

function getMatches(filter) {
  return Array.from(entryItems).filter((item) => {
    const tags = item.dataset.tags || "";
    return filter === "all" || tags.includes(filter);
  });
}

function renderEntries() {
  const matches = getMatches(currentFilter);

  entryItems.forEach((item) => item.classList.add("hidden"));
  matches.slice(0, revealCount).forEach((item) => item.classList.remove("hidden"));

  if (noResults) {
    noResults.classList.toggle("visible", matches.length === 0);
  }

  if (loadMoreBtn) {
    loadMoreBtn.classList.toggle("hidden", revealCount >= matches.length);
  }
}

if (filterBtns.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      revealCount = PAGE_SIZE;
      renderEntries();
    });
  });
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    revealCount += PAGE_SIZE;
    renderEntries();
  });
}

if (entryItems.length) {
  renderEntries();
}
