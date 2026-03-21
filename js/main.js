/* Accessibility: Reduced Motion */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* Hero Load */
if (!prefersReducedMotion) {
  window.addEventListener("load", () => {
    document.querySelector(".hero-load")?.classList.add("loaded");
  });
}

/* Scroll Reveal */
if (!prefersReducedMotion) {
  const revealElements = document.querySelectorAll(".reveal, .stagger");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* Nav Active Underline */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a[data-section]");

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
  { threshold: 0.6 }
);

sections.forEach((section) => navObserver.observe(section));

/* Magnetic Hover (Pointer Devices Only) */
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((link) => {
    const strength = 30;

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
     // ── Tag filtering ──
const filterBtns = document.querySelectorAll('.filter-btn');
const entries    = document.querySelectorAll('.entry-list li');
const noResults  = document.querySelector('.no-results');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let visible = 0;
    entries.forEach(entry => {
      const tags = entry.dataset.tags || '';
      const match = filter === 'all' || tags.includes(filter);
      entry.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    noResults.classList.toggle('visible', visible === 0);
  });
});