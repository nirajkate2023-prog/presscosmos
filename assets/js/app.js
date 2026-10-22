/* ==========================================================================
   PressCosmos — interaction & motion engine
   No dependencies. Progressive enhancement: everything degrades gracefully.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------ */
  const STORAGE_THEME = 'presscosmos:theme';
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f7fd' : '#04050d');
  };

  $$('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_THEME, next); } catch (e) { /* storage blocked */ }
      btn.setAttribute('aria-pressed', String(next === 'light'));
    });
  });

  /* ------------------------------------------------------------------
     Header: stuck state, mobile nav, dropdowns
     ------------------------------------------------------------------ */
  const header = $('[data-header]');
  const navList = $('[data-nav-list]');
  const navToggle = $('[data-nav-toggle]');

  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // On mobile, top-level items with children expand instead of navigating.
    $$('.nav-item', navList).forEach((item) => {
      const link = $('.nav-link', item);
      const panel = $('.dropdown', item);
      if (!panel || !link) return;
      link.setAttribute('aria-expanded', 'false');
      link.addEventListener('click', (e) => {
        if (window.innerWidth > 1080) return;
        e.preventDefault();
        const open = item.classList.toggle('is-open');
        link.setAttribute('aria-expanded', String(open));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ------------------------------------------------------------------
     Scroll progress
     ------------------------------------------------------------------ */
  const progress = $('[data-progress]');
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  /* ------------------------------------------------------------------
     Reveal on scroll (IntersectionObserver) + native scroll-driven upgrade
     ------------------------------------------------------------------ */
  const revealTargets = $$('[data-reveal], [data-stagger]');
  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealTargets.forEach((el) => io.observe(el));
    }
  }

  /* ------------------------------------------------------------------
     Kinetic headline (word-by-word rise)
     ------------------------------------------------------------------ */
  $$('[data-kinetic]').forEach((el) => {
    if (reduceMotion) return;
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const outer = document.createElement('span');
      outer.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.setProperty('--i', String(i));
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ------------------------------------------------------------------
     Spotlight + tilt cards
     ------------------------------------------------------------------ */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('.card, .spotlight, .story, .plan').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });

    $$('[data-tilt]').forEach((el) => {
      const strength = Number(el.dataset.tilt) || 7;
      const reset = () => { el.style.transform = ''; };
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateY(-3px)`;
      });
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset);
    });
  }

  /* ------------------------------------------------------------------
     Count-up stats
     ------------------------------------------------------------------ */
  const counters = $$('[data-count]');
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const duration = Number(el.dataset.duration || 1500);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { runCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ------------------------------------------------------------------
     Accordion (FAQ)
     ------------------------------------------------------------------ */
  $$('[data-accordion]').forEach((group) => {
    const single = group.dataset.accordion === 'single';
    $$('.faq-item', group).forEach((item, index) => {
      const btn = $('.faq-q', item);
      const panel = $('.faq-a', item);
      if (!btn || !panel) return;
      const panelId = panel.id || `faq-panel-${index}-${Math.random().toString(36).slice(2, 7)}`;
      panel.id = panelId;
      btn.setAttribute('aria-controls', panelId);
      btn.setAttribute('aria-expanded', 'false');
      panel.style.height = '0px';

      const setOpen = (open) => {
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        panel.style.height = open ? `${panel.scrollHeight}px` : '0px';
      };

      btn.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        if (single) $$('.faq-item', group).forEach((other) => { if (other !== item) {
          other.classList.remove('is-open');
          const ob = $('.faq-q', other); const op = $('.faq-a', other);
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (op) op.style.height = '0px';
        } });
        setOpen(willOpen);
      });

      window.addEventListener('resize', () => {
        if (item.classList.contains('is-open')) panel.style.height = `${panel.scrollHeight}px`;
      });
    });
  });

  /* ------------------------------------------------------------------
     Table of contents active tracking
     ------------------------------------------------------------------ */
  const tocLinks = $$('[data-toc] a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const sections = tocLinks
      .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach((s) => tio.observe(s));
  }

  /* ------------------------------------------------------------------
     Back to top
     ------------------------------------------------------------------ */
  const toTop = $('[data-to-top]');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('is-visible', window.scrollY > 900);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ------------------------------------------------------------------
     Cookie consent
     ------------------------------------------------------------------ */
  const CONSENT_KEY = 'presscosmos:consent';
  const consent = $('[data-consent]');
  if (consent) {
    let stored = null;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) { stored = 'blocked'; }
    if (!stored) setTimeout(() => consent.classList.add('is-visible'), 1200);
    $$('[data-consent-action]', consent).forEach((btn) => {
      btn.addEventListener('click', () => {
        try { localStorage.setItem(CONSENT_KEY, btn.dataset.consentAction); } catch (e) { /* ignore */ }
        consent.classList.remove('is-visible');
      });
    });
  }

  /* ------------------------------------------------------------------
     Forms (client-side validation + optimistic confirmation)
     ------------------------------------------------------------------ */
  $$('form[data-form]').forEach((form) => {
    const status = $('[data-form-status]', form);
    const kind = form.dataset.form;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const submitBtn = $('[type="submit"]', form);
      const label = submitBtn ? submitBtn.innerHTML : '';

      if (status) {
        status.className = 'form-status is-visible is-ok';
        status.textContent = 'Sending your submission…';
      }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Working…'; }

      // No backend in this build: simulate the round trip and show the
      // confirmation state. Point data-endpoint at your API to go live.
      window.setTimeout(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = label; }
        if (status) {
          status.className = 'form-status is-visible is-ok';
          status.textContent = kind === 'newsletter'
            ? 'You are on the list. Check your inbox to confirm.'
            : 'Received. Our editorial team replies within one business day — check your inbox for the confirmation email.';
        }
        form.reset();
      }, 900);
    });
  });

  /* ------------------------------------------------------------------
     Newsroom filter + search
     ------------------------------------------------------------------ */
  const filterRoot = $('[data-filter-root]');
  if (filterRoot) {
    const items = $$('[data-filter-item]', filterRoot);
    const search = $('[data-filter-search]', filterRoot);
    const chips = $$('[data-filter-chip]', filterRoot);
    const empty = $('[data-filter-empty]', filterRoot);
    const count = $('[data-filter-count]', filterRoot);
    let activeTag = 'all';

    const apply = () => {
      const q = (search?.value || '').trim().toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const tags = (item.dataset.tags || '').toLowerCase();
        const text = item.textContent.toLowerCase();
        const tagOk = activeTag === 'all' || tags.includes(activeTag);
        const queryOk = !q || text.includes(q);
        const show = tagOk && queryOk;
        item.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible !== 0;
      if (count) count.textContent = String(visible);
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        activeTag = (chip.dataset.filterChip || 'all').toLowerCase();
        chips.forEach((c) => c.classList.toggle('is-active', c === chip));
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
    apply();
  }

  /* ------------------------------------------------------------------
     Reading progress for long-form pages
     ------------------------------------------------------------------ */
  const readingBar = $('[data-reading-progress]');
  const articleBody = $('[data-article-body]');
  if (readingBar && articleBody) {
    const update = () => {
      const rect = articleBody.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const ratio = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
      readingBar.style.transform = `scaleX(${ratio})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ------------------------------------------------------------------
     Year stamp
     ------------------------------------------------------------------ */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ------------------------------------------------------------------
     Copy-to-clipboard helpers (media kit / press contact)
     ------------------------------------------------------------------ */
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = 'Copied';
        window.setTimeout(() => { btn.textContent = original; }, 1600);
      } catch (e) { /* clipboard unavailable */ }
    });
  });

  /* ------------------------------------------------------------------
     Scroll-linked parallax for hero art
     ------------------------------------------------------------------ */
  if (!reduceMotion && window.matchMedia('(min-width: 900px)').matches) {
    const parallaxEls = $$('[data-parallax]');
    if (parallaxEls.length) {
      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const y = window.scrollY;
          parallaxEls.forEach((el) => {
            const speed = Number(el.dataset.parallax) || 0.06;
            el.style.transform = `translate3d(0, ${(y * speed).toFixed(2)}px, 0)`;
          });
          raf = 0;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }
})();
