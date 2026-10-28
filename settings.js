(() => {
  'use strict';

  const A = window.ASCharts;
  if (!A) return;

  /* =============================================================
     ASCharts — settings.js
     A tabbed, accessible settings centre with top-left toasts.
     ============================================================= */

  const VERSION = A.version;

  const TABS = [
    { id: 'appearance', label: 'Appearance', icon: 'palette', title: 'Appearance', description: 'Choose how ASCharts looks and feels.' },
    { id: 'layout', label: 'Layout', icon: 'layout', title: 'Layout', description: 'Tune the sidebar, cards and page behaviour.' },
    { id: 'accessibility', label: 'Accessibility', icon: 'accessibility', title: 'Accessibility', description: 'Make the dashboard easier to read and use.' },
    { id: 'profile', label: 'Profile', icon: 'user', title: 'Profile', description: 'Personalise the profile shown on this device.' },
    { id: 'features', label: 'Features', icon: 'sparkles', title: 'Features', description: 'Celebrations, shortcuts and quality-of-life tools.' },
    { id: 'data', label: 'Data', icon: 'database', title: 'Data & backup', description: 'Move your settings between browsers.' },
    { id: 'about', label: 'About', icon: 'info', title: 'About ASCharts', description: 'Version information and the beta programme.' },
  ];

  const ACCENTS = [
    { name: 'Navy', color: '#0b1f4d' },
    { name: 'Blue', color: '#1f4fd1' },
    { name: 'Purple', color: '#7c3aed' },
    { name: 'Green', color: '#059669' },
    { name: 'Red', color: '#dc2626' },
    { name: 'Orange', color: '#ea580c' },
    { name: 'Pink', color: '#db2777' },
    { name: 'Teal', color: '#0d9488' },
  ];

  const ICONS = {
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.5A4.5 4.5 0 0 0 22 10.7 10 10 0 0 0 12 2z"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
    accessibility: '<circle cx="12" cy="5" r="2"/><path d="M12 7v6"/><path d="m8 9 4 2 4-2"/><path d="m9 21 3-8 3 8"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    sparkles: '<path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9z"/><path d="M5 19v-2"/><path d="M19 19v-2"/><path d="M5 5V3"/><path d="M19 5V3"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  };

  function icon(name, size) {
    const dimension = size || 18;
    return `<svg width="${dimension}" height="${dimension}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
  }

  const state = {
    overlay: null,
    dialog: null,
    nav: null,
    content: null,
    footer: null,
    tab: 'appearance',
    opener: null,
    onKeyDown: null,
    closing: false,
  };

  function validTab(tabId) {
    return TABS.some((tab) => tab.id === tabId) ? tabId : 'appearance';
  }

  function notify(message, title) {
    A.toast({
      key: 'settings-save',
      title: title || 'Saved',
      message,
      tone: 'success',
    });
  }

  function isEditableTarget(target) {
    return !!(target && target.closest && target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'));
  }

  /* ─── Reusable controls ────────────────────────────────── */

  function section(title, description) {
    const wrapper = document.createElement('section');
    wrapper.className = 'as-settings-section';

    const heading = document.createElement('div');
    heading.className = 'as-settings-section-title';
    heading.textContent = title;
    wrapper.appendChild(heading);

    if (description) {
      const text = document.createElement('p');
      text.className = 'as-settings-section-desc';
      text.textContent = description;
      wrapper.appendChild(text);
    }

    const card = document.createElement('div');
    card.className = 'as-settings-card';
    wrapper.appendChild(card);
    wrapper.card = card;
    return wrapper;
  }

  function row(label, description, control) {
    const wrapper = document.createElement('div');
    wrapper.className = 'as-settings-row';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';

    const title = document.createElement('div');
    title.className = 'as-settings-label';
    title.textContent = label;
    info.appendChild(title);

    if (description) {
      const text = document.createElement('div');
      text.className = 'as-settings-desc';
      text.textContent = description;
      info.appendChild(text);
    }

    wrapper.appendChild(info);

    if (control) {
      const controlWrap = document.createElement('div');
      controlWrap.className = 'as-settings-control';
      controlWrap.appendChild(control);
      wrapper.appendChild(controlWrap);
    }

    return wrapper;
  }

  function toggleRow(label, description, key, onChange) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'as-switch-input';
    input.checked = A.getBool(key);
    input.setAttribute('role', 'switch');
    input.setAttribute('aria-label', label);
    input.setAttribute('aria-checked', String(input.checked));

    const slider = document.createElement('span');
    slider.className = 'as-switch';
    slider.setAttribute('aria-hidden', 'true');

    const control = document.createElement('label');
    control.className = 'as-switch-wrap';
    control.append(input, slider);

    input.addEventListener('change', () => {
      A.set(key, input.checked ? '1' : '0');
      input.setAttribute('aria-checked', String(input.checked));
      if (onChange) onChange(input.checked);
      notify(label + (input.checked ? ' enabled' : ' disabled'), 'Saved');
    });

    return row(label, description, control);
  }

  function selectRow(label, description, key, options, onChange) {
    const select = document.createElement('select');
    select.className = 'as-select';
    select.setAttribute('aria-label', label);

    options.forEach((option) => {
      const element = document.createElement('option');
      element.value = option.value;
      element.textContent = option.label;
      if (A.get(key) === option.value) element.selected = true;
      select.appendChild(element);
    });

    select.addEventListener('change', () => {
      A.set(key, select.value);
      if (onChange) onChange(select.value);
      const current = options.find((option) => option.value === select.value);
      notify(label + ' set to ' + (current ? current.label : select.value), 'Saved');
    });

    return row(label, description, select);
  }

  function segmentedRow(label, description, key, options, onChange) {
    const group = document.createElement('div');
    group.className = 'as-segmented';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', label);

    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'as-segment';
      button.dataset.value = option.value;
      const active = A.get(key) === option.value;
      button.classList.toggle('as-segment-active', active);
      button.setAttribute('aria-pressed', String(active));
      if (option.icon) {
        button.innerHTML = icon(option.icon, 15) + '<span>' + option.label + '</span>';
      } else {
        button.textContent = option.label;
      }
      button.addEventListener('click', () => {
        A.set(key, option.value);
        group.querySelectorAll('.as-segment').forEach((element) => {
          const isActive = element.dataset.value === option.value;
          element.classList.toggle('as-segment-active', isActive);
          element.setAttribute('aria-pressed', String(isActive));
        });
        if (onChange) onChange(option.value);
        notify(label + ' set to ' + option.label, 'Saved');
      });
      group.appendChild(button);
    });

    return row(label, description, group);
  }

  function rangeRow(label, description, key, min, max, step, format) {
    const control = document.createElement('div');
    control.className = 'as-range';

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'as-range-input';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = A.get(key) || String(min);
    input.setAttribute('aria-label', label);

    const output = document.createElement('span');
    output.className = 'as-range-value';
    output.textContent = format(input.value);
    input.setAttribute('aria-valuetext', format(input.value));

    input.addEventListener('input', () => {
      output.textContent = format(input.value);
      input.setAttribute('aria-valuetext', format(input.value));
    });
    input.addEventListener('change', () => {
      A.set(key, input.value);
      notify(label + ' set to ' + format(input.value), 'Saved');
    });

    control.append(input, output);
    return row(label, description, control);
  }

  function actionButton(label, iconName, className, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'as-settings-button ' + (className || '');
    button.innerHTML = icon(iconName, 17) + '<span>' + label + '</span>';
    button.addEventListener('click', onClick);
    return button;
  }

  function note(text) {
    const element = document.createElement('p');
    element.className = 'as-settings-note';
    element.textContent = text;
    return element;
  }

  /* ─── Tabs ─────────────────────────────────────────────── */

  function buildAppearance(body) {
    const theme = section('Theme', 'Choose a light or dark interface, or follow your device.');
    theme.card.appendChild(segmentedRow('Theme', 'The interface adapts instantly.', 'theme', [
      { value: 'light', label: 'Light', icon: 'sun' },
      { value: 'dark', label: 'Dark', icon: 'moon' },
      { value: 'system', label: 'System', icon: 'monitor' },
    ]));
    body.appendChild(theme);

    const accent = section('Accent colour', 'Used for highlights, selected states and the header.');
    accent.card.appendChild(createAccentPicker());
    body.appendChild(accent);

    const shape = section('Shape & density', 'Adjust the character of cards and controls.');
    shape.card.appendChild(segmentedRow('Corner radius', 'Roundness of cards, dialogs and controls.', 'radius', [
      { value: 'sharp', label: 'Sharp' },
      { value: 'default', label: 'Balanced' },
      { value: 'round', label: 'Rounded' },
    ]));
    shape.card.appendChild(segmentedRow('Content density', 'Compact reduces spacing so more fits on screen.', 'density', [
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'compact', label: 'Compact' },
    ]));
    shape.card.appendChild(segmentedRow('Background', 'Choose the page background treatment.', 'bgStyle', [
      { value: 'default', label: 'Default' },
      { value: 'soft', label: 'Soft' },
      { value: 'flat', label: 'Flat' },
    ]));
    body.appendChild(shape);
  }

  function buildLayout(body) {
    const sidebar = section('Sidebar', 'Control the navigation rail on the left.');
    sidebar.card.appendChild(segmentedRow('Sidebar width', 'Narrow, default or wide.', 'sidebarWidth', [
      { value: 'narrow', label: 'Narrow' },
      { value: 'default', label: 'Default' },
      { value: 'wide', label: 'Wide' },
    ]));
    sidebar.card.appendChild(toggleRow('Compact sidebar', 'Reduce item spacing in the sidebar.', 'compactSidebar'));
    sidebar.card.appendChild(toggleRow('Hide sidebar', 'Collapse the sidebar; use the header button to bring it back.', 'sidebarHidden'));
    body.appendChild(sidebar);

    const page = section('Page behaviour', 'Small refinements to the dashboard.');
    page.card.appendChild(toggleRow('Page transitions', 'Gently animate pages and cards when they open.', 'pageTransitions'));
    page.card.appendChild(toggleRow('Card hover lift', 'Lift cards slightly when you hover over them.', 'cardHover'));
    page.card.appendChild(toggleRow('Refined homework card', 'Improve the homework detail dialog typography and spacing.', 'homeworkCard'));
    page.card.appendChild(toggleRow('Scroll progress bar', 'Show a slim accent line beneath the header as you read.', 'scrollProgress'));
    page.card.appendChild(toggleRow('Back to top button', 'Show a floating button after scrolling down a page.', 'scrollTop'));
    page.card.appendChild(toggleRow('Replace Class Charts branding', 'Show the ASCharts wordmark in the header and page title.', 'brandReplace'));
    body.appendChild(page);
  }

  function buildAccessibility(body) {
    const reading = section('Readability', 'Make text and controls easier to read.');
    reading.card.appendChild(selectRow('Font size', 'Scale the interface text.', 'fontSize', [
      { value: 'small', label: 'Small' },
      { value: 'default', label: 'Default' },
      { value: 'large', label: 'Large' },
    ]));
    reading.card.appendChild(toggleRow('Comfortable reading', 'Increase line spacing in homework, announcements and messages.', 'readingMode'));
    reading.card.appendChild(toggleRow('High contrast', 'Strengthen borders and text contrast.', 'highContrast'));
    body.appendChild(reading);

    const motion = section('Motion', 'Reduce movement if you prefer a calmer interface.');
    motion.card.appendChild(selectRow('Animation speed', 'Control the speed of interface transitions.', 'animation', [
      { value: 'off', label: 'Off' },
      { value: 'slow', label: 'Slow' },
      { value: 'normal', label: 'Normal' },
      { value: 'fast', label: 'Fast' },
    ]));
    motion.card.appendChild(toggleRow('Reduce motion', 'Disable large animations and the confetti celebration.', 'reduceMotion'));
    body.appendChild(motion);
  }

  function buildProfile(body) {
    const identity = section('Profile card', 'These changes stay on this browser and never change your school account.');
    identity.card.appendChild(createAvatarPicker());
    identity.card.appendChild(createDisplayNameControl());
    body.appendChild(identity);

    body.appendChild(note('ASCharts does not send your profile picture or display name anywhere. They are stored locally in this browser.'));
  }

  function buildFeatures(body) {
    const celebration = section('Detention-free celebration', 'A short confetti moment when the Detentions page confirms there are none.');
    celebration.card.appendChild(toggleRow(
      'Detention-free celebration',
      'Show a confetti burst and briefly freeze the screen until it finishes. Off by default.',
      'detentionCelebration'
    ));
    celebration.card.appendChild(selectRow('Confetti intensity', 'How much confetti to show.', 'confettiIntensity', [
      { value: 'low', label: 'Light' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'Full' },
    ]));
    celebration.card.appendChild(rangeRow('Confetti duration', 'How long the celebration lasts.', 'confettiDuration', 2, 8, 1, (value) => value + 's'));
    celebration.card.appendChild(toggleRow('Celebration sound', 'Play a quiet three-note chime with the confetti.', 'confettiSound'));
    body.appendChild(celebration);

    const shortcuts = section('Productivity', 'A few optional shortcuts to move around faster.');
    shortcuts.card.appendChild(toggleRow(
      'Quick navigation shortcuts',
      'Use Alt + Shift + 1–6 for Behaviour, Announcements, Homework, Detentions, Timetable or Messages.',
      'shortcuts'
    ));
    shortcuts.card.appendChild(note('Press Ctrl + K (or ⌘ + K on a Mac) for the command palette, ? for the full shortcut list, or Alt + Shift + S to open or close this window.'));
    body.appendChild(shortcuts);

    const feedback = section('Notifications', 'Control the top-left confirmation toasts.');
    feedback.card.appendChild(selectRow('Toast duration', 'How long confirmation toasts remain on screen.', 'toastDuration', [
      { value: '2', label: 'Short (2s)' },
      { value: '3', label: 'Normal (3s)' },
      { value: '5', label: 'Long (5s)' },
    ]));
    body.appendChild(feedback);
  }

  function buildData(body) {
    const backup = section('Backup', 'Export your settings as a JSON file, or restore a previous backup.');
    const backupActions = document.createElement('div');
    backupActions.className = 'as-settings-actions';
    backupActions.appendChild(actionButton('Export settings', 'download', '', exportSettings));
    backupActions.appendChild(actionButton('Import settings', 'upload', 'as-settings-button-outline', importSettings));
    backup.card.appendChild(backupActions);
    body.appendChild(backup);

    const storage = section('Local storage', 'ASCharts stores preferences locally in this browser.');
    const usage = document.createElement('div');
    usage.className = 'as-settings-storage';
    const bytes = A.storageUsage();
    const readable = bytes < 1024 ? bytes + ' B' : (Math.round((bytes / 1024) * 10) / 10) + ' KB';
    usage.innerHTML = '<span class="as-settings-storage-value">' + readable + '</span><span class="as-settings-storage-label">used by ASCharts settings</span>';
    storage.card.appendChild(usage);
    body.appendChild(storage);

    const reset = section('Reset', 'Return every ASCharts setting to its default. This cannot be undone.');
    const resetActions = document.createElement('div');
    resetActions.className = 'as-settings-actions';
    resetActions.appendChild(actionButton('Reset all settings', 'trash', 'as-settings-button-danger', resetSettings));
    reset.card.appendChild(resetActions);
    body.appendChild(reset);
  }

  function buildAbout(body) {
    const about = section('ASCharts', 'A calmer, more personal Class Charts experience.');
    const card = document.createElement('div');
    card.className = 'as-about-card';
    card.innerHTML = `
      <div class="as-about-mark">${icon('settings', 26)}</div>
      <div class="as-about-copy">
        <div class="as-about-title">ASCharts <span class="as-about-version" role="button" tabindex="0" title="Version">v${VERSION}</span></div>
        <p>A visual refresh for Class Charts with quick actions, theming, accessibility options and a detention-free celebration.</p>
      </div>`;
    about.card.appendChild(card);

    // Seven taps on the version chip is the quietest secret in the app.
    const versionChip = card.querySelector('.as-about-version');
    if (versionChip) {
      let taps = 0;
      let tapTimer = 0;
      const tapVersion = () => {
        taps += 1;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { taps = 0; }, 1500);
        if (taps < 7) return;
        taps = 0;
        A.toast({
          key: 'about-secret',
          title: 'Seven taps',
          message: 'A small secret, just for you.',
          tone: 'success',
          duration: 3,
        });
        if (typeof A.celebrate === 'function') A.celebrate();
      };
      versionChip.addEventListener('click', tapVersion);
      versionChip.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          tapVersion();
        }
      });
    }

    const whatsNew = document.createElement('div');
    whatsNew.className = 'as-whats-new';
    whatsNew.innerHTML = `
      <div class="as-whats-new-title">What's new in 1.5</div>
      <ul>
        <li>Command palette: press Ctrl + K to jump to any page, setting or action.</li>
        <li>Shortcut cheat-sheet with ?, plus Alt + Shift + F, L and D quick toggles.</li>
        <li>Messaging tab proportions rebuilt with taller threads, roomier bubbles and a calmer composer.</li>
        <li>Scroll progress line, replayable page motion and a fade between settings tabs.</li>
        <li>Refined dividers, hover states and a subtle animated sidebar accent.</li>
        <li>New secrets hidden around the interface. Keep an eye on the wordmark.</li>
      </ul>`;
    about.card.appendChild(whatsNew);
    body.appendChild(about);

    const community = section('Community', 'Help shape the next version of ASCharts.');
    const actions = document.createElement('div');
    actions.className = 'as-settings-actions';
    actions.appendChild(actionButton('Join the Beta Programme', 'sparkles', '', openBetaModal));
    community.card.appendChild(actions);
    community.card.appendChild(note('ASCharts is an independent project and is not affiliated with Class Charts or Tes.'));
    body.appendChild(community);
  }

  /* ─── Accent picker ────────────────────────────────────── */

  function createAccentPicker() {
    const wrapper = document.createElement('div');
    wrapper.className = 'as-accent-picker';

    const swatches = document.createElement('div');
    swatches.className = 'as-accent-swatches';

    const current = A.get('accent');
    let selectedButton = null;

    ACCENTS.forEach((accent) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'as-accent-swatch';
      button.style.backgroundColor = accent.color;
      button.title = accent.name;
      button.setAttribute('aria-label', 'Set accent colour to ' + accent.name);
      if (accent.color.toLowerCase() === current.toLowerCase()) {
        button.classList.add('as-accent-selected');
        selectedButton = button;
      }
      button.addEventListener('click', () => {
        A.set('accent', accent.color);
        if (selectedButton) selectedButton.classList.remove('as-accent-selected');
        selectedButton = button;
        button.classList.add('as-accent-selected');
        colorInput.value = accent.color;
        hexInput.value = accent.color;
        notify('Accent colour set to ' + accent.name, 'Appearance');
      });
      swatches.appendChild(button);
    });

    const custom = document.createElement('div');
    custom.className = 'as-accent-custom';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'as-color-input';
    colorInput.value = current;
    colorInput.setAttribute('aria-label', 'Custom accent colour');

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.className = 'as-hex-input';
    hexInput.value = current;
    hexInput.maxLength = 7;
    hexInput.spellcheck = false;
    hexInput.setAttribute('aria-label', 'Accent colour hex value');

    const applyColor = (value, announce) => {
      if (!/^#?[0-9a-f]{6}$/i.test(value)) return;
      const normalized = value.startsWith('#') ? value : '#' + value;
      A.set('accent', normalized);
      colorInput.value = normalized;
      hexInput.value = normalized;
      swatches.querySelectorAll('.as-accent-swatch').forEach((element) => element.classList.remove('as-accent-selected'));
      selectedButton = null;
      if (announce) notify('Custom accent colour applied', 'Appearance');
    };

    colorInput.addEventListener('input', () => {
      hexInput.value = colorInput.value;
    });
    colorInput.addEventListener('change', () => applyColor(colorInput.value, true));
    hexInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); applyColor(hexInput.value, true); }
    });
    hexInput.addEventListener('blur', () => applyColor(hexInput.value, false));

    custom.append(colorInput, hexInput);
    wrapper.append(swatches, custom);
    return wrapper;
  }

  /* ─── Avatar & display name ────────────────────────────── */

  function createAvatarPicker() {
    const wrapper = document.createElement('div');
    wrapper.className = 'as-settings-row as-settings-row-stack';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';
    info.innerHTML = '<div class="as-settings-label">Profile picture</div><div class="as-settings-desc">Set a custom avatar for this browser.</div>';
    wrapper.appendChild(info);

    const avatarRow = document.createElement('div');
    avatarRow.className = 'as-avatar-row';

    const preview = document.createElement('div');
    preview.className = 'as-avatar-preview';
    const savedAvatar = A.get('avatar');
    if (savedAvatar) preview.style.backgroundImage = 'url(' + savedAvatar + ')';
    else preview.innerHTML = icon('user', 30);
    avatarRow.appendChild(preview);

    const buttons = document.createElement('div');
    buttons.className = 'as-avatar-buttons';

    const choose = document.createElement('button');
    choose.type = 'button';
    choose.className = 'as-settings-button as-settings-button-small';
    choose.innerHTML = icon('camera', 16) + '<span>Choose image</span>';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;

    choose.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const maxSize = 128;
          const canvas = document.createElement('canvas');
          let width = image.width;
          let height = image.height;
          if (width > height) { height = (height / width) * maxSize; width = maxSize; }
          else { width = (width / height) * maxSize; height = maxSize; }
          canvas.width = Math.round(width);
          canvas.height = Math.round(height);
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          A.set('avatar', dataUrl);
          preview.style.backgroundImage = 'url(' + dataUrl + ')';
          preview.innerHTML = '';
          applyAvatar();
          A.toast({ key: 'avatar', title: 'Avatar updated', message: 'Your new profile picture is now visible.', tone: 'success' });
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'as-settings-button as-settings-button-small as-settings-button-outline';
    reset.textContent = 'Reset';
    reset.addEventListener('click', () => {
      A.set('avatar', '');
      preview.style.backgroundImage = '';
      preview.innerHTML = icon('user', 30);
      document.querySelectorAll('.desktop-drawer-pupil > div:first-child > div img').forEach((image) => {
        if (image.dataset.origSrc) image.src = image.dataset.origSrc;
      });
      A.toast({ key: 'avatar', title: 'Avatar reset', message: 'The original profile picture is back.', tone: 'success' });
    });

    buttons.append(choose, fileInput, reset);
    avatarRow.appendChild(buttons);
    wrapper.appendChild(avatarRow);
    return wrapper;
  }

  function createDisplayNameControl() {
    const wrapper = document.createElement('div');
    wrapper.className = 'as-settings-row as-settings-row-stack';

    const info = document.createElement('div');
    info.className = 'as-settings-row-info';
    info.innerHTML = '<div class="as-settings-label">Display name</div><div class="as-settings-desc">Change the name in your profile card on this browser only. This does not change your school account.</div>';
    wrapper.appendChild(info);

    const controls = document.createElement('div');
    controls.className = 'as-display-name-controls';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'as-text-input';
    input.maxLength = 40;
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = 'Enter a display name';
    input.setAttribute('aria-label', 'Local display name');
    input.value = A.get('displayName') || '';

    const actions = document.createElement('div');
    actions.className = 'as-display-name-actions';

    const apply = document.createElement('button');
    apply.type = 'button';
    apply.className = 'as-settings-button as-settings-button-small';
    apply.textContent = 'Apply';

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'as-settings-button as-settings-button-small as-settings-button-outline';
    reset.textContent = 'Use account name';

    const status = document.createElement('div');
    status.className = 'as-display-name-status';
    status.setAttribute('aria-live', 'polite');

    const applyValue = (clear) => {
      const value = clear ? '' : input.value.replace(/\s+/g, ' ').trim().slice(0, 40);
      input.value = value;
      A.set('displayName', value);
      status.textContent = value ? 'Updated on this device.' : 'Using the name from your school account.';
      A.toast({
        key: 'display-name',
        title: value ? 'Display name updated' : 'Account name restored',
        message: value ? 'Your profile card now shows "' + value + '".' : 'Your school account name is shown again.',
        tone: 'success',
      });
    };

    apply.addEventListener('click', () => applyValue(false));
    reset.addEventListener('click', () => { input.value = ''; applyValue(true); });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); applyValue(false); }
    });

    actions.append(apply, reset);
    controls.append(input, actions, status);
    wrapper.appendChild(controls);
    return wrapper;
  }

  /* ─── Panel rendering ──────────────────────────────────── */

  function renderNav() {
    if (!state.nav) return;
    state.nav.replaceChildren();

    TABS.forEach((tab) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'as-settings-tab';
      button.dataset.tab = tab.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(tab.id === state.tab));
      button.setAttribute('aria-controls', 'as-settings-panel');
      button.tabIndex = tab.id === state.tab ? 0 : -1;
      button.innerHTML = '<span class="as-settings-tab-icon">' + icon(tab.icon, 18) + '</span><span class="as-settings-tab-label">' + tab.label + '</span>';
      if (tab.id === state.tab) button.classList.add('as-settings-tab-active');
      button.addEventListener('click', () => switchTab(tab.id, false));
      state.nav.appendChild(button);
    });
  }

  function switchTab(tabId, focus) {
    if (!TABS.some((tab) => tab.id === tabId)) return;
    state.tab = tabId;
    A.set('settingsTab', tabId);
    if (state.nav) {
      state.nav.querySelectorAll('.as-settings-tab').forEach((button) => {
        const active = button.dataset.tab === tabId;
        button.classList.toggle('as-settings-tab-active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && focus) button.focus();
      });
    }
    renderTab();
  }

  function renderTab() {
    if (!state.content) return;
    const tab = TABS.find((candidate) => candidate.id === state.tab) || TABS[0];

    const heading = document.createElement('div');
    heading.className = 'as-settings-content-head';
    const title = document.createElement('h3');
    title.textContent = tab.title;
    const description = document.createElement('p');
    description.textContent = tab.description;
    heading.append(title, description);

    const body = document.createElement('div');
    body.className = 'as-settings-content-body';

    const builders = {
      appearance: buildAppearance,
      layout: buildLayout,
      accessibility: buildAccessibility,
      profile: buildProfile,
      features: buildFeatures,
      data: buildData,
      about: buildAbout,
    };
    (builders[tab.id] || buildAppearance)(body);

    state.content.replaceChildren(heading, body);
    state.content.scrollTop = 0;
  }

  function buildPanel() {
    const overlay = document.createElement('div');
    overlay.className = 'as-settings-overlay';
    overlay.addEventListener('mousedown', (event) => {
      if (event.target === overlay) closeSettings();
    });

    const dialog = document.createElement('section');
    dialog.className = 'as-settings-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'as-settings-title');

    const header = document.createElement('header');
    header.className = 'as-settings-header';
    header.innerHTML = `
      <div class="as-settings-brand">
        <span class="as-settings-mark">${icon('settings', 21)}</span>
        <div class="as-settings-brand-copy">
          <h2 id="as-settings-title">Settings</h2>
          <p>Personalise your ASCharts experience</p>
        </div>
      </div>
      <div class="as-settings-header-actions">
        <span class="as-settings-version">v${VERSION}</span>
        <button type="button" class="as-settings-close" aria-label="Close settings" title="Close settings">${icon('close', 19)}</button>
      </div>`;

    const layout = document.createElement('div');
    layout.className = 'as-settings-layout';

    const nav = document.createElement('nav');
    nav.className = 'as-settings-nav';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Settings sections');
    nav.setAttribute('aria-orientation', 'vertical');

    const content = document.createElement('section');
    content.className = 'as-settings-content';
    content.id = 'as-settings-panel';
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('aria-label', 'Settings content');

    layout.append(nav, content);

    const footer = document.createElement('footer');
    footer.className = 'as-settings-footer';
    footer.innerHTML = `
      <span class="as-settings-autosave">${icon('check', 14)} Changes save automatically</span>
      <button type="button" class="as-settings-done">Done</button>`;

    dialog.append(header, layout, footer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    state.overlay = overlay;
    state.dialog = dialog;
    state.nav = nav;
    state.content = content;
    state.footer = footer;

    header.querySelector('.as-settings-close').addEventListener('click', closeSettings);
    footer.querySelector('.as-settings-done').addEventListener('click', closeSettings);

    nav.addEventListener('keydown', (event) => {
      const current = event.target.closest('.as-settings-tab');
      if (!current) return;
      const index = TABS.findIndex((tab) => tab.id === current.dataset.tab);
      let next = index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % TABS.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = TABS.length - 1;
      else return;
      event.preventDefault();
      switchTab(TABS[next].id, true);
    });

    renderNav();
    renderTab();

    state.onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSettings();
        return;
      }
      if (event.key !== 'Tab' || !state.dialog) return;
      const focusable = [...state.dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', state.onKeyDown, true);
  }

  function openSettings(tabId) {
    if (state.overlay) {
      if (tabId) switchTab(tabId, true);
      return;
    }
    if (state.closing) return;
    state.tab = validTab(tabId || A.get('settingsTab'));
    state.opener = document.activeElement;
    buildPanel();
    A.lockScroll();
    const showPanel = () => {
      if (state.overlay) state.overlay.classList.add('as-settings-open');
    };
    requestAnimationFrame(showPanel);
    // Fallback for contexts where animation frames are throttled.
    setTimeout(showPanel, 80);
    setTimeout(() => {
      const active = state.nav && state.nav.querySelector('.as-settings-tab-active');
      if (active) active.focus();
    }, 70);
  }

  function closeSettings() {
    if (!state.overlay || state.closing) return;
    state.closing = true;
    const overlay = state.overlay;
    const opener = state.opener;

    if (state.onKeyDown) document.removeEventListener('keydown', state.onKeyDown, true);
    overlay.classList.remove('as-settings-open');
    overlay.classList.add('as-settings-closing');

    setTimeout(() => {
      overlay.remove();
      state.overlay = null;
      state.dialog = null;
      state.nav = null;
      state.content = null;
      state.footer = null;
      state.onKeyDown = null;
      state.closing = false;
      A.unlockScroll();
      if (opener && document.contains(opener) && typeof opener.focus === 'function') opener.focus();
    }, 230);
  }

  /* ─── Data actions ─────────────────────────────────────── */

  function exportSettings() {
    try {
      const data = A.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'ascharts-settings.json';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
      A.toast({ key: 'export', title: 'Settings exported', message: 'ascharts-settings.json has been downloaded.', tone: 'success' });
    } catch (error) {
      A.toast({ key: 'export', title: 'Export failed', message: 'Your browser blocked the download.', tone: 'error' });
    }
  }

  function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || ''));
          const count = A.importData(parsed);
          state.tab = validTab(A.get('settingsTab'));
          renderNav();
          renderTab();
          A.toast({
            key: 'import',
            title: 'Settings imported',
            message: count + ' setting' + (count === 1 ? '' : 's') + ' restored from your backup.',
            tone: 'success',
          });
        } catch (error) {
          A.toast({
            key: 'import',
            title: 'Import failed',
            message: error && error.message ? error.message : 'That file could not be read.',
            tone: 'error',
          });
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  async function resetSettings() {
    const confirmed = await A.confirm({
      title: 'Reset all settings?',
      message: 'This restores ASCharts to its default appearance and clears every local preference, including your display name and avatar. This cannot be undone.',
      confirmLabel: 'Reset settings',
      cancelLabel: 'Keep my settings',
      tone: 'danger',
    });
    if (!confirmed) return;

    A.resetAll();
    state.tab = 'appearance';
    A.set('settingsTab', 'appearance');
    renderNav();
    renderTab();
    A.toast({
      key: 'reset',
      title: 'Settings reset',
      message: 'ASCharts has been restored to its defaults.',
      tone: 'success',
    });
  }

  /* ─── Beta / info modal ────────────────────────────────── */

  function openBetaModal() {
    if (document.querySelector('.as-info-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'as-info-modal-overlay';
    overlay.addEventListener('mousedown', (event) => {
      if (event.target === overlay) closeInfoModal(overlay);
    });

    const card = document.createElement('section');
    card.className = 'as-info-modal-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'as-beta-modal-title');
    card.innerHTML = `
      <div class="as-info-modal-header">
        <div class="as-info-modal-title" id="as-beta-modal-title">Join the Beta Programme</div>
        <button class="as-info-modal-close" type="button" aria-label="Close dialog" title="Close">${icon('close', 18)}</button>
      </div>
      <div class="as-info-modal-body">
        <p>Want to try upcoming ASCharts features before everyone else?</p>
        <p class="as-info-modal-email-line">Email <a class="as-info-modal-email" href="mailto:adamshahid153@gmail.com">adamshahid153@gmail.com</a> and tell us a little about how you use Class Charts.</p>
      </div>
      <div class="as-info-modal-footer">
        <button class="as-info-modal-button as-info-modal-button-secondary" type="button" data-as-close>Close</button>
        <button class="as-info-modal-button as-info-modal-button-primary" type="button" data-as-copy>${icon('mail', 15)} Copy email</button>
      </div>`;

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    A.lockScroll();

    const close = () => closeInfoModal(overlay);
    card.querySelector('.as-info-modal-close').addEventListener('click', close);
    card.querySelector('[data-as-close]').addEventListener('click', close);
    card.querySelector('[data-as-copy]').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      try {
        await navigator.clipboard.writeText('adamshahid153@gmail.com');
        button.textContent = 'Copied';
        A.toast({ key: 'beta-email', title: 'Email copied', message: 'adamshahid153@gmail.com', tone: 'success' });
      } catch (error) {
        const email = card.querySelector('.as-info-modal-email');
        const range = document.createRange();
        range.selectNodeContents(email);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Select and copy';
      }
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeInfoModal(overlay);
      }
    };
    overlay._asKeyHandler = onKeyDown;
    document.addEventListener('keydown', onKeyDown, true);

    requestAnimationFrame(() => {
      overlay.classList.add('as-info-modal-open');
      setTimeout(() => {
        const closeButton = card.querySelector('.as-info-modal-close');
        if (closeButton) closeButton.focus();
      }, 50);
    });
  }

  function closeInfoModal(overlay) {
    if (!overlay || overlay.dataset.asClosing === '1') return;
    overlay.dataset.asClosing = '1';
    overlay.classList.remove('as-info-modal-open');
    if (overlay._asKeyHandler) document.removeEventListener('keydown', overlay._asKeyHandler, true);
    A.unlockScroll();
    setTimeout(() => overlay.remove(), 190);
  }

  /* ─── Header gear & avatar ─────────────────────────────── */

  function ensureGearButton() {
    const toolbar = document.querySelector('#desktop-app header .MuiToolbar-root');
    if (!toolbar) return;

    let button = document.querySelector('.as-settings-gear');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'as-settings-gear';
      button.title = 'ASCharts Settings (Alt + Shift + S)';
      button.setAttribute('aria-label', 'Open ASCharts Settings');
      button.innerHTML = icon('settings', 21);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (state.overlay) closeSettings();
        else openSettings();
      });
    }

    if (button.parentElement !== toolbar) {
      const actions = toolbar.lastElementChild && toolbar.lastElementChild.tagName === 'DIV'
        ? toolbar.lastElementChild
        : null;
      if (actions) toolbar.insertBefore(button, actions);
      else toolbar.appendChild(button);
    }
  }

  function storeOrigAvatars() {
    document.querySelectorAll('.desktop-drawer-pupil > div:first-child > div img').forEach((image) => {
      if (!image.dataset.origSrc && image.src && !image.src.startsWith('data:')) {
        image.dataset.origSrc = image.src;
      }
    });
  }

  function applyAvatar() {
    const data = A.get('avatar');
    if (!data) return;
    document.querySelectorAll('.desktop-drawer-pupil > div:first-child > div img').forEach((image) => {
      if (image.src !== data) image.src = data;
    });
  }

  function run() {
    ensureGearButton();
    storeOrigAvatars();
    applyAvatar();
  }

  /* ─── Boot ─────────────────────────────────────────────── */

  document.addEventListener('keydown', (event) => {
    if (event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey &&
        (event.code === 'KeyS' || String(event.key).toLowerCase() === 's') &&
        !isEditableTarget(event.target)) {
      event.preventDefault();
      if (state.overlay) closeSettings();
      else openSettings();
    }
  }, true);

  window.addEventListener('ascharts:open-settings', (event) => {
    openSettings(event.detail && event.detail.tab);
  });
  window.addEventListener('ascharts:close-settings', closeSettings);

  run();
  window.addEventListener('load', run, { once: true });

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      run();
    }, 140);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
