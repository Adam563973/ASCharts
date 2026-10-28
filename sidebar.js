(() => {
  'use strict';

  const A = window.ASCharts;
  if (!A) return;

  /* =============================================================
     ASCharts — sidebar.js
     Sidebar navigation icons, collapse control and page motion.
     ============================================================= */

  const NS = 'http://www.w3.org/2000/svg';

  const ICONS = {
    behaviour: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    announcements: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    homework: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    detentions: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    wellbeing: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
    timetable: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    attendance: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    concern: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    messages: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    rewards: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    badges: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    classes: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    fallback: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
    panelClose: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
    panelOpen: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',
    arrowUp: '<path d="m18 15-6-6-6 6"/>',
  };

  const LABEL_ICON = [
    [/behaviou?r/i, 'behaviour'],
    [/announce/i, 'announcements'],
    [/homework/i, 'homework'],
    [/detention/i, 'detentions'],
    [/wellbeing/i, 'wellbeing'],
    [/timetable/i, 'timetable'],
    [/attendance/i, 'attendance'],
    [/concern/i, 'concern'],
    [/message/i, 'messages'],
    [/reward|shop/i, 'rewards'],
    [/badge|award/i, 'badges'],
    [/class/i, 'classes'],
  ];

  function makeIcon(name) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.9');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('as-icon');
    svg.dataset.icon = name;
    svg.innerHTML = ICONS[name] || ICONS.fallback;
    return svg;
  }

  function iconFor(label) {
    const hit = LABEL_ICON.find(([pattern]) => pattern.test(label));
    return hit ? hit[1] : 'fallback';
  }

  function isActiveItem(item) {
    if (item.matches('.Mui-selected, [aria-current="page"], [aria-selected="true"]')) return true;
    return [...item.classList].some((name) => /^jss\d+$/.test(name)) && !item.classList.contains('false');
  }

  function upgradeMenu() {
    for (const item of document.querySelectorAll('.desktop-drawer-pupil-menu-item')) {
      const iconBox = item.querySelector('.MuiListItemIcon-root');
      if (iconBox) {
        const name = iconFor(item.textContent.trim());
        const current = iconBox.querySelector(':scope > svg.as-icon');
        if (!current || current.dataset.icon !== name) {
          if (current) current.remove();
          iconBox.appendChild(makeIcon(name));
        }
      }
      const active = isActiveItem(item);
      if (active !== item.hasAttribute('data-as-active')) item.toggleAttribute('data-as-active', active);
    }
  }

  function updateToggleButton(button) {
    if (!button) return;
    const hidden = A.getBool('sidebarHidden');
    button.replaceChildren(makeIcon(hidden ? 'panelOpen' : 'panelClose'));
    button.title = hidden ? 'Show sidebar' : 'Hide sidebar';
    button.setAttribute('aria-label', button.title);
    button.setAttribute('aria-expanded', String(!hidden));
  }

  function ensureToggle() {
    const hasDrawer = !!document.querySelector('.desktop-drawer');
    const toolbar = document.querySelector('#desktop-app header .MuiToolbar-root');
    let button = document.querySelector('.as-sidebar-toggle');

    if (!hasDrawer || !toolbar) {
      if (button) button.remove();
      document.documentElement.classList.remove('as-sidebar-ready');
      return;
    }

    document.documentElement.classList.add('as-sidebar-ready');

    if (!button || button.parentElement !== toolbar) {
      if (button) button.remove();
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'as-sidebar-toggle';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        A.set('sidebarHidden', A.getBool('sidebarHidden') ? '0' : '1');
        updateToggleButton(button);
        setTimeout(() => window.dispatchEvent(new Event('resize')), 320);
      });
      toolbar.prepend(button);
    }

    updateToggleButton(button);
  }

  const CARD_SELECTOR = [
    '.calendar-header',
    '.announcement-card',
    '.homework-group',
    '.activity-entry',
    '.detentions-page > div',
    '.timetable-header .MuiPaper-rounded',
    '.attendance-page > div > *',
    '.mental-health-page > div',
    '.report-concern-page > *',
  ].join(', ');

  function animateIn(element, delayMs) {
    element.style.setProperty('--as-delay', delayMs + 'ms');
    element.classList.add('as-in');
    element.addEventListener('animationend', () => {
      element.classList.remove('as-in');
      element.style.removeProperty('--as-delay');
    }, { once: true });
  }

  function animatePages() {
    if (!A.getBool('pageTransitions')) return;
    const appHeader = document.querySelector('#desktop-app header');
    const main = appHeader && appHeader.nextElementSibling;
    if (!main) return;

    for (const page of main.querySelectorAll('[class*="-page"]')) {
      if (page.dataset.asSeen) continue;
      if (page.parentElement.closest('[class*="-page"]')) continue;
      page.dataset.asSeen = '1';
      animateIn(page, 0);
      const cards = [...page.querySelectorAll(CARD_SELECTOR)]
        .filter((card) => !card.parentElement.closest(CARD_SELECTOR));
      cards.forEach((card, index) => animateIn(card, Math.min(index, 8) * 45 + 40));
    }
  }

  function replayPageMotion() {
    if (!A.getBool('pageTransitions')) return;
    document.querySelectorAll('[data-as-seen]').forEach((element) => delete element.dataset.asSeen);
    setTimeout(animatePages, 80);
  }

  function markTimetableSelection() {
    const rootStyle = getComputedStyle(document.documentElement);
    const accentRgb = rootStyle.getPropertyValue('--as-accent-rgb').trim();
    const accent = accentRgb ? `rgb(${accentRgb.replace(/\s*,\s*/g, ', ')})` : '';

    for (const day of document.querySelectorAll('.timetable-header .MuiPaper-rounded')) {
      const background = getComputedStyle(day).backgroundColor;
      const selected = day.matches('.Mui-selected, [aria-selected="true"], [class*="selected"]') ||
        !!day.querySelector('.Mui-selected, [class*="selected"]') ||
        background === 'rgb(32, 150, 243)' ||
        (accent && background === accent);
      if (selected !== day.hasAttribute('data-as-selected')) day.toggleAttribute('data-as-selected', selected);
    }
  }

  function scrollContainer() {
    return document.querySelector('#desktop-app header + div') || document.scrollingElement;
  }

  let scrollBound = false;
  let progressEl = null;

  function updateScrollTop() {
    const button = document.querySelector('.as-scroll-top');
    if (!button) return;
    const container = scrollContainer();
    const offset = Math.max(
      container && typeof container.scrollTop === 'number' ? container.scrollTop : 0,
      window.scrollY || 0
    );
    button.classList.toggle('as-visible', offset > 420);
  }

  function updateScrollProgress() {
    if (!progressEl) return;
    const container = scrollContainer();
    const doc = document.scrollingElement || document.documentElement;
    let ratio = 0;

    if (container && container !== doc && container.scrollHeight > container.clientHeight + 4) {
      ratio = container.scrollTop / (container.scrollHeight - container.clientHeight);
    } else {
      const top = window.scrollY || doc.scrollTop || 0;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      ratio = top / max;
    }

    ratio = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0));
    progressEl.style.setProperty('--as-progress', ratio.toFixed(4));
    progressEl.classList.toggle('as-visible', ratio > 0.004);
  }

  function bindScrollTop() {
    if (scrollBound) return;
    scrollBound = true;
    const onScroll = () => {
      updateScrollTop();
      updateScrollProgress();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  function ensureScrollTop() {
    let button = document.querySelector('.as-scroll-top');
    if (!A.getBool('scrollTop')) {
      if (button) button.remove();
      return;
    }

    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'as-scroll-top';
      button.title = 'Back to top';
      button.setAttribute('aria-label', 'Back to top');
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS.arrowUp + '</svg>';
      button.addEventListener('click', () => {
        const behavior = (A.getBool('reduceMotion') || A.get('animation') === 'off') ? 'auto' : 'smooth';
        const container = scrollContainer();
        if (container && typeof container.scrollTo === 'function') container.scrollTo({ top: 0, behavior });
        window.scrollTo({ top: 0, behavior });
      });
      document.body.appendChild(button);
      bindScrollTop();
    }

    updateScrollTop();
  }

  function ensureScrollProgress() {
    if (!A.getBool('scrollProgress')) {
      if (progressEl) {
        progressEl.remove();
        progressEl = null;
      }
      return;
    }

    if (!progressEl) {
      progressEl = document.createElement('div');
      progressEl.className = 'as-scroll-progress';
      progressEl.setAttribute('aria-hidden', 'true');
      progressEl.innerHTML = '<span></span>';
      document.body.appendChild(progressEl);
      bindScrollTop();
    }

    updateScrollProgress();
  }

  function run() {
    upgradeMenu();
    ensureToggle();
    A.applySidebarWidth(A.get('sidebarWidth'));
    animatePages();
    markTimetableSelection();
    ensureScrollTop();
    ensureScrollProgress();
  }

  run();
  window.addEventListener('load', run, { once: true });
  window.addEventListener('hashchange', replayPageMotion);
  window.addEventListener('popstate', replayPageMotion);

  document.addEventListener('ascharts:setting-changed', (event) => {
    const key = event.detail && event.detail.key;
    if (key === 'sidebarHidden') ensureToggle();
    if (key === 'sidebarWidth') A.applySidebarWidth(A.get('sidebarWidth'));
    if (key === 'scrollTop') ensureScrollTop();
    if (key === 'scrollProgress') ensureScrollProgress();
    if (key === 'pageTransitions' && A.getBool('pageTransitions')) {
      document.querySelectorAll('[data-as-seen]').forEach((element) => delete element.dataset.asSeen);
      animatePages();
    }
  });

  window.addEventListener('ascharts:settings-imported', run);
  window.addEventListener('ascharts:settings-reset', run);

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      run();
    }, 100);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'aria-selected', 'aria-current'],
  });
})();
