/**
 * ═══════════════════════════════════════════════════════════════
 * CUSTOMIZE: Quick config (optional — you can also edit index.html)
 * ═══════════════════════════════════════════════════════════════
 */
const SITE_CONFIG = {
  /** Path to your audio file (same folder as index.html by default) */
  musicSrc: "music.mp3",
};

(function init() {
  "use strict";

  setupRevealOnScroll();
  setupSmoothScroll();
  setupAskButtons();
  setupModal();
  setupMusic();
  setupFloatingHearts();
  setupParticles();
  setupParallax();
  setupPhotoSection();
})();

function setupRevealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.35)}s`;
    observer.observe(el);
  });

  const heroContent = document.querySelector(".hero .reveal");
  if (heroContent) {
    requestAnimationFrame(() => heroContent.classList.add("is-visible"));
  }
}

function setupSmoothScroll() {
  const link = document.getElementById("scrollToLetter");
  const target = document.getElementById("letter");
  if (!link || !target) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setupAskButtons() {
  const btnYes = document.getElementById("btnYes");
  const btnNotYet = document.getElementById("btnNotYet");
  const response = document.getElementById("askResponse");
  const modal = document.getElementById("modal");

  if (!btnYes || !btnNotYet || !response) return;

  btnYes.addEventListener("click", () => {
    response.hidden = true;
    openModal(modal);
  });

  btnNotYet.addEventListener("click", () => {
    response.hidden = false;
    response.classList.add("is-gentle");
    response.innerHTML =
      "That's okay.<br />Take all the time you need.<br />I'll understand. \u{1F499}";
    response.setAttribute("aria-live", "polite");
  });
}

function setupModal() {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("modalClose");
  if (!modal) return;

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  const container = modal.querySelector(".modal__hearts");
  if (container) {
    container.innerHTML = "";
    spawnModalHearts(container, 8);
  }

  if (typeof gsap !== "undefined") {
    const panel = modal.querySelector(".modal__panel");
    gsap.fromTo(panel, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" });
  }
}

function spawnModalHearts(container, count) {
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "modal-heart";
    span.textContent = "♡";
    span.style.left = `${15 + Math.random() * 70}%`;
    span.style.bottom = `${20 + Math.random() * 30}%`;
    span.style.animationDelay = `${i * 0.15}s`;
    container.appendChild(span);
  }
}

function setupMusic() {
  const toggle = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  if (!toggle || !audio) return;

  const source = audio.querySelector("source");
  if (source && SITE_CONFIG.musicSrc) {
    source.src = SITE_CONFIG.musicSrc;
    audio.load();
  }

  let musicAvailable = true;

  audio.addEventListener("error", () => {
    musicAvailable = false;
    toggle.classList.add("is-unavailable");
    toggle.setAttribute("title", "Add music.mp3 to enable music");
  });

  toggle.addEventListener("click", async () => {
    if (!musicAvailable) return;

    try {
      if (audio.paused) {
        await audio.play();
        toggle.classList.add("is-playing");
      } else {
        audio.pause();
        toggle.classList.remove("is-playing");
      }
    } catch {
      /* Autoplay policies or missing file — no console noise */
    }
  });

  audio.addEventListener("ended", () => toggle.classList.remove("is-playing"));
}

function setupFloatingHearts() {
  const container = document.getElementById("floatingHearts");
  if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const heartSvg =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.5-8-11a5 5 0 019-3 5 5 0 019 3c0 5.5-8 11-8 11z"/></svg>';
  const count = window.innerWidth < 640 ? 6 : 10;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "floating-heart";
    el.innerHTML = heartSvg;
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${18 + Math.random() * 14}s`;
    el.style.animationDelay = `${Math.random() * -20}s`;
    container.appendChild(el);
  }
}

function setupParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let particles = [];
  let rafId = 0;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const n = Math.min(40, Math.floor((w * h) / 28000));
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: 0.15 + Math.random() * 0.25,
    }));
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const blue = i % 3 === 0;
      ctx.fillStyle = blue
        ? `rgba(158, 197, 232, ${p.a})`
        : `rgba(232, 164, 184, ${p.a})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(tick);
  };

  resize();
  tick();
  window.addEventListener("resize", resize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      tick();
    }
  });
}

function setupParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const glow = document.querySelector(".hero__glow");
  if (!glow) return;

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        glow.style.transform = `translate(-50%, calc(-50% + ${y * 0.06}px))`;
        ticking = false;
      });
    },
    { passive: true }
  );
}

function setupPhotoSection() {
  const section = document.getElementById("photos");
  if (!section) return;

  const enabled = section.getAttribute("data-enabled") === "true";
  if (!enabled) return;

  section.removeAttribute("aria-hidden");
  const images = section.querySelectorAll(".photo-card img");
  images.forEach((img) => {
    if (!img.getAttribute("src")) {
      img.removeAttribute("src");
    }
  });
}
