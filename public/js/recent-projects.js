// ================================================================
// NECXSOFT PRODUCTS — PORTFOLIO BEHAVIOR
// ================================================================

(async function initNecxsoftProducts() {

  // --------------------------------------------------------------
  // STEP 1: OPTIONAL PRODUCT SECTION INJECTION
  // --------------------------------------------------------------

  const mount = document.getElementById("portfolio-mount");

  if (mount && !document.getElementById("portfolio")) {
    try {
      const response = await fetch("/html/recent-projects.html");

      if (!response.ok) {
        console.error(
          "NECXSOFT Products: failed to load product section.",
          response.status
        );
        return;
      }

      const html = await response.text();
      mount.outerHTML = html;

    } catch (error) {
      console.error(
        "NECXSOFT Products: error loading product section.",
        error
      );
      return;
    }
  }


  // --------------------------------------------------------------
  // GET PRODUCT SECTION
  // --------------------------------------------------------------

  const portfolioSection = document.getElementById("portfolio");

  if (!portfolioSection) {
    return;
  }


  // --------------------------------------------------------------
  // MOTION / DEVICE DETECTION
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
  // SCROLL REVEAL
  // --------------------------------------------------------------

  const revealElements =
    portfolioSection.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
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

  } else {

    // Fallback for browsers without IntersectionObserver
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  // --------------------------------------------------------------
  // 3D PRODUCT CARD TILT
  // --------------------------------------------------------------

  if (enable3DInteractions) {

    const cards =
      portfolioSection.querySelectorAll(".tilt-card");

    const MAX_TILT = 6;

    cards.forEach((card) => {

      let raf = null;

      card.addEventListener("mousemove", (event) => {

        const rect = card.getBoundingClientRect();

        const relX =
          (event.clientX - rect.left) / rect.width;

        const relY =
          (event.clientY - rect.top) / rect.height;

        const rotateY =
          (relX - 0.5) * MAX_TILT * 2;

        const rotateX =
          (0.5 - relY) * MAX_TILT * 2;


        if (raf) {
          cancelAnimationFrame(raf);
        }


        raf = requestAnimationFrame(() => {

          card.style.transform =
            `perspective(900px) ` +
            `rotateX(${rotateX.toFixed(2)}deg) ` +
            `rotateY(${rotateY.toFixed(2)}deg) ` +
            `translateY(-6px)`;

          card.style.setProperty(
            "--mx",
            `${relX * 100}%`
          );

          card.style.setProperty(
            "--my",
            `${relY * 100}%`
          );

        });

      });


      card.addEventListener("mouseleave", () => {

        if (raf) {
          cancelAnimationFrame(raf);
        }

        card.style.transform =
          "perspective(900px) " +
          "rotateX(0deg) " +
          "rotateY(0deg) " +
          "translateY(0)";

      });

    });

  }


  // --------------------------------------------------------------
  // INITIALIZED
  // --------------------------------------------------------------

  console.log(
    "NECXSOFT Products section initialized."
  );

})();