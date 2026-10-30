/* Laura's Restaurant — progressive enhancements (vanilla ES6, no dependencies) */
(() => {
  'use strict';

  const DESKTOP_QUERY = '(min-width: 62em)';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---------------------------------------------------------------- Mobile navigation */
  const initNavigation = () => {
    const header = qs('[data-header]');
    const toggle = qs('[data-nav-toggle]');
    const nav = qs('[data-nav]');
    if (!header || !toggle || !nav) return;

    const label = qs('[data-nav-toggle-label]', toggle);
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const outside = qsa('body > :not(.site-header):not(script):not(svg)');

    const setOpen = (open, { restoreFocus = true } = {}) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close menu' : 'Open menu';
      nav.classList.toggle('is-open', open);
      header.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      outside.forEach((el) => { el.inert = open; });

      if (open) {
        qs('a', nav)?.focus({ preventScroll: true });
      } else if (restoreFocus) {
        toggle.focus({ preventScroll: true });
      }
    };

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    // The panel is hidden by visibility, so its links leave the tab order when closed.
    toggle.addEventListener('click', () => setOpen(!isOpen()));

    nav.addEventListener('click', ({ target }) => {
      if (target.closest('a') && isOpen()) setOpen(false, { restoreFocus: false });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) setOpen(false);
    });

    desktop.addEventListener('change', ({ matches }) => {
      if (matches && isOpen()) setOpen(false, { restoreFocus: false });
    });
  };

  /* ------------------------------------------------------- Header & back-to-top state */
  const initScrollState = () => {
    const header = qs('[data-header]');
    const hero = qs('[data-hero]');
    const backToTop = qs('[data-back-to-top]');
    if (!('IntersectionObserver' in window)) {
      header?.classList.add('is-scrolled');
      backToTop?.classList.add('is-visible');
      return;
    }

    // A small sentinel at the top of the page replaces a scroll listener.
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none;';
    document.body.prepend(sentinel);

    new IntersectionObserver(([entry]) => {
      header?.classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(sentinel);

    if (hero && backToTop) {
      new IntersectionObserver(([entry]) => {
        backToTop.classList.toggle('is-visible', !entry.isIntersecting);
      }, { rootMargin: '0px 0px -40% 0px' }).observe(hero);
    }
  };

  /* --------------------------------------------------------------------- Scrollspy */
  const initScrollSpy = () => {
    const links = qsa('[data-nav-link]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const linkById = new Map(
      links.map((link) => [link.getAttribute('href').slice(1), link])
    );
    const sections = [...linkById.keys()]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const setActive = (id) => {
      linkById.forEach((link, key) => {
        const active = key === id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    // Only the section crossing the horizontal middle band of the viewport is "current".
    const observer = new IntersectionObserver((entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach(({ target }) => setActive(target.id));
    }, { rootMargin: '-45% 0px -54% 0px' });

    sections.forEach((section) => observer.observe(section));
  };

  /* ----------------------------------------------------------------- Scroll reveal */
  const initReveal = () => {
    const items = qsa('.reveal');
    if (!items.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.remove('reveal'));
      return;
    }

    // Once revealed, drop the helper classes so components regain their own transitions.
    const onTransitionEnd = (event) => {
      const el = event.currentTarget;
      if (event.target !== el || event.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', onTransitionEnd);
      el.classList.remove('reveal', 'is-visible');
      el.style.removeProperty('--i');
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        target.addEventListener('transitionend', onTransitionEnd);
        target.classList.add('is-visible');
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach((el) => observer.observe(el));
  };

  const init = () => {
    initNavigation();
    initScrollState();
    initScrollSpy();
    initReveal();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
