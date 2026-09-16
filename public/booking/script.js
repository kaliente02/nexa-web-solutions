// ============================================================================
// PocketBase Configuration
// ============================================================================

const POCKETBASE_URL = 'https://pocketbase-nexa-production.up.railway.app';
const pb = new PocketBase(POCKETBASE_URL);

// ============================================================================
// Data
// ============================================================================

const STEPS = ["Your details", "The project", "Timeline & budget", "Schedule", "Review"];

const WEBSITE_TYPES = [
  { id: "business", label: "Business Website", icon: "briefcase" },
  { id: "portfolio", label: "Portfolio Website", icon: "image" },
  { id: "ecommerce", label: "E-commerce Website", icon: "bag" },
  { id: "landing", label: "Landing Page", icon: "file" },
  { id: "blog", label: "Blog / News Website", icon: "news" },
  { id: "school", label: "School / Organization Website", icon: "school" },
  { id: "other", label: "Other", icon: "more" },
];

const PAGE_COUNTS = ["1–3 pages", "4–6 pages", "7–10 pages", "More than 10 pages", "Not sure yet"];

const FEATURES = [
  "Contact Form", "Online Booking", "Online Store", "Payment Integration",
  "User Login", "Admin Dashboard", "Database", "Gallery",
  "Blog", "Google Maps", "Social Media Integration", "Other",
];

const TIMELINES = [
  "As soon as possible", "Within 2 weeks", "Within 1 month",
  "Within 2–3 months", "Flexible / No specific deadline",
];

const BUDGETS = ["Under ₱10,000", "₱10,000–₱20,000", "₱20,000–₱50,000", "₱50,000+", "Not sure yet"];

const CONTACT_METHODS = [
  { id: "email", label: "Email", icon: "mail" },
  { id: "phone", label: "Phone Call", icon: "phone" },
  { id: "messenger", label: "Messenger", icon: "message" },
  { id: "whatsapp", label: "WhatsApp", icon: "message" },
];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const EMPTY_FORM = {
  fullName: "", businessName: "", email: "", phone: "", contactMethod: "",
  websiteType: "", pageCount: "", features: [], description: "",
  timeline: "", budget: "", date: "", time: "",
};

// ============================================================================
// State
// ============================================================================

const state = {
  view: "form", // form | confirmation | booking
  step: 0,
  form: { ...EMPTY_FORM, features: [] },
  touched: false,
  bookingId: "",
  booking: [],
  loading: true,
};

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function isStepValid(step, form) {
  switch (step) {
    case 0: return !!(form.fullName.trim() && form.email.trim() && form.phone.trim() && form.contactMethod);
    case 1: return !!(form.websiteType && form.pageCount);
    case 2: return !!form.timeline;
    case 3: return !!(form.date && form.time);
    default: return true;
  }
}

// ============================================================================
// PocketBase Functions
// ============================================================================

async function fetchBookingsFromDB() {
  try {
    const records = await pb.collection('bookings').getFullList({
      sort: '-created',
    });
    return records.map(r => ({
      id: r.id,
      business: r.businessName || r.fullName,
      type: WEBSITE_TYPES.find(t => t.id === r.websiteType)?.label || "—",
      bookedOn: formatDateShort(new Date(r.created)),
      consultDate: r.date ? formatDateShort(new Date(r.date + "T00:00:00")) : "—",
      status: r.status || "Pending",
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

async function submitBookingToDB(formData) {
  try {
    const record = await pb.collection('bookings').create({
      fullName: formData.fullName,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      contactMethod: formData.contactMethod,
      websiteType: formData.websiteType,
      pageCount: formData.pageCount,
      features: formData.features,
      description: formData.description,
      timeline: formData.timeline,
      budget: formData.budget,
      date: formData.date,
      time: formData.time,
      status: "Pending",
    });
    return record.id;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
}

// ============================================================================
// Icons (inline SVG, stroke = currentColor)
// ============================================================================

const ICONS = {
  briefcase: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  image: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>',
  bag: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  file: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/></svg>',
  news: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
  school: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4-8 4-8-4Z"/><path d="M6 10v6c0 1 2.5 3 6 3s6-2 6-3v-6"/><path d="M20 6v9"/></svg>',
  more: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10.1a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z"/></svg>',
  message: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  checkBig: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
};

function icon(name, extraClass) {
  return `<span class="icon ${extraClass || ""}">${ICONS[name] || ""}</span>`;
}

// ============================================================================
// Helpers
// ============================================================================

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function formatDateLong(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateShort(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusClass(status) {
  return "status-" + status.replace(/\s+/g, "-");
}

// ============================================================================
// Render: pieces
// ============================================================================

function renderProgressRail() {
  return `
    <div class="progress-rail">
      ${STEPS.map((label, i) => {
        const barClass = i < state.step ? "done" : i === state.step ? "active" : "";
        const labelClass = i < state.step ? "done" : i === state.step ? "active" : "";
        return `
          <div class="progress-item">
            <div class="progress-bar ${barClass}"></div>
            <span class="progress-label ${labelClass}">${esc(label)}</span>
          </div>`;
      }).join("")}
    </div>`;
}

function renderPill({ label, selected, dataAttr, iconName }) {
  return `
    <button type="button" class="pill ${selected ? "selected" : ""}" ${dataAttr}>
      ${iconName ? icon(iconName, "icon-type") : ""}
      <span>${esc(label)}</span>
      ${selected ? `<span class="check">${ICONS.check}</span>` : ""}
    </button>`;
}

function renderStepCustomer() {
  const f = state.form;
  return `
    <div class="card">
      <h2>Your details</h2>
      <p class="card-sub">So we know who we're building this for.</p>

      <div class="field-block field-grid">
        <div>
          <label class="field-label">Full name<span class="req">*</span></label>
          <input type="text" data-field="fullName" value="${esc(f.fullName)}" placeholder="Juan Dela Cruz" />
        </div>
        <div>
          <label class="field-label">Business / company name</label>
          <input type="text" data-field="businessName" value="${esc(f.businessName)}" placeholder="ABC Business" />
        </div>
        <div>
          <label class="field-label">Email address<span class="req">*</span></label>
          <input type="email" data-field="email" value="${esc(f.email)}" placeholder="you@email.com" />
        </div>
        <div>
          <label class="field-label">Phone number<span class="req">*</span></label>
          <input type="tel" data-field="phone" value="${esc(f.phone)}" placeholder="09XX XXX XXXX" />
        </div>
      </div>

      <div class="field-block">
        <label class="field-label">Preferred contact method<span class="req">*</span></label>
        <div class="pill-grid cols-4">
          ${CONTACT_METHODS.map(m => renderPill({
            label: m.label,
            selected: f.contactMethod === m.id,
            iconName: m.icon,
            dataAttr: `data-select="contactMethod" data-value="${m.id}"`,
          })).join("")}
        </div>
      </div>
    </div>`;
}

function renderStepProject() {
  const f = state.form;
  return `
    <div class="card">
      <h2>Tell us about your website</h2>
      <p class="card-sub">The more detail, the better we can scope it.</p>

      <div class="field-block">
        <label class="field-label">Website type<span class="req">*</span></label>
        <div class="pill-grid cols-3">
          ${WEBSITE_TYPES.map(t => renderPill({
            label: t.label,
            selected: f.websiteType === t.id,
            iconName: t.icon,
            dataAttr: `data-select="websiteType" data-value="${t.id}"`,
          })).join("")}
        </div>
      </div>

      <div class="field-block">
        <label class="field-label">Number of pages<span class="req">*</span></label>
        <div class="pill-grid cols-5">
          ${PAGE_COUNTS.map(p => renderPill({
            label: p,
            selected: f.pageCount === p,
            dataAttr: `data-select="pageCount" data-value="${esc(p)}"`,
          })).join("")}
        </div>
      </div>

      <div class="field-block">
        <label class="field-label">Desired features</label>
        <div class="pill-grid cols-3">
          ${FEATURES.map(feat => renderPill({
            label: feat,
            selected: f.features.includes(feat),
            dataAttr: `data-toggle-feature="${esc(feat)}"`,
          })).join("")}
        </div>
      </div>

      <div class="field-block">
        <label class="field-label">Project description</label>
        <textarea data-field="description" rows="5" placeholder="Tell us about your website idea, business, preferred design, features, or anything else we should know.">${esc(f.description)}</textarea>
      </div>
    </div>`;
}

function renderStepTimeline() {
  const f = state.form;
  return `
    <div class="card">
      <h2>Timeline &amp; budget</h2>
      <p class="card-sub">Helps us plan the right scope for your schedule.</p>

      <div class="field-block">
        <label class="field-label">When would you like your website completed?<span class="req">*</span></label>
        <div class="pill-grid">
          ${TIMELINES.map(t => renderPill({
            label: t,
            selected: f.timeline === t,
            dataAttr: `data-select="timeline" data-value="${esc(t)}"`,
          })).join("")}
        </div>
      </div>

      <div class="field-block">
        <label class="field-label">Budget range (optional)</label>
        <div class="pill-grid cols-5">
          ${BUDGETS.map(b => renderPill({
            label: b,
            selected: f.budget === b,
            dataAttr: `data-select="budget" data-value="${esc(b)}"`,
          })).join("")}
        </div>
      </div>
    </div>`;
}

function renderStepSchedule() {
  const f = state.form;
  return `
    <div class="card">
      <h2>Preferred consultation schedule</h2>
      <p class="card-sub">Pick a date and time that works for you — this isn't a payment or appointment booking, just your preference for when we discuss your project.</p>

      <div class="field-block field-grid">
        <div>
          <label class="field-label">Preferred consultation date<span class="req">*</span></label>
          <div class="date-field">
            ${ICONS.calendar}
            <input type="date" data-field="date" min="${todayIso()}" value="${esc(f.date)}" />
          </div>
        </div>
        <div>
          <label class="field-label">Preferred time<span class="req">*</span></label>
          <div class="time-grid">
            ${TIME_SLOTS.map(t => `
              <button type="button" class="time-slot ${f.time === t ? "selected" : ""}" data-select="time" data-value="${esc(t)}">${esc(t)}</button>
            `).join("")}
          </div>
        </div>
      </div>
    </div>`;
}

function summaryRow(label, value) {
  if (!value) return "";
  return `
    <div class="summary-row">
      <span class="s-label">${esc(label)}</span>
      <span class="s-value">${esc(value)}</span>
    </div>`;
}

function renderStepSummary() {
  const f = state.form;
  const typeLabel = WEBSITE_TYPES.find(t => t.id === f.websiteType)?.label || "—";
  const contactLabel = CONTACT_METHODS.find(c => c.id === f.contactMethod)?.label || "—";
  return `
    <div class="card">
      <h2>${icon("sparkles")} Your website project</h2>
      <p class="card-sub">Review the details below before you submit.</p>

      <div class="field-block">
        ${summaryRow("Customer", f.fullName)}
        ${summaryRow("Business", f.businessName || "—")}
        ${summaryRow("Email", f.email)}
        ${summaryRow("Phone", f.phone)}
        ${summaryRow("Preferred contact", contactLabel)}
        ${summaryRow("Website type", typeLabel)}
        ${summaryRow("Pages", f.pageCount)}
        ${summaryRow("Features", f.features.length ? f.features.join(", ") : "None selected")}
        ${summaryRow("Timeline", f.timeline)}
        ${summaryRow("Budget", f.budget || "Not specified")}
        ${summaryRow("Preferred date", formatDateLong(f.date))}
        ${summaryRow("Preferred time", f.time || "—")}
        ${summaryRow("Project description", f.description || "—")}
      </div>
    </div>`;
}

const STEP_RENDERERS = [renderStepCustomer, renderStepProject, renderStepTimeline, renderStepSchedule, renderStepSummary];

function renderFormView() {
  const valid = isStepValid(state.step, state.form);
  const isLast = state.step === STEPS.length - 1;

  return `
    <div class="hero">
      <h1>Book your website project</h1>
      <p>Tell us about your website project and we'll get in touch with you.</p>
    </div>

    ${renderProgressRail()}

    ${STEP_RENDERERS[state.step]()}

    ${state.touched && !valid ? `<p class="validation-msg">Please fill in the required fields before continuing.</p>` : ""}

    <div class="step-actions">
      <div>
        ${state.step > 0 ? `<button class="btn subtle" id="btn-back">${ICONS.arrowLeft} Back</button>` : ""}
      </div>
      ${isLast
        ? `<button class="btn" id="btn-submit">Book website development</button>`
        : `<button class="btn" id="btn-next">Continue ${ICONS.arrowRight}</button>`
      }
    </div>`;
}

function renderConfirmationView() {
  return `
    <div class="confirmation">
      <div class="check-badge">${ICONS.checkBig}</div>
      <h1>Booking submitted</h1>
      <p class="lead">Thank you for choosing us for your website project. Your request has been successfully submitted.</p>

      <div class="booking-id-box">
        <div class="bib-label">Booking ID</div>
        <div class="bib-value">${esc(state.bookingId)}</div>
      </div>

      <p class="followup">We'll review your project details and reach out using your preferred contact method.</p>

      <div class="actions">
        <button class="btn" id="btn-view-booking">View booking ${ICONS.arrowRight}</button>
        <button class="btn subtle" id="btn-back-home">Back to home</button>
      </div>
    </div>`;
}

function renderBookingsView() {
  if (state.loading) {
    return `
      <div class="bookings-header">
        <div>
          <h1>My website bookings</h1>
          <p>Loading your bookings...</p>
        </div>
      </div>`;
  }

  return `
    <div class="bookings-header">
      <div>
        <h1>My website bookings</h1>
        <p>Track the status of every project you've requested.</p>
      </div>
      <button class="back-link desktop" id="btn-back-desktop">${ICONS.arrowLeft} New booking</button>
    </div>

    <div class="booking-list">
      ${state.bookings.length === 0 ? `<p style="color: #a3a3a3;">No bookings yet.</p>` : state.bookings.map(b => `
        <div class="booking-card">
          <div class="booking-card-top">
            <div>
              <div class="bk-id">${esc(b.id)}</div>
              <div class="bk-business">${esc(b.business)}</div>
              <div class="bk-type">${esc(b.type)}</div>
            </div>
            <span class="status-badge ${statusClass(b.status)}">${esc(b.status)}</span>
          </div>
          <div class="booking-card-meta">
            <span>Booked ${esc(b.bookedOn)}</span>
            <span>Consultation ${esc(b.consultDate)}</span>
          </div>
        </div>
      `).join("")}
    </div>

    <button class="back-link mobile" id="btn-back-mobile">${ICONS.arrowLeft} New booking</button>`;
}

// ============================================================================
// Root render + event wiring
// ============================================================================

const app = document.getElementById("app");
const navBookingsBtn = document.getElementById("nav-bookings-btn");

function render() {
  navBookingsBtn.style.display = state.view === "bookings" ? "none" : "inline-block";

  if (state.view === "form") app.innerHTML = renderFormView();
  else if (state.view === "confirmation") app.innerHTML = renderConfirmationView();
  else if (state.view === "bookings") app.innerHTML = renderBookingsView();

  wireEvents();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function wireEvents() {
  // Text / textarea / date inputs
  app.querySelectorAll("[data-field]").forEach(el => {
    el.addEventListener("input", (e) => {
      state.form[el.dataset.field] = e.target.value;
    });
  });

  // Single-select pills / time slots
  app.querySelectorAll("[data-select]").forEach(el => {
    el.addEventListener("click", () => {
      state.form[el.dataset.select] = el.dataset.value;
      render();
    });
  });

  // Multi-select feature pills
  app.querySelectorAll("[data-toggle-feature]").forEach(el => {
    el.addEventListener("click", () => {
      const feat = el.dataset.toggleFeature;
      const idx = state.form.features.indexOf(feat);
      if (idx === -1) state.form.features.push(feat);
      else state.form.features.splice(idx, 1);
      render();
    });
  });

  // Step navigation
  const nextBtn = document.getElementById("btn-next");
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  const backBtn = document.getElementById("btn-back");
  if (backBtn) backBtn.addEventListener("click", goBack);

  const submitBtn = document.getElementById("btn-submit");
  if (submitBtn) submitBtn.addEventListener("click", submitBooking);

  // Confirmation actions
  const viewBookingBtn = document.getElementById("btn-view-booking");
  if (viewBookingBtn) viewBookingBtn.addEventListener("click", async () => { 
    state.view = "bookings";
    state.loading = true;
    render();
    state.bookings = await fetchBookingsFromDB();
    state.loading = false;
    render();
  });

  const backHomeBtn = document.getElementById("btn-back-home");
  if (backHomeBtn) backHomeBtn.addEventListener("click", resetForm);

  const backDesktop = document.getElementById("btn-back-desktop");
  if (backDesktop) backDesktop.addEventListener("click", resetForm);

  const backMobile = document.getElementById("btn-back-mobile");
  if (backMobile) backMobile.addEventListener("click", resetForm);
}

function goNext() {
  state.touched = true;
  if (!isStepValid(state.step, state.form)) { render(); return; }
  state.touched = false;
  state.step = Math.min(state.step + 1, STEPS.length - 1);
  render();
}

function goBack() {
  state.step = Math.max(state.step - 1, 0);
  render();
}

async function submitBooking() {
  try {
    const recordId = await submitBookingToDB(state.form);
    state.bookingId = recordId;
    state.view = "confirmation";
    render();
  } catch (error) {
    alert('Error submitting booking. Please try again.');
    console.error(error);
  }
}

function resetForm() {
  state.form = { ...EMPTY_FORM, features: [] };
  state.step = 0;
  state.touched = false;
  state.view = "form";
  render();
}

navBookingsBtn.addEventListener("click", async () => {
  state.view = "bookings";
  state.loading = true;
  render();
  state.bookings = await fetchBookingsFromDB();
  state.loading = false;
  render();
});

// ============================================================================
// Init
// ============================================================================

async function init() {
  // Fetch initial bookings
  state.bookings = await fetchBookingsFromDB();
  state.loading = false;
  render();
}

init();