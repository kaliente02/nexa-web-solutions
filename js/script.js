// ── UTIL: THROTTLE ──
// Prevents scroll handlers from firing on every single frame.
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

// Close menu when a nav link is clicked
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});


// ── NAVBAR SCROLL EFFECT ──
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", throttle(() => {
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(0,0,0,0.85)";
  } else {
    navbar.style.background = "rgba(0,0,0,0.3)";
  }
}, 50));


// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", throttle(() => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
}, 100));


// ── SCROLL REVEAL ANIMATIONS ──
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));


// ── CONTACT FORM (Web3Forms) ──
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const originalLabel = submitBtn.textContent;

  // Button loading state
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;
  formStatus.textContent = "";
  formStatus.className = "form-status";

  const formData = new FormData(contactForm);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      formStatus.textContent = "✅ Message sent! We'll get back to you soon.";
      formStatus.className = "form-status success";
      contactForm.reset();
    } else {
      throw new Error("Submission failed");
    }

  } catch (error) {
    formStatus.textContent = "❌ Something went wrong. Please try again.";
    formStatus.className = "form-status error";
  }

  // Reset button
  submitBtn.textContent = originalLabel;
  submitBtn.disabled = false;
});


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
    const duration = 1200; // ms
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

    // close all items first
    document.querySelectorAll(".faq-item").forEach(otherItem => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".faq-answer").style.maxHeight = null;
      otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    // reopen this one if it wasn't already open
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


// ── STICKY CTA (appears once hero is scrolled past) ──
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

    setTimeout(() => {
      current.classList.remove("is-leaving");
    }, 500);

    activeIndex = nextIndex;
  }, 2200);
}


// ── REALISTIC CHART DRAW-IN ──
// Animates the SVG line path like a real analytics chart, once the
// dashboard card scrolls into view (it also just sits above the fold).
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
    // In case the card is already in view on load (typical, it's in the hero).
    setTimeout(() => {
      const rect = dashboardCard.getBoundingClientRect();
      if (rect.top < window.innerHeight) drawChart();
    }, 300);
  }
}


// ── LIVE TECH BACKGROUND (particle network in the hero) ──
const heroCanvas = document.getElementById("heroCanvas");

if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  let width, height, nodes = [];
  let rafId = null;

  const NODE_COLOR = "196, 113, 237";   // #c471ed
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

    // move + draw nodes
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

    // draw links between nearby nodes
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
      // Draw a single static frame instead of a running animation.
      step();
      cancelAnimationFrame(rafId);
    } else {
      step();
    }
  }

  init();

  window.addEventListener("resize", throttle(init, 250));
}