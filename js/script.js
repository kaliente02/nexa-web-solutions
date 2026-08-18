// ════════════════════════════════════════════════════════════════
// NEXA BOOKING CONFIGURATION
// This is the ONLY place you need to edit to connect real booking.
//
// - googleBookingUrl: paste your Google Calendar Appointment Schedule
//   booking page URL (Google Calendar → Appointment schedule → Share →
//   "Booking page" link). Example:
//   "https://calendar.google.com/calendar/appointments/schedules/AcZssZ..."
// - web3formsAccessKey: paste your Web3Forms access key (from
//   https://web3forms.com) if you want the general inquiry form to work.
//
// Do NOT put Google OAuth client secrets, refresh tokens, access tokens,
// or your Google account password anywhere in this file.
// ════════════════════════════════════════════════════════════════
const BOOKING_CONFIG = {
  googleBookingUrl: "https://calendar.app.google/ceVQeNmEmkyxE4c8A",
  businessName: "NEXA",
  meetingDurationMinutes: 30
};
// googleBookingUrl is used BOTH as the inline embed source and as the
// "open in a new tab" fallback link — paste the same booking-page URL
// from Google Calendar → Appointment schedule → Share.

const FORM_CONFIG = {
  web3formsAccessKey: "ea1cbd7e-5161-49b4-981f-8093cba1c7a0"
};
// ════════════════════════════════════════════════════════════════

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
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
const isSmallScreen = window.matchMedia("(max-width: 900px)").matches;
// 3D pointer interactions (tilt, parallax) are only enabled on devices with a
// fine pointer, no reduced-motion preference, and enough screen real estate.
const enable3DInteractions = !prefersReducedMotion && !isCoarsePointer && !isSmallScreen;

// ── MOBILE MENU ──
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// ── NAVBAR SCROLL EFFECT (glass on scroll) ──
const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", throttle(() => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }, 50));
}

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
// Wires up the general-inquiry form. Note: a successful Web3Forms
// submission means the INQUIRY was sent — it is never described as a
// booked discovery call. Only the Google Calendar redirect flow
// (initBookingWidget below) leads to an actual appointment.
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
        statusEl.textContent = "✅ Request submitted. This is an inquiry, not a booked call — we'll follow up by email.";
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

// Apply the configured Web3Forms access key to the inquiry form, if set.
(function applyFormConfig() {
  const accessKeyInput = document.getElementById("web3formsAccessKey");
  if (
    accessKeyInput &&
    FORM_CONFIG.web3formsAccessKey &&
    !FORM_CONFIG.web3formsAccessKey.startsWith("REPLACE_WITH")
  ) {
    accessKeyInput.value = FORM_CONFIG.web3formsAccessKey;
  }
})();

wireWeb3Form(
  document.getElementById("contactForm"),
  document.getElementById("formStatus"),
  "Sending..."
);

// ── SCROLL PROGRESS BAR ──
const scrollProgress = document.getElementById("scrollProgress");

if (scrollProgress) {
  window.addEventListener("scroll", throttle(() => {
    const doc = document.documentElement;
    const scrollableHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollableHeight > 0 ? (doc.scrollTop / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = pct + "%";
  }, 30));
}

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

if (backToTop) {
  window.addEventListener("scroll", throttle(() => {
    backToTop.classList.toggle("visible", window.scrollY > 600);
  }, 100));

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

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

// ── LIVE TECH BACKGROUND (particle network in the hero) ──
const heroCanvas = document.getElementById("heroCanvas");

if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  let width, height, nodes = [];
  let rafId = null;
  let canvasVisible = true;

  const NODE_COLOR = "196, 113, 237";
  const LINK_DISTANCE = 140;

  function sizeCanvas() {
    const rect = heroCanvas.parentElement.getBoundingClientRect();
    width = heroCanvas.width = rect.width;
    height = heroCanvas.height = rect.height;
  }

  function nodeCount() {
    // Fewer particles on small screens for performance.
    const base = Math.floor((width * height) / 26000);
    const cap = isSmallScreen ? 30 : 60;
    return Math.max(14, Math.min(cap, base));
  }

  function buildNodes() {
    const count = nodeCount();
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1
    }));
  }

  function step() {
    if (!canvasVisible) { rafId = requestAnimationFrame(step); return; }
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

  // Pause the particle animation entirely when the hero scrolls offscreen.
  const canvasVisObserver = new IntersectionObserver(([entry]) => {
    canvasVisible = entry.isIntersecting;
  }, { threshold: 0 });
  canvasVisObserver.observe(heroCanvas);

  init();
  window.addEventListener("resize", throttle(init, 250));
}

// ── HERO 3D STAGE: mouse-responsive parallax on the floating dashboard ──
(function initHeroParallax() {
  const stage = document.getElementById("heroStage");
  const dashboard = document.getElementById("dashboardCard");
  const heroSection = document.getElementById("home");
  if (!stage || !dashboard || !heroSection || !enable3DInteractions) return;

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let raf = null;

  function onMove(e) {
    const rect = heroSection.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;   // 0..1
    const relY = (e.clientY - rect.top) / rect.height;   // 0..1
    // restrained rotation range
    targetY = (relX - 0.5) * 14;   // rotateY
    targetX = (0.5 - relY) * 10;   // rotateX
  }

  function onLeave() {
    targetX = 0;
    targetY = 0;
  }

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    dashboard.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
    raf = requestAnimationFrame(animate);
  }

  heroSection.addEventListener("mousemove", onMove);
  heroSection.addEventListener("mouseleave", onLeave);
  animate();
})();

// ── REUSABLE 3D TILT CARD SYSTEM ──
// Applies a subtle rotateX/rotateY tilt plus a cursor-tracking highlight to
// every element with the .tilt-card class (service cards, product cards,
// pricing cards, portfolio cards, etc). Disabled on touch devices, small
// screens, and when prefers-reduced-motion is set.
(function initTiltCards() {
  if (!enable3DInteractions) return;
  const cards = document.querySelectorAll(".tilt-card");
  const MAX_TILT = 6; // degrees — kept subtle per design direction

  cards.forEach(card => {
    let raf = null;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      const rotateY = (relX - 0.5) * MAX_TILT * 2;
      const rotateX = (0.5 - relY) * MAX_TILT * 2;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        card.style.setProperty("--mx", `${relX * 100}%`);
        card.style.setProperty("--my", `${relY * 100}%`);
      });
    });

    card.addEventListener("mouseleave", () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
})();

// ── BUSINESS SYSTEMS HUB DIAGRAM ──
// Draws SVG connector lines from the central NEXA core to each floating
// module, and highlights the line + shows a description on hover/focus.
(function initSystemsHub() {
  const hub = document.getElementById("systemsHub");
  const lineGroup = document.getElementById("hubLineGroup");
  const tooltip = document.getElementById("hubTooltip");
  if (!hub || !lineGroup) return;

  const modules = Array.from(hub.querySelectorAll(".hub-module"));

  function drawLines() {
    lineGroup.innerHTML = "";
    const hubRect = hub.getBoundingClientRect();
    const cx = hubRect.width / 2;
    const cy = hubRect.height / 2;
    // scale coordinates into the 0-600 viewBox space
    const scale = 600 / hubRect.width;

    modules.forEach((mod, i) => {
      const modRect = mod.getBoundingClientRect();
      const mx = (modRect.left - hubRect.left + modRect.width / 2) * scale;
      const my = (modRect.top - hubRect.top + modRect.height / 2) * scale;
      const cxs = cx * scale;
      const cys = cy * scale;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const midX = (cxs + mx) / 2;
      const midY = (cys + my) / 2;
      path.setAttribute("d", `M${cxs},${cys} Q${midX},${midY} ${mx},${my}`);
      path.setAttribute("class", "hub-line");
      path.dataset.index = i;
      lineGroup.appendChild(path);
    });
  }

  function highlight(index, desc) {
    lineGroup.querySelectorAll(".hub-line").forEach(line => {
      line.classList.toggle("active", Number(line.dataset.index) === index);
    });
    if (tooltip) tooltip.textContent = desc || "";
  }

  function clearHighlight() {
    lineGroup.querySelectorAll(".hub-line").forEach(line => line.classList.remove("active"));
    if (tooltip) tooltip.textContent = "";
  }

  modules.forEach((mod, i) => {
    mod.setAttribute("tabindex", "0");
    mod.addEventListener("mouseenter", () => highlight(i, mod.dataset.desc));
    mod.addEventListener("focus", () => highlight(i, mod.dataset.desc));
    mod.addEventListener("mouseleave", clearHighlight);
    mod.addEventListener("blur", clearHighlight);
  });

  // Draw once layout has settled, and redraw on resize.
  window.addEventListener("load", drawLines);
  setTimeout(drawLines, 300);
  window.addEventListener("resize", throttle(drawLines, 200));
})();

// ── DISCOVERY CALL BOOKING WIDGET ──
// CHANGED: this used to generate 10 fake weekday dates and a hard-coded
// TIME_SLOTS array, then faked a "confirmed" booking through Web3Forms.
// That logic (buildDates, buildTimes, TIME_SLOTS, the 3-panel date/time/
// details flow, and the hidden requested_date / requested_time fields) has
// been removed entirely. The widget now embeds NEXA's real Google Calendar
// Appointment Schedule inline (real dates/times pulled live by Google),
// with a same-URL "open in a new tab" link kept as a fallback for browsers
// that block the embedded iframe (e.g. strict third-party cookie blocking
// in Safari or Brave). No time is ever shown as "available" unless Google
// Calendar itself confirms it — nothing here is generated or guessed.
function initBookingWidget() {
  const embedWrap = document.getElementById("bookingEmbed");
  const embedFrame = document.getElementById("bookingEmbedFrame");
  const ctaBtn = document.getElementById("bookingCtaBtn");
  const helpEl = document.getElementById("bookingCtaHelp");
  if (!ctaBtn || !helpEl) return;

  function isConfigured(url) {
    return typeof url === "string" && url.trim().length > 0 && !url.startsWith("REPLACE_WITH");
  }

  const url = BOOKING_CONFIG.googleBookingUrl;
  const configured = isConfigured(url);

  if (!configured) {
    console.warn("NEXA booking URL is not configured.");
    helpEl.textContent = "Booking is temporarily unavailable. Please contact NEXA directly.";
    helpEl.className = "booking-cta-help error";
  } else {
    // Load the real appointment schedule inline.
    if (embedWrap && embedFrame) {
      embedFrame.src = url;
      embedWrap.hidden = false;
    }
    helpEl.textContent = "Having trouble with the calendar above? Use the button to open the same booking page in a new tab.";
    helpEl.className = "booking-cta-help";
  }

  ctaBtn.addEventListener("click", () => {
    if (!isConfigured(BOOKING_CONFIG.googleBookingUrl)) {
      console.warn("NEXA booking URL is not configured.");
      helpEl.textContent = "Booking is temporarily unavailable. Please contact NEXA directly.";
      helpEl.className = "booking-cta-help error";
      return;
    }
    window.open(BOOKING_CONFIG.googleBookingUrl, "_blank", "noopener,noreferrer");
  });
}

initBookingWidget();