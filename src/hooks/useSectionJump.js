import { useEffect } from "react";

const FADE_MS = 220;

// In-page #links fade the page out, jump straight to the target, and fade
// back in, instead of smooth-scrolling past every section in between.
export function useSectionJump() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;

    const jumpTo = (target, hash) => {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: "instant" });
      history.pushState(null, "", hash);
    };

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest('a[href^="#"]');
      if (!link || link.classList.contains("skip-link")) return;

      const hash = link.getAttribute("href");
      const target = hash.length > 1 && document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();

      if (reduceMotion.matches) {
        jumpTo(target, hash);
        return;
      }

      clearTimeout(timer);
      root.classList.add("section-jump");
      timer = setTimeout(() => {
        jumpTo(target, hash);
        // Let the browser paint the new position before fading back in.
        requestAnimationFrame(() => root.classList.remove("section-jump"));
      }, FADE_MS);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(timer);
      root.classList.remove("section-jump");
    };
  }, []);
}
