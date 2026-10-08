/* SPIDER ROOF MAN — demo concept interactions
   - Mobile nav toggle
   - Sticky header state
   - GSAP: word-mask hero intro, parallax, scroll reveals
   - Demo quote form (non-functional by design)
*/
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shadow ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Demo form (sends nothing) ---------- */
  var form = document.getElementById("quote-form");
  var notice = document.getElementById("form-notice");
  if (form && notice) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      notice.hidden = false;
      notice.setAttribute("tabindex", "-1");
      notice.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      notice.focus({ preventScroll: true });
    });
  }

  /* ---------- GSAP ---------- */
  var hasGsap = typeof window.gsap !== "undefined";
  var root = document.documentElement;

  if (!hasGsap || prefersReduced) {
    root.classList.add("no-anim");
    return;
  }
  root.classList.add("js-anim");

  var hasTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Set initial hidden states via JS only (no-JS stays visible) */
  gsap.set("[data-hero]", { opacity: 0, y: 34 });

  /* Word-mask hero intro: split h1 into masked words */
  var heroTitle = document.querySelector("[data-hero-words]");
  if (heroTitle) {
    (function splitWords(el) {
      var nodes = Array.prototype.slice.call(el.childNodes);
      el.innerHTML = "";
      nodes.forEach(function (node) {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              el.appendChild(document.createTextNode(" "));
            } else {
              var mask = document.createElement("span");
              mask.className = "w-mask";
              var inner = document.createElement("span");
              inner.textContent = part;
              mask.appendChild(inner);
              el.appendChild(mask);
            }
          });
        } else if (node.nodeType === 1) {
          // keep inline elements (e.g. .accent span) — split their text too
          var cls = node.className || "";
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              el.appendChild(document.createTextNode(" "));
            } else {
              var mask = document.createElement("span");
              mask.className = "w-mask";
              var inner = document.createElement("span");
              inner.textContent = part;
              if (cls) inner.className = cls;
              mask.appendChild(inner);
              el.appendChild(mask);
            }
          });
        }
      });
    })(heroTitle);

    gsap.timeline({ defaults: { ease: "power4.out" } })
      .to("[data-hero]", { opacity: 1, y: 0, duration: 1, stagger: 0.12, startAt: { y: 34 } }, 0.15)
      .fromTo(
        "#hero-title .w-mask > span",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.06, ease: "power4.out" },
        0.25
      );
  } else {
    gsap.to("[data-hero]", { opacity: 1, y: 0, duration: 1, stagger: 0.12, startAt: { y: 34 } });
  }

  /* Hero background parallax */
  if (hasTrigger) {
    gsap.to(".hero__photo", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    /* Scroll reveals */
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
      );
    });

    /* Card image settle zoom */
    gsap.utils.toArray(".card__media img").forEach(function (img) {
      gsap.fromTo(
        img,
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: img, start: "top 95%", end: "top 55%", scrub: true }
        }
      );
    });

    /* Storm band slow zoom */
    gsap.to(".storm__bg img", {
      scale: 1.12,
      ease: "none",
      scrollTrigger: { trigger: ".storm", start: "top bottom", end: "bottom top", scrub: true }
    });
  } else {
    gsap.to("[data-reveal]", { opacity: 1, duration: 0.6 });
  }
})();
