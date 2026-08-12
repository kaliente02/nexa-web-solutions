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
// discovery-call booking form (and any future form) share one code path.
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
        statusEl.textContent = "✅ Sent! We'll follow up by email to confirm your discovery call.";
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
// Frontend-only prototype: generates the next 14 available weekdays and a
// fixed set of time slots. Not connected to a real calendar backend yet —
// see booking-disclaimer copy in the markup. Ready to be wired to
// Calendly / Google Calendar / Cal.com later.
function initBookingWidget() {
  const widget = document.getElementById("bookingWidget");
  if (!widget) return;

  const datesEl = document.getElementById("bookingDates");
  const timesEl = document.getElementById("bookingTimes");
  const panels = widget.querySelectorAll(".booking-panel");
  const steps = widget.querySelectorAll(".booking-step");
  const selectedDateLabel = document.getElementById("bookingSelectedDate");
  const summaryEl = document.getElementById("bookingSummary");
  const dateField = document.getElementById("bookingDateField");
  const timeField = document.getElementById("bookingTimeField");

  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const TIME_SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

  let selectedDate = null;
  let selectedTime = null;

  function goToPanel(n) {
    panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === String(n)));
    steps.forEach(s => s.classList.toggle("is-active", Number(s.dataset.step) <= n));
  }

  function buildDates() {
    const dates = [];
    let d = new Date();
    d.setDate(d.getDate() + 1);
    while (dates.length < 10) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) dates.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    datesEl.innerHTML = "";
    dates.forEach(date => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-date";
      btn.innerHTML = `
        <span class="booking-date-dow">${DOW[date.getDay()]}</span>
        <span class="booking-date-day">${date.getDate()}</span>
        <span class="booking-date-mon">${MON[date.getMonth()]}</span>
      `;
      btn.addEventListener("click", () => {
        datesEl.querySelectorAll(".booking-date").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedDate = date;
        const label = `${DOW[date.getDay()]}, ${MON[date.getMonth()]} ${date.getDate()}`;
        selectedDateLabel.textContent = `— ${label}`;
        buildTimes();
        goToPanel(2);
      });
      datesEl.appendChild(btn);
    });
  }

  function buildTimes() {
    timesEl.innerHTML = "";
    TIME_SLOTS.forEach(time => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-time";
      btn.textContent = time;
      btn.addEventListener("click", () => {
        timesEl.querySelectorAll(".booking-time").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedTime = time;

        const dateLabel = `${DOW[selectedDate.getDay()]}, ${MON[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
        summaryEl.textContent = `${dateLabel} at ${time}`;
        dateField.value = dateLabel;
        timeField.value = time;

        goToPanel(3);
      });
      timesEl.appendChild(btn);
    });
  }

  widget.querySelectorAll(".booking-back").forEach(btn => {
    btn.addEventListener("click", () => goToPanel(Number(btn.dataset.back)));
  });

  buildDates();
  goToPanel(1);
}

initBookingWidget();