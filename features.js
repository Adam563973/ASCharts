(() => {
  'use strict';

  if (window.top !== window) return;
  const A = window.ASCharts;
  if (!A) return;

  /* =============================================================
     ASCharts — features.js
     Local display name, homework-dialog guard, shortcuts and the
     detention-free confetti celebration.
     ============================================================= */

  function applyLocalDisplayName() {
    const name = (A.get('displayName') || '').replace(/\s+/g, ' ').trim().slice(0, 40);
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
      ? event.target.closest('.desktop-drawer-pupil-menu-item')
      : null;

    if (navItem && /^homework$/i.test((navItem.textContent || '').replace(/\s+/g, ' ').trim())) {
      pendingHomeworkNavigation = {
        until: Date.now() + 2000,
        existing: new Set(document.querySelectorAll('.homework-details-dialog')),
      };
      setTimeout(closeUnexpectedHomeworkDialog, 40);
      setTimeout(closeUnexpectedHomeworkDialog, 180);
      setTimeout(closeUnexpectedHomeworkDialog, 500);
      return;
    }

    if (pendingHomeworkNavigation) pendingHomeworkNavigation = null;
  }, true);

  document.addEventListener('keydown', (event) => {
    if (!A.getBool('shortcuts') || isEditableTarget(event.target)) return;
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

  /* ─── Detention-free celebration ───────────────────────── */

  const alreadyCelebrated = new WeakSet();
  let activeCelebration = null;
  let lastCelebrationAt = 0;

  function readLastCelebration() {
    try { return Number(sessionStorage.getItem('ascharts-detfree-last') || 0); } catch (error) { return 0; }
  }

  function rememberCelebration() {
    try { sessionStorage.setItem('ascharts-detfree-last', String(Date.now())); } catch (error) { /* ignore */ }
  }

  function playChime() {
    try {
      const AudioContextType = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextType) return;
      const context = new AudioContextType();
      if (context.state === 'suspended') context.resume().catch(() => {});
      const start = context.currentTime + 0.03;
      [659.25, 783.99, 987.77].forEach((frequency, index) => {
        const at = start + (index * 0.11);
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.linearRampToValueAtTime(0.035, at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.26);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.28);
      });
      setTimeout(() => context.close().catch(() => {}), 900);
    } catch (error) { /* Audio may be blocked until a user gesture. */ }
  }

  function stopCelebration() {
    if (!activeCelebration) return;
    const current = activeCelebration;
    activeCelebration = null;
    current.cleanup();
  }

  function showConfettiCelebration() {
    if (activeCelebration || document.querySelector('.as-confetti-overlay')) return;

    const reducedMotion = A.getBool('reduceMotion') ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (reducedMotion) {
      A.toast({
        key: 'detention-free',
        title: 'No detentions',
        message: 'You have no detentions. Nice work.',
        tone: 'success',
        duration: 3,
      });
      return;
    }

    const intensity = A.get('confettiIntensity');
    const count = intensity === 'low' ? 90 : (intensity === 'high' ? 260 : 160);
    const duration = Math.max(2, Math.min(8, Number(A.get('confettiDuration')) || 3));

    const overlay = document.createElement('div');
    overlay.className = 'as-confetti-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');

    const canvas = document.createElement('canvas');
    canvas.className = 'as-confetti-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const announcement = document.createElement('span');
    announcement.className = 'as-sr-only';
    announcement.textContent = 'No detentions. Well done.';

    overlay.append(canvas, announcement);
    document.body.appendChild(overlay);
    A.lockScroll();
    document.documentElement.classList.add('as-confetti-running');

    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--as-accent').trim() || '#0b1f4d';
    const colors = [accent, '#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#facc15'];
    const particles = [];
    let raf = 0;
    let stopped = false;

    function makeParticle(initial) {
      const size = 5 + (Math.random() * 7);
      return {
        x: Math.random() * width,
        y: initial ? (-20 - (Math.random() * height * 0.35)) : (-20 - Math.random() * 60),
        vx: (Math.random() - 0.5) * 2.4,
        vy: 1.6 + (Math.random() * 3.6),
        gravity: 0.04 + (Math.random() * 0.035),
        drag: 0.995,
        w: size,
        h: size * (0.45 + Math.random() * 0.8),
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.22,
        sway: 0.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        shape: Math.random() < 0.18 ? 'circle' : (Math.random() < 0.2 ? 'ribbon' : 'rect'),
        opacity: 0.75 + Math.random() * 0.25,
      };
    }

    function drawParticle(particle) {
      if (!context) return;
      context.save();
      context.globalAlpha = particle.opacity;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rot);
      context.fillStyle = particle.color;
      if (particle.shape === 'circle') {
        context.beginPath();
        context.arc(0, 0, particle.w * 0.45, 0, Math.PI * 2);
        context.fill();
      } else if (particle.shape === 'ribbon') {
        context.fillRect(-particle.w * 0.25, -particle.h * 0.9, particle.w * 0.5, particle.h * 1.8);
      } else {
        context.fillRect(-particle.w / 2, -particle.h / 2, particle.w, particle.h);
      }
      context.restore();
    }

    const initialCount = Math.floor(count * 0.55);
    for (let index = 0; index < initialCount; index += 1) particles.push(makeParticle(true));

    const startedAt = performance.now();
    // Keep spawning for most of the celebration so long durations do not
    // empty the screen before the freeze ends.
    const spawnWindow = 0.9;
    let spawnUntil = startedAt + (duration * 1000 * spawnWindow);
    let lastFrame = startedAt;
    let spawnAccumulator = 0;
    const spawnPerFrame = count / (duration * 60 * spawnWindow);

    function frame(now) {
      if (stopped) return;
      const delta = Math.min(34, now - lastFrame) / 16.667;
      lastFrame = now;

      if (now < spawnUntil && particles.length < count * 1.8) {
        spawnAccumulator += spawnPerFrame * delta;
        while (spawnAccumulator >= 1 && particles.length < count * 1.8) {
          particles.push(makeParticle(false));
          spawnAccumulator -= 1;
        }
      }

      if (context) context.clearRect(0, 0, width, height);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.phase += 0.045 * delta;
        particle.x += (particle.vx + (Math.sin(particle.phase) * particle.sway * 0.6)) * delta;
        particle.y += particle.vy * delta;
        particle.vy += particle.gravity * delta;
        particle.vx *= Math.pow(particle.drag, delta);
        particle.rot += particle.vr * delta;

        if (particle.y > height + 40 || particle.x < -80 || particle.x > width + 80) {
          particles.splice(index, 1);
          continue;
        }
        drawParticle(particle);
      }

      raf = requestAnimationFrame(frame);
    }

    function blockInteraction(event) {
      if (event.type === 'keydown') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    }

    function blockContext(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const cleanup = () => {
      if (stopped) return;
      stopped = true;
      activeCelebration = null;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('wheel', blockInteraction, true);
      document.removeEventListener('touchmove', blockInteraction, true);
      document.removeEventListener('keydown', blockInteraction, true);
      document.removeEventListener('dragstart', blockInteraction, true);
      document.removeEventListener('selectstart', blockInteraction, true);
      overlay.removeEventListener('contextmenu', blockContext);
      overlay.removeEventListener('pointerdown', blockContext);
      overlay.classList.remove('as-confetti-active');
      // Keep the page frozen through the fade-out so the celebration ends
      // before scrolling or interaction is restored.
      setTimeout(() => {
        overlay.remove();
        A.unlockScroll();
        document.documentElement.classList.remove('as-confetti-running');
      }, 280);
    };

    document.addEventListener('wheel', blockInteraction, { capture: true, passive: false });
    document.addEventListener('touchmove', blockInteraction, { capture: true, passive: false });
    document.addEventListener('keydown', blockInteraction, true);
    document.addEventListener('dragstart', blockInteraction, true);
    document.addEventListener('selectstart', blockInteraction, true);
    overlay.addEventListener('contextmenu', blockContext);
    overlay.addEventListener('pointerdown', blockContext);
    window.addEventListener('resize', resize);

    const endTimer = setTimeout(cleanup, (duration * 1000) + 350);
    activeCelebration = {
      cleanup: () => {
        clearTimeout(endTimer);
        cleanup();
      },
    };

    requestAnimationFrame(() => overlay.classList.add('as-confetti-active'));
    raf = requestAnimationFrame(frame);

    if (A.getBool('confettiSound')) playChime();
  }

  function detentionPageIsEmpty(page) {
    const text = (page.innerText || page.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return false;

    const noDetentionPatterns = [
      /\bno\s+(?:(?:current|upcoming|scheduled|active|past)\s+)?detentions?\b/i,
      /\byou\s+(?:currently\s+)?have\s+no\s+detentions?\b/i,
      /\byou\s+(?:do not|don't)\s+have\s+any\s+detentions?\b/i,
      /\b0\s+detentions?\b/i,
    ];
    if (!noDetentionPatterns.some((pattern) => pattern.test(text))) return false;
    if (page.querySelector('a[href*="detention"], .detention-card, [class*="detention-item"]')) return false;

    // Guard against a page that says "no detentions" for one status while
    // another status contains an assigned detention.
    if (/\b(?!0\b)\d+\s+(?:active|scheduled|upcoming|current)\s+detentions?\b/i.test(text)) return false;
    return true;
  }

  function checkDetentionStatus() {
    if (!A.getBool('detentionCelebration')) return;
    if (document.hidden) return;

    const page = document.querySelector('.detentions-page');
    if (!page || alreadyCelebrated.has(page)) return;
    if (!page.isConnected || page.getClientRects().length === 0) return;
    if (!detentionPageIsEmpty(page)) return;

    if (Date.now() - Math.max(lastCelebrationAt, readLastCelebration()) < 20000) return;

    alreadyCelebrated.add(page);
    lastCelebrationAt = Date.now();
    rememberCelebration();
    showConfettiCelebration();
  }

  function run() {
    applyLocalDisplayName();
    closeUnexpectedHomeworkDialog();
    checkDetentionStatus();
  }

  window.addEventListener('ascharts:display-name-change', applyLocalDisplayName);
  window.addEventListener('ascharts:settings-imported', run);
  window.addEventListener('ascharts:settings-reset', run);
  window.addEventListener('ascharts:detention-celebration-setting-change', () => {
    if (!A.getBool('detentionCelebration')) stopCelebration();
    else checkDetentionStatus();
  });
  document.addEventListener('ascharts:setting-changed', (event) => {
    const key = event.detail && event.detail.key;
    if (key === 'reduceMotion' && A.getBool('reduceMotion')) stopCelebration();
    if (key === 'displayName') applyLocalDisplayName();
  });
  window.addEventListener('load', run, { once: true });

  run();

  // Public hooks for the command palette and easter eggs.
  A.celebrate = () => {
    const reduced = A.getBool('reduceMotion') ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) {
      A.toast({
        key: 'celebrate',
        title: 'Celebration',
        message: 'Confetti is paused while reduced motion is on.',
        tone: 'info',
        duration: 3,
      });
      return;
    }
    showConfettiCelebration();
  };
  A.stopCelebration = stopCelebration;

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      run();
    }, 180);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'hidden'],
  });
})();
