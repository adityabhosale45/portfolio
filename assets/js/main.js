document.addEventListener('DOMContentLoaded', function () {
    // Home link scroll to top
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
      homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-navigation');
    const MOBILE_BP = 768;
  
    // Nav helpers (only used if nav elements exist)
    function closeNav() {
      if (!nav || !navToggle) return;
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
    }

    function updateToggleVisibility() {
      if (!navToggle) return;
      const isMobile = window.innerWidth <= MOBILE_BP;
      navToggle.hidden = !isMobile;
      navToggle.setAttribute('aria-hidden', String(!isMobile));
      if (!isMobile) closeNav();
    }

    // Initialize nav behavior only when elements exist
    if (navToggle && nav) {
      // Ensure toggle visibility & nav state on load
      updateToggleVisibility();
    
      navToggle.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        this.classList.toggle('is-open');
        nav.classList.toggle('open');
      });

      // Close menu when a link is clicked (mobile)
      document.querySelectorAll('.site-nav a').forEach(link => {
        link.addEventListener('click', () => closeNav());
      });
    
      // Close on Escape
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
      });

      // Close on outside click (only relevant for mobile)
      document.addEventListener('click', (e) => {
        const open = nav.classList.contains('open');
        if (!open) return;
        const target = e.target;
        if (window.innerWidth <= MOBILE_BP && !nav.contains(target) && !navToggle.contains(target)) {
          closeNav();
        }
      });

      // Close when resizing to desktop to avoid leaving mobile state enabled
      window.addEventListener('resize', () => {
        updateToggleVisibility();
      });
    } else {
      // Ensure toggle hidden if absent nav
      if (navToggle) {
        navToggle.hidden = true;
        navToggle.setAttribute('aria-hidden', 'true');
      }
    }
  
    // Rotating heading words (About page) — run regardless of nav presence
    (function initRotatingWords() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rotator = document.querySelector('.rotating');
      if (!rotator) return;
      const items = Array.from(rotator.querySelectorAll('.rotating-item'));
      if (!items.length) return;

      let idx = 0;
      const FADE = 500; // must match --rotating-duration in CSS (ms)
      const INTERVAL = 2000; // total time between word transitions

      items.forEach((el, i) => el.classList.toggle('is-visible', i === 0));

      setInterval(() => {
        // fade current out
        items[idx].classList.remove('is-visible');

        // after fade completes, show next
        const nextIdx = (idx + 1) % items.length;
        setTimeout(() => {
          items[nextIdx].classList.add('is-visible');
          idx = nextIdx;
        }, FADE);
      }, INTERVAL);
    })();
  });
  
  window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".hero")?.classList.add("hero-show");
    document.querySelector(".about-container")?.classList.add("about-container-show");
    document.querySelector(".experience-container")?.classList.add("experience-container-show");
  });
