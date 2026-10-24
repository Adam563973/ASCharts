(() => {
  const STORE_KEY = "ascharts-sidebar-hidden";
  const NS = "http://www.w3.org/2000/svg";

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
  };

  const LABEL_ICON = [
    [/behaviou?r/i, "behaviour"],
    [/announce/i, "announcements"],
    [/homework/i, "homework"],
    [/detention/i, "detentions"],
    [/wellbeing/i, "wellbeing"],
    [/timetable/i, "timetable"],
    [/attendance/i, "attendance"],
    [/concern/i, "concern"],
    [/message/i, "messages"],
    [/reward|shop/i, "rewards"],
    [/badge|award/i, "badges"],
    [/class/i, "classes"],
  ];

  function makeIcon(name) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.9");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("as-icon");
    svg.dataset.icon = name;
    svg.innerHTML = ICONS[name];
    return svg;
  }

  function iconFor(label) {
    const hit = LABEL_ICON.find(([re]) => re.test(label));
    return hit ? hit[1] : "fallback";
  }

  function upgradeMenu() {
    for (const item of document.querySelectorAll(".desktop-drawer-pupil-menu-item")) {
      const iconBox = item.querySelector(".MuiListItemIcon-root");
      if (!iconBox) continue;
      const name = iconFor(item.textContent.trim());
      const current = iconBox.querySelector(":scope > svg.as-icon");
      if (!current || current.dataset.icon !== name) {
        if (current) current.remove();
        iconBox.appendChild(makeIcon(name));
      }
      const active = [...item.classList].some((c) => /^jss\d+$/.test(c));
      if (active !== item.hasAttribute("data-as-active")) item.toggleAttribute("data-as-active", active);
    }
  }

  function isHidden() {
    return document.documentElement.classList.contains("as-sidebar-hidden");
  }

  function setHidden(hidden) {
    document.documentElement.classList.toggle("as-sidebar-hidden", hidden);
    try { localStorage.setItem(STORE_KEY, hidden ? "1" : "0"); } catch (e) {}
    const btn = document.querySelector(".as-sidebar-toggle");
    if (btn) {
      btn.replaceChildren(makeIcon(hidden ? "panelOpen" : "panelClose"));
      btn.title = hidden ? "Show sidebar" : "Hide sidebar";
      btn.setAttribute("aria-label", btn.title);
      btn.setAttribute("aria-expanded", String(!hidden));
    }
    setTimeout(() => window.dispatchEvent(new Event("resize")), 320);
  }

  function ensureToggle() {
    const hasDrawer = !!document.querySelector(".desktop-drawer");
    const toolbar = document.querySelector("#desktop-app header .MuiToolbar-root");
    let btn = document.querySelector(".as-sidebar-toggle");
    if (!hasDrawer || !toolbar) {
      if (btn) btn.remove();
      if (document.documentElement.classList.contains("as-sidebar-ready")) {
        document.documentElement.classList.remove("as-sidebar-ready");
      }
      return;
    }
    if (!document.documentElement.classList.contains("as-sidebar-ready")) {
      document.documentElement.classList.add("as-sidebar-ready");
    }
    if (btn && btn.parentElement === toolbar) return;
    if (btn) btn.remove();
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "as-sidebar-toggle";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setHidden(!isHidden());
    });
    toolbar.prepend(btn);
    let saved = false;
    try { saved = localStorage.getItem(STORE_KEY) === "1"; } catch (e) {}
    document.documentElement.classList.toggle("as-sidebar-hidden", saved);
    btn.replaceChildren(makeIcon(saved ? "panelOpen" : "panelClose"));
    btn.title = saved ? "Show sidebar" : "Hide sidebar";
    btn.setAttribute("aria-label", btn.title);
    btn.setAttribute("aria-expanded", String(!saved));
  }

  const CARD_SELECTOR = [
    ".calendar-header",
    ".announcement-card",
    ".homework-group",
    ".activity-entry",
    ".detentions-page > div",
    ".timetable-header .MuiPaper-rounded",
    ".attendance-page > div > *",
    ".mental-health-page > div",
    ".report-concern-page > *",
  ].join(", ");

  function animateIn(el, delayMs) {
    el.style.setProperty("--as-delay", `${delayMs}ms`);
    el.classList.add("as-in");
    el.addEventListener("animationend", () => {
      el.classList.remove("as-in");
      el.style.removeProperty("--as-delay");
    }, { once: true });
  }

  function animatePages() {
    const header = document.querySelector("#desktop-app header");
    const main = header && header.nextElementSibling;
    if (!main) return;
    for (const page of main.querySelectorAll('[class*="-page"]')) {
      if (page.dataset.asSeen) continue;
      if (page.parentElement.closest('[class*="-page"]')) continue;
      page.dataset.asSeen = "1";
      animateIn(page, 0);
      const cards = [...page.querySelectorAll(CARD_SELECTOR)]
        .filter((card) => !card.parentElement.closest(CARD_SELECTOR));
      cards.forEach((card, i) => animateIn(card, Math.min(i, 8) * 45 + 40));
    }
  }

  function markTimetableSelection() {
    for (const day of document.querySelectorAll(".timetable-header .MuiPaper-rounded")) {
      const bg = getComputedStyle(day).backgroundColor;
      const selected = bg === "rgb(32, 150, 243)";
      if (selected !== day.hasAttribute("data-as-selected")) day.toggleAttribute("data-as-selected", selected);
    }
  }

  function run() {
    upgradeMenu();
    ensureToggle();
    animatePages();
    markTimetableSelection();
  }

  run();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; run(); }, 50);
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
})();
