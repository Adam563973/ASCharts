(() => {
  'use strict';

  if (window.top !== window) return;
  const A = window.ASCharts;
  if (!A) return;

  /* =============================================================
     ASCharts — palette.js
     Quick actions (Ctrl/Cmd + K), a shortcut cheat-sheet and a
     handful of small secrets.
     ============================================================= */

  const ICONS = {
    page: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    appearance: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H16a5 5 0 0 0 5-5c0-3.9-4-7-9-7Z"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    accessibility: '<circle cx="12" cy="5" r="2"/><path d="M12 7v6M8 9l4 2 4-2M9 21l3-8 3 8"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    sparkles: '<path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9z"/><path d="M18.5 15.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9Z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
    rows: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    motion: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
    download: '<path d="M12 3v10M8 9l4 4 4-4"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.page) + '</svg>';
  }

  function isEditable(target) {
    return !!(target && target.closest && target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'));
  }

  function pageLabel(element) {
    return (element.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function findPage(label) {
    const wanted = String(label || '').toLowerCase();
    return [...document.querySelectorAll('.desktop-drawer-pupil-menu-item')]
      .find((element) => pageLabel(element).toLowerCase() === wanted);
  }

  function notify(title, message) {
    A.toast({ key: 'palette-action', title, message, tone: 'success', duration: 2.4 });
  }

  function toggleTheme() {
    const dark = document.documentElement.classList.contains('as-dark');
    A.set('theme', dark ? 'light' : 'dark');
    notify('Theme changed', dark ? 'Light mode is on.' : 'Dark mode is on.');
  }

  function toggleDensity() {
    const compact = A.get('density') === 'compact';
    A.set('density', compact ? 'comfortable' : 'compact');
    notify('Density changed', compact ? 'Comfortable spacing restored.' : 'Compact spacing is on.');
  }

  function toggleSidebar() {
    const hidden = A.getBool('sidebarHidden');
    A.set('sidebarHidden', hidden ? '0' : '1');
    notify('Sidebar ' + (hidden ? 'shown' : 'hidden'), hidden ? 'Navigation is back.' : 'More room for your work.');
  }

  function toggleMotion() {
    const reduced = A.getBool('reduceMotion');
    A.set('reduceMotion', reduced ? '0' : '1');
    notify('Motion ' + (reduced ? 'restored' : 'reduced'), reduced ? 'Animations are back on.' : 'Animations are kept to a minimum.');
  }

  function copyPageLink() {
    const url = window.location.href;
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      A.toast({ key: 'palette-action', title: 'Copy unavailable', message: 'Your browser blocked clipboard access.', tone: 'error' });
      return;
    }
    navigator.clipboard.writeText(url).then(
      () => notify('Link copied', 'This page address is on your clipboard.'),
      () => A.toast({ key: 'palette-action', title: 'Copy failed', message: 'Your browser blocked clipboard access.', tone: 'error' })
    );
  }

  function exportSettings() {
    try {
      const data = A.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ascharts-settings-' + A.version + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
      notify('Settings exported', 'Your settings file has been downloaded.');
    } catch (error) {
      A.toast({ key: 'palette-action', title: 'Export failed', message: 'Try again from Settings → Data.', tone: 'error' });
    }
  }

  const SETTINGS_ITEMS = [
    { label: 'Appearance settings', hint: 'Settings', icon: 'appearance', keywords: 'theme accent colour radius', run: () => A.openSettings('appearance') },
    { label: 'Layout settings', hint: 'Settings', icon: 'layout', keywords: 'sidebar density cards homework', run: () => A.openSettings('layout') },
    { label: 'Accessibility settings', hint: 'Settings', icon: 'accessibility', keywords: 'contrast motion font size reading', run: () => A.openSettings('accessibility') },
    { label: 'Profile settings', hint: 'Settings', icon: 'user', keywords: 'name avatar identity', run: () => A.openSettings('profile') },
    { label: 'Features settings', hint: 'Settings', icon: 'sparkles', keywords: 'confetti celebration shortcuts', run: () => A.openSettings('features') },
    { label: 'Data and backup', hint: 'Settings', icon: 'database', keywords: 'import export reset storage', run: () => A.openSettings('data') },
    { label: 'About ASCharts', hint: 'Settings', icon: 'info', keywords: 'version beta credits', run: () => A.openSettings('about') },
  ];

  const ACTIONS = [
    { label: 'Toggle light and dark theme', hint: 'Action', icon: 'moon', keywords: 'appearance dark mode night', run: toggleTheme },
    { label: 'Toggle compact density', hint: 'Action', icon: 'rows', keywords: 'spacing layout comfortable', run: toggleDensity },
    { label: 'Toggle sidebar', hint: 'Action', icon: 'panel', keywords: 'focus hide navigation drawer', run: toggleSidebar },
    { label: 'Toggle reduced motion', hint: 'Action', icon: 'motion', keywords: 'animation accessibility', run: toggleMotion },
    { label: 'Show keyboard shortcuts', hint: 'Action', icon: 'keyboard', keywords: 'help keys hotkeys', run: () => showShortcuts() },
    { label: 'Celebrate', hint: 'Action', icon: 'sparkles', keywords: 'confetti party fun', run: () => { if (typeof A.celebrate === 'function') A.celebrate(); } },
    { label: 'Copy page link', hint: 'Action', icon: 'link', keywords: 'share url clipboard', run: copyPageLink },
    { label: 'Export settings', hint: 'Action', icon: 'download', keywords: 'backup save json data', run: exportSettings },
  ];

  /* ─── Palette ──────────────────────────────────────────── */

  const state = {
    open: false,
    entries: [],
    index: 0,
    overlay: null,
    input: null,
    results: null,
    lastFocus: null,
  };

  function pageEntries() {
    const items = [...document.querySelectorAll('.desktop-drawer-pupil-menu-item')];
    return items.map((element) => {
      const label = pageLabel(element);
      if (!label) return null;
      return {
        label,
        hint: 'Page',
        icon: 'page',
        keywords: 'go navigate open page',
        run: () => {
          const target = findPage(label);
          if (target) target.click();
        },
      };
    }).filter(Boolean);
  }

  function buildPalette() {
    const overlay = document.createElement('div');
    overlay.className = 'as-palette-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = [
      '<div class="as-palette" role="dialog" aria-modal="true" aria-label="Quick actions">',
      '  <div class="as-palette-search">',
      '    <span class="as-palette-search-icon">' + icon('search') + '</span>',
      '    <input class="as-palette-input" type="text" placeholder="Search pages, settings and actions" aria-label="Search quick actions" autocomplete="off" spellcheck="false">',
      '    <kbd class="as-kbd">Esc</kbd>',
      '  </div>',
      '  <div class="as-palette-results" role="listbox" aria-label="Quick actions"></div>',
      '  <div class="as-palette-foot">',
      '    <span><kbd class="as-kbd">↑</kbd><kbd class="as-kbd">↓</kbd> Navigate</span>',
      '    <span><kbd class="as-kbd">↵</kbd> Open</span>',
      '    <span class="as-palette-version">ASCharts ' + A.version + '</span>',
      '  </div>',
      '</div>',
    ].join('');

    document.body.appendChild(overlay);
    state.overlay = overlay;
    state.input = overlay.querySelector('.as-palette-input');
    state.results = overlay.querySelector('.as-palette-results');

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closePalette();
    });

    state.input.addEventListener('input', () => {
      state.index = 0;
      renderPalette();
    });

    state.input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); event.stopPropagation(); move(1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); event.stopPropagation(); move(-1); }
      else if (event.key === 'Home') { event.preventDefault(); event.stopPropagation(); state.index = 0; paintPalette(); }
      else if (event.key === 'End') { event.preventDefault(); event.stopPropagation(); state.index = Math.max(0, state.entries.length - 1); paintPalette(); }
      else if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); activate(state.entries[state.index]); }
      else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closePalette(); }
    });
  }

  function renderPalette() {
    if (!state.results) return;
    const query = (state.input.value || '').trim().toLowerCase();
    const groups = [
      { title: 'Pages', items: pageEntries() },
      { title: 'Settings', items: SETTINGS_ITEMS },
      { title: 'Actions', items: ACTIONS },
    ];

    state.results.replaceChildren();
    state.entries = [];

    for (const group of groups) {
      const matches = group.items.filter((item) => {
        if (!query) return true;
        return (item.label + ' ' + (item.keywords || '')).toLowerCase().includes(query);
      });
      if (!matches.length) continue;

      const heading = document.createElement('div');
      heading.className = 'as-palette-group';
      heading.textContent = group.title;
      state.results.appendChild(heading);

      for (const item of matches) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'as-palette-item';
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', 'false');

        const badge = document.createElement('span');
        badge.className = 'as-palette-item-icon';
        badge.innerHTML = icon(item.icon);

        const copy = document.createElement('span');
        copy.className = 'as-palette-item-copy';
        const title = document.createElement('strong');
        title.textContent = item.label;
        const hint = document.createElement('span');
        hint.textContent = item.hint;
        copy.append(title, hint);

        const tail = document.createElement('span');
        tail.className = 'as-palette-item-hint';
        tail.textContent = item.hint === 'Page' ? 'Go' : 'Run';

        button.append(badge, copy, tail);
        button.addEventListener('mouseenter', () => {
          const index = state.entries.findIndex((entry) => entry.button === button);
          if (index >= 0) { state.index = index; paintPalette(); }
        });
        button.addEventListener('click', () => activate({ item }));

        state.results.appendChild(button);
        state.entries.push({ item, button });
      }
    }

    if (!state.entries.length) {
      const empty = document.createElement('p');
      empty.className = 'as-palette-empty';
      empty.textContent = 'No matches. Try “theme”, “messages” or “settings”.';
      state.results.appendChild(empty);
    }

    state.index = Math.min(state.index, Math.max(0, state.entries.length - 1));
    paintPalette();
  }

  function paintPalette() {
    state.entries.forEach((entry, index) => {
      const active = index === state.index;
      entry.button.classList.toggle('is-active', active);
      entry.button.setAttribute('aria-selected', String(active));
    });
    const active = state.entries[state.index];
    if (active && active.button.scrollIntoView) {
      active.button.scrollIntoView({ block: 'nearest' });
    }
  }

  function move(step) {
    if (!state.entries.length) return;
    state.index = (state.index + step + state.entries.length) % state.entries.length;
    paintPalette();
  }

  function activate(entry) {
    if (!entry) return;
    const item = entry.item;
    closePalette();
    setTimeout(() => {
      try { item.run(); } catch (error) { /* An action must never break the palette. */ }
    }, 30);
  }

  function openPalette() {
    if (!state.overlay) buildPalette();
    if (state.open) return;
    state.open = true;
    state.lastFocus = document.activeElement;
    if (keysOverlay) hideShortcuts();
    A.closeSettings();
    state.overlay.classList.add('as-open');
    state.overlay.setAttribute('aria-hidden', 'false');
    state.input.value = '';
    state.index = 0;
    renderPalette();
    A.lockScroll();
    requestAnimationFrame(() => state.input.focus());
  }

  function closePalette() {
    if (!state.open || !state.overlay) return;
    state.open = false;
    state.overlay.classList.remove('as-open');
    state.overlay.setAttribute('aria-hidden', 'true');
    A.unlockScroll();
    if (state.lastFocus && state.lastFocus.isConnected) {
      try { state.lastFocus.focus(); } catch (error) { /* ignore */ }
    }
  }

  function togglePalette() {
    if (state.open) closePalette();
    else openPalette();
  }

  /* ─── Header entry point ───────────────────────────────── */

  function ensurePaletteButton() {
    const toolbar = document.querySelector('#desktop-app header .MuiToolbar-root');
    if (!toolbar) return;

    let button = toolbar.querySelector('.as-palette-button');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'as-palette-button';
      button.title = 'Quick actions (Ctrl + K)';
      button.setAttribute('aria-label', 'Open quick actions');
      button.innerHTML = icon('search');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        togglePalette();
      });
    }

    const gear = toolbar.querySelector('.as-settings-gear');
    if (gear && gear.parentElement === toolbar) {
      if (button.previousElementSibling !== gear) gear.insertAdjacentElement('afterend', button);
    } else if (button.parentElement !== toolbar) {
      toolbar.appendChild(button);
    }
  }

  /* ─── Shortcut cheat-sheet ─────────────────────────────── */

  let keysOverlay = null;

  function buildShortcuts() {
    const overlay = document.createElement('div');
    overlay.className = 'as-keys-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = [
      '<div class="as-keys-card" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">',
      '  <div class="as-keys-head">',
      '    <h2>Keyboard shortcuts</h2>',
      '    <button type="button" class="as-keys-close" aria-label="Close shortcuts">' + icon('close') + '</button>',
      '  </div>',
      '  <dl class="as-keys-list">',
      '    <div class="as-keys-row"><dt>Quick actions</dt><dd><kbd class="as-kbd">Ctrl</kbd><kbd class="as-kbd">K</kbd></dd></div>',
      '    <div class="as-keys-row"><dt>Open settings</dt><dd><kbd class="as-kbd">Alt</kbd><kbd class="as-kbd">Shift</kbd><kbd class="as-kbd">S</kbd></dd></div>',
      '    <div class="as-keys-row"><dt>Jump to a page</dt><dd><kbd class="as-kbd">Alt</kbd><kbd class="as-kbd">Shift</kbd><kbd class="as-kbd">1–6</kbd></dd></div>',
      '    <div class="as-keys-row"><dt>Hide or show the sidebar</dt><dd><kbd class="as-kbd">Alt</kbd><kbd class="as-kbd">Shift</kbd><kbd class="as-kbd">F</kbd></dd></div>',
      '    <div class="as-keys-row"><dt>Toggle light and dark</dt><dd><kbd class="as-kbd">Alt</kbd><kbd class="as-kbd">Shift</kbd><kbd class="as-kbd">L</kbd></dd></div>',
      '    <div class="as-keys-row"><dt>Toggle compact density</dt><dd><kbd class="as-kbd">Alt</kbd><kbd class="as-kbd">Shift</kbd><kbd class="as-kbd">D</kbd></dd></div>',
      '    <div class="as-keys-row"><dt>This list</dt><dd><kbd class="as-kbd">?</kbd></dd></div>',
      '    <div class="as-keys-row"><dt>Close any panel</dt><dd><kbd class="as-kbd">Esc</kbd></dd></div>',
      '  </dl>',
      '  <p class="as-keys-note">Navigation shortcuts can be turned off in Settings → Features. Quick actions and this list always work.</p>',
      '</div>',
    ].join('');

    document.body.appendChild(overlay);
    keysOverlay = overlay;

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) hideShortcuts();
    });
    overlay.querySelector('.as-keys-close').addEventListener('click', hideShortcuts);
  }

  function showShortcuts() {
    if (!keysOverlay) buildShortcuts();
    if (keysOverlay.classList.contains('as-open')) return;
    keysOverlay.classList.add('as-open');
    keysOverlay.setAttribute('aria-hidden', 'false');
    A.lockScroll();
    const close = keysOverlay.querySelector('.as-keys-close');
    if (close) requestAnimationFrame(() => close.focus());
  }

  function hideShortcuts() {
    if (!keysOverlay || !keysOverlay.classList.contains('as-open')) return;
    keysOverlay.classList.remove('as-open');
    keysOverlay.setAttribute('aria-hidden', 'true');
    A.unlockScroll();
  }

  /* ─── Secrets ──────────────────────────────────────────── */

  function pulseBrand() {
    const brand = document.querySelector('.ascharts-header-brand');
    if (!brand) return;
    brand.classList.remove('as-secret-pulse');
    void brand.offsetWidth;
    brand.classList.add('as-secret-pulse');
    setTimeout(() => brand.classList.remove('as-secret-pulse'), 1400);
  }

  function secret(message) {
    A.toast({ key: 'ascharts-secret', title: 'Easter egg', message, tone: 'success', duration: 4 });
    pulseBrand();
  }

  const KONAMI = 'arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba';
  let konami = '';
  let wordBuffer = '';
  let lastWordAt = 0;
  let brandClicks = 0;
  let brandTimer = 0;

  document.addEventListener('click', (event) => {
    const brand = event.target && event.target.closest ? event.target.closest('.ascharts-header-brand') : null;
    if (!brand) return;
    brandClicks += 1;
    clearTimeout(brandTimer);
    brandTimer = setTimeout(() => { brandClicks = 0; }, 700);
    if (brandClicks >= 3) {
      brandClicks = 0;
      toggleTheme();
    }
  }, true);

  /* ─── Shortcuts ────────────────────────────────────────── */

  document.addEventListener('keydown', (event) => {
    const editable = isEditable(event.target);
    const modifier = event.ctrlKey || event.metaKey;

    if (modifier && !event.altKey && !event.shiftKey && (event.code === 'KeyK' || String(event.key).toLowerCase() === 'k')) {
      event.preventDefault();
      togglePalette();
      return;
    }

    if (state.open && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closePalette();
      return;
    }

    if (state.open) return;

    if (event.key === 'Escape' && keysOverlay && keysOverlay.classList.contains('as-open')) {
      event.preventDefault();
      hideShortcuts();
      return;
    }

    if (event.key === '?' && !editable && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      showShortcuts();
      return;
    }

    // Quick actions are always available; only the 1–6 page jumps
    // depend on the optional navigation-shortcuts setting.
    if (event.altKey && event.shiftKey && !modifier && !editable) {
      const code = event.code;
      if (code === 'KeyF') {
        event.preventDefault();
        toggleSidebar();
        return;
      }
      if (code === 'KeyL') {
        event.preventDefault();
        toggleTheme();
        return;
      }
      if (code === 'KeyD') {
        event.preventDefault();
        toggleDensity();
        return;
      }
    }

    if (editable) return;

    // Konami code → confetti.
    konami = (konami + String(event.key || '').toLowerCase()).slice(-KONAMI.length);
    if (konami === KONAMI) {
      konami = '';
      if (typeof A.celebrate === 'function') A.celebrate();
      secret('Cheat mode activated. Enjoy the confetti.');
      return;
    }

    // Type "ascharts" anywhere to find the quieter secret.
    if (/^[a-z]$/.test(String(event.key || '').toLowerCase())) {
      wordBuffer = (wordBuffer + String(event.key).toLowerCase()).slice(-12);
      if (wordBuffer.endsWith('ascharts') && Date.now() - lastWordAt > 8000) {
        lastWordAt = Date.now();
        wordBuffer = '';
        secret('You found the ASCharts secret. Nothing is tracked, nothing is sent.');
      }
    }
  }, true);

  function run() {
    ensurePaletteButton();
  }

  run();
  window.addEventListener('load', run, { once: true });

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      run();
    }, 120);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
