// ── UTIL: THROTTLE ──
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── MOBILE MENU ──
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// ── NAVBAR SCROLL EFFECT ──
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", throttle(() => {
  navbar.style.background = window.scrollY > 50 ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)";
}, 50));

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", throttle(() => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
}, 100));

// ── SCROLL REVEAL ANIMATIONS ──
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

// ── GENERIC WEB3FORMS SUBMIT HANDLER ──
// Wires up any form on the page that posts to Web3Forms, so the
// main contact form and the free-audit form share one code path.
function wireWeb3Form(formEl, statusEl, sendingLabel = "Sending...") {
  if (!formEl || !statusEl) return;
  const submitBtn = formEl.querySelector('button[type="submit"]');

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const originalLabel = submitBtn ? submitBtn.textContent : "";

    if (submitBtn) {
      submitBtn.textContent = sendingLabel;
      submitBtn.disabled = true;
    }
    statusEl.textContent = "";
    statusEl.className = "form-status";

    const formData = new FormData(formEl);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        statusEl.textContent = "✅ Sent! We'll get back to you soon.";
        statusEl.className = "form-status success";
        formEl.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      statusEl.textContent = "❌ Something went wrong. Please try again.";
      statusEl.className = "form-status error";
    }

    if (submitBtn) {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }
  });
}

wireWeb3Form(
  document.getElementById("contactForm"),
  document.getElementById("formStatus"),
  "Sending..."
);

wireWeb3Form(
  document.getElementById("auditForm"),
  document.getElementById("auditStatus"),
  "Sending..."
);

// ── SCROLL PROGRESS BAR ──
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", throttle(() => {
  const doc = document.documentElement;
  const scrollableHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollableHeight > 0 ? (doc.scrollTop / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = pct + "%";
}, 30));

// ── ANIMATED STAT COUNTERS ──
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.ceil(progress * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ── FAQ ACCORDION ──
document.querySelectorAll(".faq-item").forEach(item => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach(otherItem => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".faq-answer").style.maxHeight = null;
      otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
      question.setAttribute("aria-expanded", "true");
    }
  });
});

// ── BACK TO TOP BUTTON ──
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", throttle(() => {
  backToTop.classList.toggle("visible", window.scrollY > 600);
}, 100));

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── STICKY CTA ──
const stickyCta = document.getElementById("stickyCta");
const heroEl = document.querySelector(".hero");

if (stickyCta && heroEl) {
  const stickyObserver = new IntersectionObserver(([entry]) => {
    stickyCta.classList.toggle("visible", !entry.isIntersecting);
  }, { threshold: 0 });
  stickyObserver.observe(heroEl);
}

// ── HERO HEADLINE WORD ROTATOR ──
const rotator = document.getElementById("heroRotator");

if (rotator && !prefersReducedMotion) {
  const words = rotator.querySelectorAll(".rotator-word");
  let activeIndex = 0;

  setInterval(() => {
    const current = words[activeIndex];
    const nextIndex = (activeIndex + 1) % words.length;
    const next = words[nextIndex];

    current.classList.add("is-leaving");
    current.classList.remove("is-active");
    next.classList.add("is-active");

    setTimeout(() => { current.classList.remove("is-leaving"); }, 500);
    activeIndex = nextIndex;
  }, 2200);
}

// ── REALISTIC CHART DRAW-IN ──
const chartLine = document.getElementById("chartLine");
const dashboardCard = document.getElementById("dashboardCard");

if (chartLine) {
  const areaPath = document.querySelector(".chart-area");
  const length = chartLine.getTotalLength();

  chartLine.style.strokeDasharray = length;
  chartLine.style.strokeDashoffset = prefersReducedMotion ? 0 : length;

  const drawChart = () => {
    chartLine.style.transition = "stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)";
    chartLine.style.strokeDashoffset = 0;
    if (areaPath) areaPath.classList.add("drawn");
  };

  if (prefersReducedMotion) {
    if (areaPath) areaPath.classList.add("drawn");
  } else if (dashboardCard) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          drawChart();
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    chartObserver.observe(dashboardCard);
    setTimeout(() => {
      const rect = dashboardCard.getBoundingClientRect();
      if (rect.top < window.innerHeight) drawChart();
    }, 300);
  }
}

// ── TESTIMONIALS CAROUSEL ──
// Vanilla carousel: autoplay, arrows, dots, swipe/drag, keyboard, and
// pause-on-hover/focus. No external carousel library needed for one slider.
function initTestimonialCarousel() {
  const root = document.getElementById("testiCarousel");
  if (!root) return;

  const viewport = document.getElementById("testiViewport");
  const track = document.getElementById("testiTrack");
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("testiPrev");
  const nextBtn = document.getElementById("testiNext");
  const dotsWrap = document.getElementById("testiDots");

  if (slides.length === 0) return;

  let index = 0;
  let autoplayId = null;
  const AUTOPLAY_MS = 6000;

  // Build pagination dots
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "testi-dot";
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function goTo(i, userInitiated) {
    index = (i + slides.length) % slides.length;
    render();
    if (userInitiated) restartAutoplay();
  }

  function next(userInitiated) { goTo(index + 1, userInitiated); }
  function prev(userInitiated) { goTo(index - 1, userInitiated); }

  function startAutoplay() {
    if (prefersReducedMotion || slides.length < 2) return;
    stopAutoplay();
    autoplayId = setInterval(() => next(false), AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  prevBtn.addEventListener("click", () => prev(true));
  nextBtn.addEventListener("click", () => next(true));

  // Pause on hover / keyboard focus, resume on leave / blur
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);

  // Keyboard navigation (left/right arrows while carousel has focus)
  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(true); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(true); }
  });

  // Touch / pointer swipe
  let dragging = false;
  let startX = 0;
  let deltaX = 0;
  const SWIPE_THRESHOLD = 40;

  function onDragStart(x) {
    dragging = true;
    startX = x;
    deltaX = 0;
    root.classList.add("is-dragging");
    stopAutoplay();
    track.style.transition = "none";
  }

  function onDragMove(x) {
    if (!dragging) return;
    deltaX = x - startX;
    const percent = (deltaX / viewport.clientWidth) * 100;
    track.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
  }

  function onDragEnd() {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-dragging");
    track.style.transition = "";

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) next(true); else prev(true);
    } else {
      render();
    }
    startAutoplay();
  }

  viewport.addEventListener("touchstart", (e) => onDragStart(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchmove", (e) => onDragMove(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchend", onDragEnd);

  viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return; // handled by touch events above
    onDragStart(e.clientX);
  });
  window.addEventListener("pointermove", (e) => onDragMove(e.clientX));
  window.addEventListener("pointerup", onDragEnd);

  render();
  startAutoplay();
}

initTestimonialCarousel();

// ── LIVE TECH BACKGROUND (particle network in the hero) ──
const heroCanvas = document.getElementById("heroCanvas");

if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  let width, height, nodes = [];
  let rafId = null;

  const NODE_COLOR = "196, 113, 237";
  const LINK_DISTANCE = 140;

  function sizeCanvas() {
    const rect = heroCanvas.parentElement.getBoundingClientRect();
    width = heroCanvas.width = rect.width;
    height = heroCanvas.height = rect.height;
  }

  function buildNodes() {
    const count = Math.max(18, Math.min(60, Math.floor((width * height) / 26000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${NODE_COLOR}, 0.8)`;
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINK_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${NODE_COLOR}, ${0.22 * (1 - dist / LINK_DISTANCE)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function init() {
    sizeCanvas();
    buildNodes();
    if (rafId) cancelAnimationFrame(rafId);

    if (prefersReducedMotion) {
      step();
      cancelAnimationFrame(rafId);
    } else {
      step();
    }
  }

  init();
  window.addEventListener("resize", throttle(init, 250));
}