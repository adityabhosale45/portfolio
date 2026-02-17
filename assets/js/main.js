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

// Analytics tracking
(function initAnalytics() {
  const ANALYTICS_KEY = 'portfolio_analytics';
  const VISITOR_ID_KEY = 'portfolio_visitor_id';
  
  function getOrCreateVisitorId() {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  }
  
  function updateAnalytics() {
    let data = JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {
      totalViews: 0,
      uniqueVisitors: new Set(),
      lastVisit: null
    };
    
    data.totalViews = (data.totalViews || 0) + 1;
    const visitorId = getOrCreateVisitorId();
    
    if (!Array.isArray(data.uniqueVisitors)) {
      data.uniqueVisitors = [];
    }
    if (!data.uniqueVisitors.includes(visitorId)) {
      data.uniqueVisitors.push(visitorId);
    }
    
    data.lastVisit = new Date().toLocaleString();
    
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
    updateAnalyticsDisplay();
  }
  
  function updateAnalyticsDisplay() {
    const data = JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {
      totalViews: 0,
      uniqueVisitors: [],
      lastVisit: null
    };
    
    document.getElementById('total-views').textContent = data.totalViews;
    document.getElementById('unique-visitors').textContent = data.uniqueVisitors.length;
    document.getElementById('last-visit').textContent = data.lastVisit || 'Never';
  }
  
  function toggleAnalyticsPanel() {
    const panel = document.getElementById('analytics-panel');
    panel.classList.toggle('visible');
  }
  
  function resetAnalytics() {
    if (confirm('Are you sure you want to reset all analytics data?')) {
      localStorage.removeItem(ANALYTICS_KEY);
      localStorage.removeItem(VISITOR_ID_KEY);
      updateAnalyticsDisplay();
      updateAnalytics();
    }
  }
  
  // Update analytics on page load
  updateAnalytics();
  
  // Toggle panel with Ctrl+Shift+A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      toggleAnalyticsPanel();
    }
  });
  
  // Close button
  const closeBtn = document.getElementById('analytics-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleAnalyticsPanel);
  }
  
  // Reset button
  const resetBtn = document.getElementById('analytics-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAnalytics);
  }
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('analytics-panel');
      if (panel.classList.contains('visible')) {
        panel.classList.remove('visible');
      }
    }
  });
})();
