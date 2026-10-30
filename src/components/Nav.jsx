import { Suspense, lazy, useEffect, useState } from "react";
import WalletPlaceholder from "./WalletPlaceholder.jsx";

const WalletButton = lazy(() => import("./WalletButton.jsx"));

const LINKS = [
  ["#services", "Services"],
  ["#projects", "Projects"],
  ["#products", "Products"],
  ["#process", "Process"],
  ["#team", "Team"],
  ["#pricing", "Pricing"],
  ["#faq", "FAQ"]
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // The wallet UI is client-only: prerender and hydrate with the placeholder,
  // then load the Solana SDK.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    setMounted(true);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="container nav-inner">
        <a href="#home" className="brand" aria-label="NECXSOFT home">
          <img src="/images/team/logo.png" alt="" width="34" height="34" />
          NECXSOFT
        </a>

        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks" aria-label="Main navigation">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>

        <div className="nav-cta">
          {mounted ? (
            <Suspense fallback={<WalletPlaceholder />}>
              <WalletButton />
            </Suspense>
          ) : (
            <WalletPlaceholder />
          )}
          <a href="#contact" className="btn btn-primary btn-sm">Book a call</a>
          <button
            className="menu-btn"
            id="menuBtn"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((value) => !value)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
