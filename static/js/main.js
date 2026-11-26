(function () {
  'use strict';

  // 0. Light / Dark theme toggle (respects system preference + remembers choice)
  const themeToggle = document.getElementById('themeToggle');
  const themeColorMeta = document.getElementById('themeColorMeta');

  const applyTheme = (theme, persist) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#070b14');
    }
    if (themeToggle) {
      const nextLabel = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
      themeToggle.setAttribute('aria-label', nextLabel);
      themeToggle.setAttribute('title', nextLabel);
    }
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  };

  const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(initialTheme, false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light', true);
    });
  }

  if (window.matchMedia) {
    const colorSchemeMq = window.matchMedia('(prefers-color-scheme: light)');
    const onSchemeChange = (e) => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (saved !== 'light' && saved !== 'dark') {
        applyTheme(e.matches ? 'light' : 'dark', false);
      }
    };
    if (typeof colorSchemeMq.addEventListener === 'function') {
      colorSchemeMq.addEventListener('change', onSchemeChange);
    }
  }

  // 1. Scroll-reveal via IntersectionObserver (with fast-scroll safeguard)
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealElement = (el) => {
      el.classList.add('is-visible');
      observer.unobserve(el);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            revealElement(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -24px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));

    // Ensure fast-scrolled or jumped-past elements always reveal
    let revealTick = false;
    window.addEventListener(
      'scroll',
      () => {
        if (revealTick) return;
        revealTick = true;
        window.requestAnimationFrame(() => {
          revealEls.forEach((el) => {
            if (!el.classList.contains('is-visible')) {
              const rect = el.getBoundingClientRect();
              if (rect.top < window.innerHeight - 20) {
                revealElement(el);
              }
            }
          });
          revealTick = false;
        });
      },
      { passive: true }
    );
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // 2. Top scroll-progress bar
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    let ticking = false;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      progressBar.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateProgress();
  }

  // 3. Smooth expandable panels (Bio & Timeline milestones)
  document.querySelectorAll('[data-expand-target]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-expand-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;
      const isOpen = panel.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      panel.setAttribute('aria-hidden', String(!isOpen));
    });
  });

  // 4. App publisher filter tabs
  const appFilters = document.querySelectorAll('[data-app-filter]');
  const appGroups = document.querySelectorAll('[data-app-group]');
  appFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-app-filter');
      appFilters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      appGroups.forEach((group) => {
        const key = group.getAttribute('data-app-group');
        const show = filter === 'all' || key === filter;
        group.classList.toggle('is-hidden', !show);
        if (show) {
          group.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
        }
      });
    });
  });

  // 5. Stories tabs (Blog / Travel Vlog)
  const storyTabs = document.querySelectorAll('[data-story-tab]');
  const storyGroups = document.querySelectorAll('[data-story-group]');
  storyTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-story-tab');
      storyTabs.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      storyGroups.forEach((group) => {
        const key = group.getAttribute('data-story-group');
        const show = tab === 'all' || key === tab;
        group.classList.toggle('is-hidden', !show);
        if (show) {
          group.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
        }
      });
    });
  });

  // 6. Travel Vlog video lightbox modal
  const modal = document.getElementById('videoModal');
  const modalTitle = document.getElementById('videoModalTitle');
  const modalFrame = document.getElementById('videoModalFrame');
  let lastFocused = null;

  const openVideo = (videoId, title) => {
    if (!modal || !modalFrame || !modalTitle) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = title || 'Travel Vlog';
    modalFrame.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' +
      encodeURIComponent(videoId) +
      '?autoplay=1&rel=0" title="' +
      (title || 'YouTube video').replace(/"/g, '&quot;') +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.video-modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeVideo = () => {
    if (!modal || !modalFrame || modal.hidden) return;
    modal.hidden = true;
    modalFrame.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  document.querySelectorAll('[data-video-id]').forEach((card) => {
    card.addEventListener('click', () => {
      openVideo(card.getAttribute('data-video-id'), card.getAttribute('data-video-title'));
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeVideo);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideo();
  });

  // 7. Subtle cursor-follow spotlight on desktop cards
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-spotlight]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - rect.left + 'px');
        card.style.setProperty('--my', e.clientY - rect.top + 'px');
      });
    });
  }
})();
