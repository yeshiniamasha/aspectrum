/* ============================================================
   Aspectrum — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky nav + scroll progress ---- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-stuck", y > 60);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  function closeMenu() {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll(".reveal");
  function inViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 0) - 30 && r.bottom > 0;
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) {
      // Reveal anything already on screen right away; observe the rest.
      if (inViewport(el)) el.classList.add("is-visible");
      else io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll(".stat__num");
  const seen = new WeakSet();
  function runCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? "+" : "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen.has(e.target)) {
          seen.add(e.target);
          runCounter(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count") + "+"; });
  }

  /* ---- Portfolio filter ---- */
  const tabs = document.querySelectorAll(".tab");
  const cards = document.querySelectorAll(".gallery .card");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");
      const f = tab.getAttribute("data-filter");
      cards.forEach(function (card) {
        const show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---- Lightbox ---- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  // Build ordered list of all viewable items (cards + featured)
  const items = Array.prototype.map.call(
    document.querySelectorAll("[data-full]"),
    function (el) {
      const img = el.querySelector("img");
      return { src: el.getAttribute("data-full"), alt: img ? img.alt : "Artwork", el: el };
    }
  );
  let current = 0;

  function openLightbox(index) {
    current = index;
    const it = items[current];
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function step(dir) {
    current = (current + dir + items.length) % items.length;
    const it = items[current];
    lbImg.style.opacity = "0";
    setTimeout(function () {
      lbImg.src = it.src;
      lbImg.alt = it.alt;
      lbImg.style.opacity = "1";
    }, 160);
  }

  items.forEach(function (it, i) {
    it.el.addEventListener("click", function (ev) {
      ev.preventDefault();
      openLightbox(i);
    });
  });
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { step(-1); });
  lbNext.addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  lbImg.style.transition = "opacity .2s ease";
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---- Contact form (graceful) ---- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function () {
      // FormSubmit handles delivery; show a friendly note before redirect.
      note.textContent = "Sending your message…";
    });
  }

  /* ---- Showreel mute toggle ---- */
  var reel = document.getElementById("showreel");
  var reelMute = document.getElementById("reelMute");
  if (reel && reelMute) {
    var icon = reelMute.querySelector(".reel-frame__mute-icon");
    var label = reelMute.querySelector(".reel-frame__mute-label");
    reelMute.addEventListener("click", function () {
      reel.muted = !reel.muted;
      if (!reel.muted) { reel.play().catch(function () {}); }
      reelMute.setAttribute("aria-pressed", String(!reel.muted));
      reelMute.setAttribute("aria-label", reel.muted ? "Unmute showreel" : "Mute showreel");
      if (icon) icon.textContent = reel.muted ? "🔇" : "🔊";
      if (label) label.textContent = reel.muted ? "Unmute" : "Mute";
    });
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
