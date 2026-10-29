// ================================================================
// NECXSOFT WEBSITE CONFIGURATION
// ================================================================
// Central configuration for branding and forms.
//
// Do NOT put Google OAuth client secrets, refresh tokens,
// access tokens, or your Google account password here.
// ================================================================

const BRAND_CONFIG = {
  name: "NECXSOFT",
  logo: "/images/team/logo.png",
  email: "support@necxsoft.com"
};

const FORM_CONFIG = {
  web3formsAccessKey: "ea1cbd7e-5161-49b4-981f-8093cba1c7a0"
};

document.documentElement.classList.remove("no-js");

function isConfigured(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !value.startsWith("REPLACE_WITH")
  );
}


// ================================================================
// NAVBAR — scrolled state + mobile menu
// ================================================================

(function initNav() {
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const links = document.getElementById("navLinks");

  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!menuBtn || !links) return;

  const setOpen = (open) => {
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  };

  menuBtn.addEventListener("click", () => {
    setOpen(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
})();


// ================================================================
// SCROLL REVEAL
// ================================================================

(function initReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => {
    // Anything already on screen (e.g. after a #hash jump) shows at once.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("in");
    } else {
      observer.observe(el);
    }
  });
})();


// ================================================================
// CARD SPOTLIGHT — follows the pointer across .card elements
// ================================================================

(function initSpotlight() {
  if (!window.matchMedia("(hover: hover)").matches) return;

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
})();


// ================================================================
// CONTACT FORM — Web3Forms
// ================================================================

(function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const keyInput = document.getElementById("web3formsAccessKey");

  if (!form || !status) return;

  if (keyInput && isConfigured(FORM_CONFIG.web3formsAccessKey)) {
    keyInput.value = FORM_CONFIG.web3formsAccessKey;
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const originalLabel = submitBtn ? submitBtn.innerHTML : "";

    if (submitBtn) {
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;
    }

    status.textContent = "";
    status.className = "form-status";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form)
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.message || "Submission failed");

      status.textContent =
        "Message sent. This is an inquiry, not a booked call. We'll follow up by email.";
      status.className = "form-status success";
      form.reset();
      if (keyInput) keyInput.value = FORM_CONFIG.web3formsAccessKey;
    } catch (error) {
      console.error("Web3Forms error:", error);
      status.textContent = `Something went wrong. Please try again or email ${BRAND_CONFIG.email}.`;
      status.className = "form-status error";
    }

    if (submitBtn) {
      submitBtn.innerHTML = originalLabel;
      submitBtn.disabled = false;
    }
  });
})();


// ================================================================
// FOOTER YEAR
// ================================================================

(function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
