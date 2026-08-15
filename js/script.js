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
  googleBookingUrl: "https://calendar.app.google/RsQoUfKpXhaqsQg7A",
  businessName: "NEXA",
  meetingDurationMinutes: 30
};
// googleBookingUrl is used BOTH as the inline embed source and as the
// "open in a new tab" fallback link — paste the same booking-page URL
// from Google Calendar → Appointment schedule → Share.

const FORM_CONFIG = {
  web3formsAccessKey: "3b225d2b-4f68-4bd6-82c0-433ffc5f1177"
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

window.addEventListener("scroll", throttle(() => {
  const doc = document.documentElement;
  const scrollableHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollableHeight > 0 ? (doc.scrollTop / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = pct + "%";
}, 30));

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