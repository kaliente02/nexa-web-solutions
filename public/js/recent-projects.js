// ================================================================
// RECENT PROJECTS / PORTFOLIO SECTION — BEHAVIOR
// ================================================================
// Extracted from script.js.
//
// This file is self-contained and only touches elements inside
// #portfolio, so it can be dropped into any page independently
// of the rest of the site's script.js.
//
// It does two things:
//   1. (Optional) If it finds an empty <div id="portfolio-mount">,
//      it fetches recent-projects.html and injects it there.
//      If the portfolio section is already in the page (pasted
//      directly), this step is skipped automatically.
//   2. Wires up the scroll-reveal animation and the 3D tilt-card
//      effect for everything inside #portfolio.
//
// NOTE: If this page ALSO loads the site's main script.js (which
// already runs generic `.reveal` / `.tilt-card` handlers on the
// whole page), you don't need this file at all — script.js will
// already cover the portfolio section. Use recent-projects.js only
// when the portfolio section lives on its own, without script.js.
// ================================================================

(async function initRecentProjects() {

  // --------------------------------------------------------------
  // STEP 1: Optionally inject the markup from recent-projects.html
  // --------------------------------------------------------------

  const mount = document.getElementById("portfolio-mount");

  if (mount && !document.getElementById("portfolio")) {
    try {
      const response = await fetch("recent-projects.html");

      if (response.ok) {
        const html = await response.text();
        mount.outerHTML = html;
      } else {
        console.error(
          "recent-projects.js: failed to load recent-projects.html",
          response.status
        );
      }
    } catch (error) {
      console.error(
        "recent-projects.js: error fetching recent-projects.html",
        error
      );
    }
  }

  const portfolioSection = document.getElementById("portfolio");

  if (!portfolioSection) {
    // Nothing to wire up — section isn't on this page.
    return;
  }


  // --------------------------------------------------------------
  // DEVICE / MOTION DETECTION
  // --------------------------------------------------------------

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isCoarsePointer =
    window.matchMedia("(pointer: coarse)").matches;

  const isSmallScreen =
    window.matchMedia("(max-width: 900px)").matches;

  const enable3DInteractions =
    !prefersReducedMotion &&
    !isCoarsePointer &&
    !isSmallScreen;


  // --------------------------------------------------------------
  // STEP 2a: Scroll reveal (scoped to #portfolio)
  // --------------------------------------------------------------

  const revealElements =
    portfolioSection.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  // --------------------------------------------------------------
  // STEP 2b: 3D tilt cards (scoped to #portfolio)
  // --------------------------------------------------------------

  if (enable3DInteractions) {
    const cards =
      portfolioSection.querySelectorAll(".tilt-card");

    const MAX_TILT = 6;

    cards.forEach((card) => {
      let raf = null;

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;

        const rotateY = (relX - 0.5) * MAX_TILT * 2;
        const rotateX = (0.5 - relY) * MAX_TILT * 2;

        if (raf) {
          cancelAnimationFrame(raf);
        }

        raf = requestAnimationFrame(() => {
          card.style.transform =
            `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;

          card.style.setProperty("--mx", `${relX * 100}%`);
          card.style.setProperty("--my", `${relY * 100}%`);
        });
      });

      card.addEventListener("mouseleave", () => {
        if (raf) {
          cancelAnimationFrame(raf);
        }

        card.style.transform =
          "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }


  console.log("NECXSOFT Recent Projects section initialized.");

})();