(() => {
  const DARK_BLUE = "var(--as-navy, #0b1f4d)";
  const NAME_RE = /class\s*charts/gi;

  function isTopBanner(el) {
    const r = el.getBoundingClientRect();
    if (r.top > 5 || r.height < 30 || r.height > 160 || r.width < window.innerWidth * 0.6) return false;
    const bg = getComputedStyle(el).backgroundColor;
    return bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)";
  }

  function topBanners() {
    return [...document.querySelectorAll("body *")].filter(isTopBanner);
  }

  function paint(banners) {
    for (const el of banners) {
      el.style.setProperty("background-color", DARK_BLUE, "important");
      el.style.setProperty("background-image", "none", "important");
      el.style.setProperty("border-color", DARK_BLUE, "important");
    }
  }

  function renameText(banners) {
    for (const root of banners) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        if (/class\s*charts/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(NAME_RE, "ASCharts");
      }
    }
    if (/class\s*charts/i.test(document.title)) document.title = document.title.replace(NAME_RE, "ASCharts");
  }

  function replaceLogos() {
    for (const img of document.querySelectorAll("img, svg")) {
      if (img.dataset.ascharts) continue;
      const r = img.getBoundingClientRect();
      if (r.top > 120 || r.width === 0) continue;
      const hint = [
        img.getAttribute("src"),
        img.getAttribute("alt"),
        img.getAttribute("class"),
        img.parentElement && img.parentElement.className,
        img.closest("a") && img.closest("a").getAttribute("href"),
      ].join(" ").toLowerCase();
      if (!/logo|classcharts|class-charts|brand/.test(hint)) continue;
      let box = null;
      for (let el = img.parentElement; el && el !== document.body; el = el.parentElement) {
        const br = el.getBoundingClientRect();
        if (br.top > 5 || br.height > 100) break;
        box = el;
      }
      if (box) {
        box.style.setProperty("background-color", DARK_BLUE, "important");
        box.style.setProperty("background-image", "none", "important");
      }
      img.dataset.ascharts = "1";
      img.style.display = "none";
      if (!document.querySelector(".ascharts-logo")) {
        const span = document.createElement("span");
        span.className = "ascharts-logo";
        span.textContent = "ASCharts";
        img.insertAdjacentElement("afterend", span);
      }
    }
  }

  function replaceBackgroundLogos() {
    for (const el of document.querySelectorAll("body *")) {
      if (el.dataset.ascharts) continue;
      const r = el.getBoundingClientRect();
      if (r.top > 120 || r.width === 0) continue;
      const bgImg = getComputedStyle(el).backgroundImage;
      const hint = `${bgImg} ${el.id} ${el.className}`.toLowerCase();
      if (!bgImg || bgImg === "none" || !/logo|classcharts|cc_/.test(hint)) continue;
      el.dataset.ascharts = "1";
      el.style.setProperty("background-image", "none", "important");
      if (document.querySelector(".ascharts-logo")) continue;
      const span = document.createElement("span");
      span.className = "ascharts-logo";
      span.style.height = "100%";
      span.textContent = "ASCharts";
      el.appendChild(span);
    }
  }

  function run() {
    replaceBackgroundLogos();
    const banners = topBanners();
    paint(banners);
    renameText(banners);
    replaceLogos();
  }

  run();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; run(); }, 100);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener("resize", run);
})();
