(() => {
  /* =============================================================
     ASCharts — settings.js
     Settings gear icon + panel with dark mode, profile pic, etc.
     ============================================================= */

  const LS_PREFIX = 'ascharts-';
  const KEYS = {
    dark: LS_PREFIX + 'dark-mode',
    compact: LS_PREFIX + 'compact',
    accent: LS_PREFIX + 'accent-color',
    avatar: LS_PREFIX + 'avatar',
    fontSize: LS_PREFIX + 'font-size',
    animSpeed: LS_PREFIX + 'anim-speed',
    sidebarWidth: LS_PREFIX + 'sidebar-width',
    homeworkCardLayout: LS_PREFIX + 'homework-card-layout',
    displayName: LS_PREFIX + 'display-name',
    detentionCelebration: LS_PREFIX + 'detention-celebration',
    readingMode: LS_PREFIX + 'reading-mode',
    shortcuts: LS_PREFIX + 'keyboard-shortcuts',
  };

  const ACCENT_PRESETS = [
    { name: 'Navy', color: '#0b1f4d' },
    { name: 'Blue', color: '#1f4fd1' },
    { name: 'Purple', color: '#7c3aed' },
    { name: 'Green', color: '#059669' },
    { name: 'Red', color: '#dc2626' },
    { name: 'Orange', color: '#ea580c' },
    { name: 'Pink', color: '#db2777' },
    { name: 'Teal', color: '#0d9488' },
  ];

  function ls(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      if (val === null) localStorage.removeItem(key);
      else localStorage.setItem(key, val);
    } catch (e) {}
  }

  // Keep the original ASCharts layout, but drive its brand colours from one
  // accent selection so light-mode buttons, header, icons and selected states
  // all change together.
  const DEFAULT_ACCENT = '#0b1f4d';

  function parseHex(hex) {
    const match = String(hex || '').trim().match(/^#?([0-9a-f]{6})$/i);
    if (!match) return [11, 31, 77];
    const value = match[1];
    return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
  }

  function rgbHex(rgb) {
    return '#' + rgb.map(value => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0')).join('');
  }

  function applyAccentTheme(color) {
    const root = document.documentElement;
    const rgb = parseHex(color);
    const normalized = rgbHex(rgb);
    const darker = rgbHex(rgb.map(channel => Math.round(channel * 0.78)));
    const rgba = (alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
    root.style.setProperty('--as-accent', normalized);
    root.style.setProperty('--as-navy', normalized);
    root.style.setProperty('--as-navy-2', darker);
    root.style.setProperty('--as-brand-fg', normalized);
    root.style.setProperty('--as-tint', rgba(0.11));
    root.style.setProperty('--as-tint-2', rgba(0.065));
    root.style.setProperty('--as-accent-rgb', rgb.join(', '));
  }

  /* ─── Apply saved settings on load ───────────────────── */

  function applyAll() {
    // Dark mode is temporarily unavailable while it is being developed.
    document.documentElement.classList.remove('as-dark');
    ls(KEYS.dark, '0');

    // Compact sidebar
    const compact = ls(KEYS.compact) === '1';
    document.documentElement.classList.toggle('as-compact', compact);

    // Accent colour (applied consistently across the light theme)
    const accent = ls(KEYS.accent) || DEFAULT_ACCENT;
    applyAccentTheme(accent);

    // Font size
    const fontSize = ls(KEYS.fontSize) || 'default';
    document.documentElement.classList.remove('as-font-small', 'as-font-large');
    if (fontSize === 'small') document.documentElement.classList.add('as-font-small');
    else if (fontSize === 'large') document.documentElement.classList.add('as-font-large');

    // Animation speed
    const animSpeed = ls(KEYS.animSpeed) || 'normal';
    document.documentElement.classList.remove('as-anim-off', 'as-anim-slow', 'as-anim-fast');
    if (animSpeed !== 'normal') document.documentElement.classList.add('as-anim-' + animSpeed);

    // Sidebar width
    const sbWidth = ls(KEYS.sidebarWidth) || 'default';
    applySidebarWidth(sbWidth);

    // New homework detail-card styling is a user-selectable option; enabled by default.
    const newHomeworkCard = ls(KEYS.homeworkCardLayout) !== '0';
    document.documentElement.classList.toggle('as-homework-card-layout', newHomeworkCard);
    document.documentElement.classList.toggle('as-reading-mode', ls(KEYS.readingMode) === '1');

    // Avatar
    applyAvatar();
  }

  function applySidebarWidth(w) {
    document.documentElement.classList.remove('as-sidebar-narrow', 'as-sidebar-wide');
    if (w === 'narrow') document.documentElement.classList.add('as-sidebar-narrow');
    else if (w === 'wide') document.documentElement.classList.add('as-sidebar-wide');

    const drawer = document.querySelector('.desktop-drawer .MuiDrawer-paper');
    const container = document.querySelector('#desktop-app > div:has(> .desktop-drawer)');
    const widths = { narrow: '200px', default: '240px', wide: '300px' };
    const val = widths[w] || widths.default;
    if (drawer) drawer.style.setProperty('width', val, 'important');
    if (container) {
      container.style.setProperty('width', val, 'important');
      container.style.setProperty('min-width', val, 'important');
    }
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }

  function applyAvatar() {
    const avatarData = ls(KEYS.avatar);
    if (!avatarData) return;
    const imgs = document.querySelectorAll('.desktop-drawer-pupil > div:first-child > div img');
    imgs.forEach(img => {
      if (img.src !== avatarData) img.src = avatarData;
    });
  }

  /* ─── Settings Panel DOM ─────────────────────────────── */

  function createPanel() {
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'as-settings-overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePanel();
    });

    // Panel
    const panel = document.createElement('div');
    panel.className = 'as-settings-panel';
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Header
    const header = document.createElement('div');
    header.className = 'as-settings-header';
    header.innerHTML = `
      <div class="as-settings-title">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <span>Settings</span>
      </div>
      <button class="as-settings-close" aria-label="Close settings" title="Close settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    header.querySelector('.as-settings-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });
    panel.appendChild(header);

    // Scrollable body
    const body = document.createElement('div');
    body.className = 'as-settings-body';

    // ─── Appearance Section
    body.appendChild(createSection('Appearance'));

    // Dark mode remains visible but disabled while it is in development.
    const darkModeRow = createToggle('Dark Mode', 'In development', KEYS.dark, () => {});
    darkModeRow.classList.add('as-feature-disabled');
    const darkModeInput = darkModeRow.querySelector('input[type="checkbox"]');
    if (darkModeInput) {
      darkModeInput.checked = false;
      darkModeInput.disabled = true;
      darkModeInput.setAttribute('aria-label', 'Dark mode (in development)');
    }
    const darkModeSlider = darkModeRow.querySelector('.as-toggle-slider');
    if (darkModeSlider) darkModeSlider.setAttribute('title', 'Dark mode is in development');
    body.appendChild(darkModeRow);

    // Compact sidebar toggle
    body.appendChild(createToggle('Compact Sidebar', 'Reduce sidebar item spacing', KEYS.compact, (v) => {
      document.documentElement.classList.toggle('as-compact', v);
    }));

    // Accent color
    body.appendChild(createAccentPicker());

    // ─── Profile Section
    body.appendChild(createSection('Profile'));

    // Avatar
    body.appendChild(createAvatarPicker());
    body.appendChild(createDisplayNameControl());

    // ─── Display Section
    body.appendChild(createSection('Display'));

    // Font size
    body.appendChild(createSelect('Font Size', KEYS.fontSize,
      [{ val: 'small', label: 'Small' }, { val: 'default', label: 'Default' }, { val: 'large', label: 'Large' }],
      (v) => {
        document.documentElement.classList.remove('as-font-small', 'as-font-large');
        if (v === 'small') document.documentElement.classList.add('as-font-small');
        else if (v === 'large') document.documentElement.classList.add('as-font-large');
      }
    ));

    // Animation speed
    body.appendChild(createSelect('Animation Speed', KEYS.animSpeed,
      [{ val: 'off', label: 'Off' }, { val: 'slow', label: 'Slow' }, { val: 'normal', label: 'Normal' }, { val: 'fast', label: 'Fast' }],
      (v) => {
        document.documentElement.classList.remove('as-anim-off', 'as-anim-slow', 'as-anim-fast');
        if (v !== 'normal') document.documentElement.classList.add('as-anim-' + v);
      }
    ));

    // Sidebar width
    body.appendChild(createSelect('Sidebar Width', KEYS.sidebarWidth,
      [{ val: 'narrow', label: 'Narrow' }, { val: 'default', label: 'Default' }, { val: 'wide', label: 'Wide' }],
      (v) => applySidebarWidth(v)
    ));

    // Optional refreshed homework card style; off restores the site's default card styling.
    body.appendChild(createToggle('Subtle Homework Card Styling', 'Slightly round the existing homework detail card and refine typography; does not change layout', KEYS.homeworkCardLayout, (enabled) => {
      document.documentElement.classList.toggle('as-homework-card-layout', enabled);
    }));

    // ─── Fun & Productivity Section
    body.appendChild(createSection('Fun & Productivity'));
    body.appendChild(createToggle('Detention-free Celebration', 'When the Detentions page explicitly confirms none are assigned, show a brief confetti burst and cheerful chime. Off by default.', KEYS.detentionCelebration, () => {
      window.dispatchEvent(new Event('ascharts:detention-celebration-setting-change'));
    }));
    body.appendChild(createToggle('Comfortable Reading', 'Increase text spacing in homework details, announcements and messages', KEYS.readingMode, (enabled) => {
      document.documentElement.classList.toggle('as-reading-mode', enabled);
    }));
    body.appendChild(createToggle('Quick Navigation Shortcuts', 'Use Alt + Shift + 1–6 to open Behaviour, Announcements, Homework, Detentions, Timetable or Messages', KEYS.shortcuts, () => {}));

    // ─── Data Section
    body.appendChild(createSection('Data & Backup'));

    // Export
    const exportBtn = document.createElement('button');
    exportBtn.className = 'as-settings-btn';
    exportBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export Settings`;
    exportBtn.addEventListener('click', exportSettings);
    body.appendChild(exportBtn);

    // Import
    const importBtn = document.createElement('button');
    importBtn.className = 'as-settings-btn';
    importBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import Settings`;
    importBtn.addEventListener('click', importSettings);
    body.appendChild(importBtn);

    // Reset
    const resetBtn = document.createElement('button');
    resetBtn.className = 'as-settings-btn as-settings-btn-danger';
    resetBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Reset All Settings`;
    resetBtn.addEventListener('click', resetSettings);
    body.appendChild(resetBtn);

    // ─── Community / Beta Programme
    body.appendChild(createSection('Community'));
    const betaBtn = document.createElement('button');
    betaBtn.type = 'button';
    betaBtn.className = 'as-settings-btn as-beta-programme-btn';
    betaBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M5.6 18.4l2.1-2.1M12 18v3M18.4 18.4l-2.1-2.1M18 12h3M18.4 5.6l-2.1 2.1"/><circle cx="12" cy="12" r="4"/></svg> Join Beta Programme`;
    betaBtn.addEventListener('click', openBetaModal);
    body.appendChild(betaBtn);

    // Version info
    const version = document.createElement('div');
    version.className = 'as-settings-version';
    version.textContent = 'ASCharts v1.3.8';
    body.appendChild(version);

    // Attribution
    const attribution = document.createElement('div');
    attribution.className = 'as-settings-attribution';
    attribution.innerHTML = `<a href="https://github.com/jamestheakston/classchartsimprover" target="_blank" rel="noopener noreferrer">Inspired by ClassCharts Improver</a>`;
    body.appendChild(attribution);

    panel.appendChild(body);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Open animation
    requestAnimationFrame(() => {
      overlay.classList.add('as-settings-open');
    });

    // Escape key
    const escHandler = (e) => {
      if (e.key === 'Escape') { closePanel(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
  }

  function openBetaModal() {
    if (document.querySelector('.as-info-modal-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'as-info-modal-overlay';
    overlay.setAttribute('data-as-modal', 'beta');
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeInfoModal(overlay);
    });

    const headerElement = document.querySelector('#desktop-app header .MuiToolbar-root') || document.querySelector('#desktop-app header');
    let headerFont = '"Open Sans", Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
    try { if (headerElement) headerFont = getComputedStyle(headerElement).fontFamily || headerFont; } catch (e) {}
    overlay.style.setProperty('--as-header-font', headerFont);

    const card = document.createElement('section');
    card.className = 'as-info-modal-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'as-beta-modal-title');
    card.innerHTML = `
      <div class="as-info-modal-header">
        <div class="as-info-modal-title" id="as-beta-modal-title">Join Beta Programme</div>
        <button class="as-info-modal-close" type="button" aria-label="Close dialog" title="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="as-info-modal-body">
        <p>Want to try upcoming ASCharts features?</p>
        <p class="as-info-modal-email-line">Email <a class="as-info-modal-email" href="mailto:adamshahid153@gmail.com">adamshahid153@gmail.com</a> for further information on how to join the beta.</p>
      </div>
      <div class="as-info-modal-footer">
        <button class="as-info-modal-button as-info-modal-button-secondary" type="button" data-as-close>Close</button>
        <button class="as-info-modal-button as-info-modal-button-primary" type="button" data-as-copy>Copy email</button>
      </div>`;
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const close = () => closeInfoModal(overlay);
    card.querySelector('.as-info-modal-close').addEventListener('click', close);
    card.querySelector('[data-as-close]').addEventListener('click', close);
    card.querySelector('[data-as-copy]').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      try {
        await navigator.clipboard.writeText('adamshahid153@gmail.com');
        button.textContent = 'Copied';
      } catch (e) {
        const email = card.querySelector('.as-info-modal-email');
        const range = document.createRange();
        range.selectNodeContents(email);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Select and copy';
      }
    });
    const esc = (event) => {
      if (event.key === 'Escape' && document.body.contains(overlay)) {
        closeInfoModal(overlay);
        document.removeEventListener('keydown', esc, true);
      }
    };
    document.addEventListener('keydown', esc, true);
    overlay._asEscHandler = esc;
    requestAnimationFrame(() => overlay.classList.add('as-info-modal-open'));
    const closeButton = card.querySelector('.as-info-modal-close');
    setTimeout(() => closeButton && closeButton.focus(), 50);
  }

  function closeInfoModal(overlay) {
    if (!overlay || overlay.dataset.asClosing === '1') return;
    overlay.dataset.asClosing = '1';
    overlay.classList.remove('as-info-modal-open');
    if (overlay._asEscHandler) document.removeEventListener('keydown', overlay._asEscHandler, true);
    setTimeout(() => overlay.remove(), 190);
  }

  function closePanel() {
    const overlay = document.querySelector('.as-settings-overlay');
    if (!overlay) return;
    overlay.classList.remove('as-settings-open');
    overlay.classList.add('as-settings-closing');
    setTimeout(() => overlay.remove(), 300);
  }

  /* ─── UI Component Helpers ───────────────────────────── */

  function createSection(title) {
    const sec = document.createElement('div');
    sec.className = 'as-settings-section';
    sec.textContent = title;
    return sec;
  }

  function createToggle(label, description, key, onChange) {
    const row = document.createElement('div');
    row.className = 'as-settings-row';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';
    info.innerHTML = `<div class="as-settings-label">${label}</div><div class="as-settings-desc">${description}</div>`;

    const toggle = document.createElement('label');
    toggle.className = 'as-toggle';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = ls(key) === '1';
    input.addEventListener('change', () => {
      ls(key, input.checked ? '1' : '0');
      onChange(input.checked);
    });

    const slider = document.createElement('span');
    slider.className = 'as-toggle-slider';

    toggle.appendChild(input);
    toggle.appendChild(slider);

    row.appendChild(info);
    row.appendChild(toggle);
    return row;
  }

  function createAccentPicker() {
    const container = document.createElement('div');
    container.className = 'as-settings-row as-settings-row-column';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';
    info.innerHTML = `<div class="as-settings-label">Accent Colour</div><div class="as-settings-desc">Customise the highlight colour</div>`;
    container.appendChild(info);

    const swatches = document.createElement('div');
    swatches.className = 'as-accent-swatches';

    const current = ls(KEYS.accent) || DEFAULT_ACCENT;

    ACCENT_PRESETS.forEach(({ name, color }) => {
      const btn = document.createElement('button');
      btn.className = 'as-accent-swatch';
      btn.style.backgroundColor = color;
      btn.title = name;
      btn.setAttribute('aria-label', `Set accent color to ${name}`);
      if (color === current) btn.classList.add('as-accent-selected');

      btn.addEventListener('click', () => {
        applyAccentTheme(color);
        ls(KEYS.accent, color);
        swatches.querySelectorAll('.as-accent-swatch').forEach(s => s.classList.remove('as-accent-selected'));
        btn.classList.add('as-accent-selected');
      });

      swatches.appendChild(btn);
    });

    container.appendChild(swatches);
    return container;
  }

  function createAvatarPicker() {
    const container = document.createElement('div');
    container.className = 'as-settings-row as-settings-row-column';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';
    info.innerHTML = `<div class="as-settings-label">Profile Picture</div><div class="as-settings-desc">Set a custom avatar</div>`;
    container.appendChild(info);

    const avatarRow = document.createElement('div');
    avatarRow.className = 'as-avatar-row';

    // Preview
    const preview = document.createElement('div');
    preview.className = 'as-avatar-preview';
    const savedAvatar = ls(KEYS.avatar);
    if (savedAvatar) {
      preview.style.backgroundImage = `url(${savedAvatar})`;
    } else {
      preview.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    }
    avatarRow.appendChild(preview);

    // Buttons
    const btnGroup = document.createElement('div');
    btnGroup.className = 'as-avatar-buttons';

    const chooseBtn = document.createElement('button');
    chooseBtn.className = 'as-settings-btn as-settings-btn-sm';
    chooseBtn.textContent = 'Choose Image';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    chooseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        // Resize to max 128x128 to save localStorage space
        const img = new Image();
        img.onload = () => {
          const maxSize = 128;
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          ls(KEYS.avatar, dataURL);
          preview.style.backgroundImage = `url(${dataURL})`;
          preview.innerHTML = '';
          applyAvatar();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'as-settings-btn as-settings-btn-sm as-settings-btn-outline';
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', () => {
      ls(KEYS.avatar, null);
      preview.style.backgroundImage = '';
      preview.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
      // Reset sidebar avatars to original
      const imgs = document.querySelectorAll('.desktop-drawer-pupil > div:first-child > div img');
      imgs.forEach(img => {
        if (img.dataset.origSrc) img.src = img.dataset.origSrc;
      });
    });

    btnGroup.appendChild(chooseBtn);
    btnGroup.appendChild(fileInput);
    btnGroup.appendChild(resetBtn);
    avatarRow.appendChild(btnGroup);
    container.appendChild(avatarRow);
    return container;
  }

  function createDisplayNameControl() {
    const row = document.createElement('div');
    row.className = 'as-settings-row as-settings-row-column as-display-name-setting';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';
    info.innerHTML = `<div class="as-settings-label">Display Name</div><div class="as-settings-desc">Change the name shown in your profile card on this browser only. This does not change your school account.</div>`;
    row.appendChild(info);

    const controls = document.createElement('div');
    controls.className = 'as-display-name-controls';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'as-settings-text-input';
    input.maxLength = 40;
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = 'Enter a display name';
    input.setAttribute('aria-label', 'Local display name');
    input.value = ls(KEYS.displayName) || '';

    const actions = document.createElement('div');
    actions.className = 'as-display-name-actions';
    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'as-settings-btn as-settings-btn-sm';
    save.textContent = 'Apply';
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'as-settings-btn as-settings-btn-sm as-settings-btn-outline';
    reset.textContent = 'Use account name';

    const status = document.createElement('div');
    status.className = 'as-display-name-status';
    status.setAttribute('aria-live', 'polite');

    const applyValue = (clear) => {
      const value = clear ? '' : input.value.replace(/\s+/g, ' ').trim().slice(0, 40);
      input.value = value;
      ls(KEYS.displayName, value || null);
      window.dispatchEvent(new Event('ascharts:display-name-change'));
      status.textContent = value ? 'Updated on this device.' : 'Using the name from your school account.';
    };
    save.addEventListener('click', applyValue.bind(null, false));
    reset.addEventListener('click', () => { input.value = ''; applyValue(true); });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); applyValue(false); }
    });

    actions.append(save, reset);
    controls.append(input, actions, status);
    row.appendChild(controls);
    return row;
  }

  function createSelect(label, key, options, onChange) {
    const row = document.createElement('div');
    row.className = 'as-settings-row';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';
    info.innerHTML = `<div class="as-settings-label">${label}</div>`;

    const select = document.createElement('select');
    select.className = 'as-settings-select';
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('mousedown', (e) => e.stopPropagation());
    const current = ls(key) || 'default';
    options.forEach(({ val, label: l }) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = l;
      if (val === current) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      e.stopPropagation();
      ls(key, select.value);
      onChange(select.value);
    });

    row.appendChild(info);
    row.appendChild(select);
    return row;
  }

  /* ─── Data Operations ────────────────────────────────── */

  function exportSettings() {
    const data = {};
    Object.values(KEYS).forEach(key => {
      const val = ls(key);
      if (val !== null) data[key] = val;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascharts-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          Object.entries(data).forEach(([key, val]) => {
            if (key.startsWith(LS_PREFIX)) ls(key, val);
          });
          applyAll();
          closePanel();
          // Re-open to refresh UI
          setTimeout(createPanel, 350);
        } catch (e) {
          alert('Invalid settings file.');
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function resetSettings() {
    if (!confirm('Reset all ASCharts settings to defaults? This cannot be undone.')) return;
    Object.values(KEYS).forEach(key => ls(key, null));
    // Remove classes
    document.documentElement.classList.remove('as-dark', 'as-compact', 'as-font-small', 'as-font-large', 'as-anim-off', 'as-anim-slow', 'as-anim-fast', 'as-reading-mode');
    applyAccentTheme(DEFAULT_ACCENT);
    ls(KEYS.dark, '0');
    window.dispatchEvent(new Event('ascharts:display-name-change'));
    // Reset sidebar width
    applySidebarWidth('default');
    closePanel();
  }

  /* ─── Settings Gear Button ───────────────────────────── */

  function ensureGearButton() {
    if (document.querySelector('.as-settings-gear')) return;

    const toolbar = document.querySelector('#desktop-app header .MuiToolbar-root');
    if (!toolbar) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'as-settings-gear';
    btn.title = 'ASCharts Settings';
    btn.setAttribute('aria-label', 'Open ASCharts Settings');
    btn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    `;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const existing = document.querySelector('.as-settings-overlay');
      if (existing) closePanel();
      else createPanel();
    });

    // Insert before the last child (usually user menu / buttons on right)
    const spacer = toolbar.querySelector('.MuiBox-root[style*="flex"], [style*="flex-grow"], [class*="Grow"]');
    if (spacer) {
      spacer.insertAdjacentElement('afterend', btn);
    } else {
      // Put it at the end of the toolbar
      toolbar.appendChild(btn);
    }
  }

  /* ─── Store original avatar src ──────────────────────── */

  function storeOrigAvatars() {
    const imgs = document.querySelectorAll('.desktop-drawer-pupil > div:first-child > div img');
    imgs.forEach(img => {
      if (!img.dataset.origSrc && img.src && !img.src.startsWith('data:')) {
        img.dataset.origSrc = img.src;
      }
    });
  }

  /* ─── Main loop ──────────────────────────────────────── */

  function run() {
    ensureGearButton();
    storeOrigAvatars();
    applyAvatar();
  }

  // Apply settings immediately on load
  applyAll();
  run();

  // Watch for DOM changes (SPA navigation)
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; run(); }, 100);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
