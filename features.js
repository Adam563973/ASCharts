(() => {
  // ASCharts optional quality-of-life features. Never changes school records.
  if (window.top !== window) return;

  const KEYS = {
    displayName: 'ascharts-display-name',
    detentionCelebration: 'ascharts-detention-celebration',
    shortcuts: 'ascharts-keyboard-shortcuts',
  };
  const getSetting = (key) => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };

  function applyLocalDisplayName() {
    const name = (getSetting(KEYS.displayName) || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    const card = document.querySelector('.desktop-drawer-pupil > div:first-child > div');
    if (!card) return;
    const primary = card.querySelector('b');
    const secondary = card.querySelector('small');
    if (!primary) return;

    if (!Object.prototype.hasOwnProperty.call(primary.dataset, 'asOriginalName')) {
      primary.dataset.asOriginalName = primary.textContent;
    }
    if (secondary && !Object.prototype.hasOwnProperty.call(secondary.dataset, 'asOriginalHidden')) {
      secondary.dataset.asOriginalHidden = secondary.hidden ? '1' : '0';
      secondary.dataset.asOriginalName = secondary.textContent;
    }

    if (name) {
      if (primary.textContent !== name) primary.textContent = name;
      if (secondary) secondary.hidden = true;
    } else {
      const original = primary.dataset.asOriginalName || '';
      if (primary.textContent !== original) primary.textContent = original;
      if (secondary) {
        const secondaryOriginal = secondary.dataset.asOriginalName || '';
        if (secondary.textContent !== secondaryOriginal) secondary.textContent = secondaryOriginal;
        secondary.hidden = secondary.dataset.asOriginalHidden === '1';
      }
    }
  }

  // Some site builds create a stale homework detail dialog as the Homework
  // drawer item is clicked. Only close a *new* dialog created by that click;
  // never swallow the navigation or close a card the user had already opened.
  let pendingHomeworkNavigation = null;
  function closeUnexpectedHomeworkDialog() {
    const pending = pendingHomeworkNavigation;
    if (!pending) return;
    if (Date.now() > pending.until) { pendingHomeworkNavigation = null; return; }
    const candidates = [...document.querySelectorAll('.homework-details-dialog')]
      .filter((dialog) => !pending.existing.has(dialog));
    for (const dialog of candidates) {
      const close = dialog.querySelector(
        '.homework-details-dialog-close-button, button[aria-label="Close"], button[aria-label="close"]'
      );
      if (close) {
        pendingHomeworkNavigation = null;
        close.click();
        return;
      }
    }
  }

  function isEditableTarget(target) {
    return !!(target && target.closest && target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'));
  }

  function navigateTo(labelPattern) {
    const item = [...document.querySelectorAll('.desktop-drawer-pupil-menu-item')]
      .find((node) => labelPattern.test((node.textContent || '').replace(/\s+/g, ' ').trim()));
    if (item) item.click();
  }

  document.addEventListener('click', (event) => {
    const navItem = event.target && event.target.closest
      ? event.target.closest('.desktop-drawer-pupil-menu-item') : null;
    if (navItem && /^homework$/i.test((navItem.textContent || '').replace(/\s+/g, ' ').trim())) {
      pendingHomeworkNavigation = {
        until: Date.now() + 2000,
        existing: new Set(document.querySelectorAll('.homework-details-dialog')),
      };
      // Check after the site's React click handler has had a chance to render.
      setTimeout(closeUnexpectedHomeworkDialog, 40);
      setTimeout(closeUnexpectedHomeworkDialog, 180);
      setTimeout(closeUnexpectedHomeworkDialog, 500);
      return;
    }
    // A separate deliberate click means the user has moved on; don't suppress
    // a homework card they intentionally open after navigation.
    if (pendingHomeworkNavigation) pendingHomeworkNavigation = null;
  }, true);

  document.addEventListener('keydown', (event) => {
    if (getSetting(KEYS.shortcuts) !== '1' || isEditableTarget(event.target)) return;
    if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;
    const digitCodes = { Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5', Digit6: '6' };
    const key = digitCodes[event.code] || String(event.key || '').toLowerCase();
    const map = {
      '1': /^behaviou?r$/i,
      '2': /^announcements?$/i,
      '3': /^homework$/i,
      '4': /^detentions?$/i,
      '5': /^timetable$/i,
      '6': /^messages?$/i,
    };
    if (!map[key]) return;
    event.preventDefault();
    navigateTo(map[key]);
  }, true);

  const alreadyCelebrated = new WeakSet();
  const NO_DETENTION_PATTERNS = [
    /\bno\s+(?:(?:current|upcoming|scheduled|active)\s+)?detentions?\b/i,
    /\byou\s+(?:currently\s+)?have\s+no\s+detentions?\b/i,
    /\byou\s+(?:do not|don't)\s+have\s+any\s+detentions?\b/i,
    /\b0\s+detentions?\b/i,
  ];

  function playCheerfulChime() {
    try {
      const AudioContextType = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextType) return;
      const ctx = new AudioContextType();
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const now = ctx.currentTime + 0.025;
      // A short, quiet four-note fanfare; no external audio or network request.
      [659.25, 783.99, 987.77, 1318.51].forEach((frequency, index) => {
        const start = now + index * 0.105;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.045, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.25);
      });
      setTimeout(() => ctx.close().catch(() => {}), 850);
    } catch (_) { /* Browsers may block sound until a user gesture; confetti still works. */ }
  }

  function showDetentionFreeCelebration() {
    if (document.querySelector('.as-detfree-celebration')) return;
    const overlay = document.createElement('div');
    overlay.className = 'as-detfree-celebration';
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('role', 'status');
    const title = document.createElement('div');
    title.className = 'as-detfree-stamp';
    title.textContent = 'DETENTION FREE!';
    const subtitle = document.createElement('div');
    subtitle.className = 'as-detfree-subtitle';
    subtitle.textContent = 'Keep up the good work';
    overlay.append(title, subtitle);

    const colors = ['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
    for (let i = 0; i < 44; i++) {
      const piece = document.createElement('i');
      piece.className = 'as-detfree-confetti';
      piece.style.setProperty('--as-x', `${Math.random() * 100}%`);
      piece.style.setProperty('--as-delay', `${Math.random() * 260}ms`);
      piece.style.setProperty('--as-duration', `${1300 + Math.random() * 950}ms`);
      piece.style.setProperty('--as-rotate', `${Math.round(Math.random() * 720 - 360)}deg`);
      piece.style.setProperty('--as-color', colors[i % colors.length]);
      overlay.appendChild(piece);
    }
    document.body.appendChild(overlay);
    playCheerfulChime();
    setTimeout(() => overlay.classList.add('as-detfree-active'), 20);
    setTimeout(() => overlay.remove(), 2800);
  }

  function checkDetentionStatus() {
    if (getSetting(KEYS.detentionCelebration) !== '1') return;
    const page = document.querySelector('.detentions-page');
    if (!page || alreadyCelebrated.has(page)) return;
    if (!page.isConnected || page.getClientRects().length === 0) return;
    const text = (page.innerText || page.textContent || '').replace(/\s+/g, ' ').trim();
    // Only celebrate an explicit empty-state statement; never infer zero from
    // an empty render while data is still loading.
    if (!NO_DETENTION_PATTERNS.some((pattern) => pattern.test(text))) return;
    alreadyCelebrated.add(page);
    showDetentionFreeCelebration();
  }

  function run() {
    applyLocalDisplayName();
    closeUnexpectedHomeworkDialog();
    checkDetentionStatus();
  }

  window.addEventListener('ascharts:display-name-change', applyLocalDisplayName);
  window.addEventListener('ascharts:detention-celebration-setting-change', checkDetentionStatus);
  run();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; run(); }, 70);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden'] });
})();
