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

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(0,0,0,0.85)";
  } else {
    navbar.style.background = "rgba(0,0,0,0.3)";
  }
});


// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
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
});


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
    formStatus.textContent = "❌ Something went wrong. Please try again or message us on WhatsApp.";
    formStatus.className = "form-status error";
  }

  // Reset button
  submitBtn.textContent = "Send Message";
  submitBtn.disabled = false;
});