const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export default function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="i-arrow" {...common} strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
        <symbol id="i-check" {...common} strokeWidth="2"><path d="M20 6 9 17l-5-5" /></symbol>
        <symbol id="i-code" {...common} strokeWidth="1.6"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></symbol>
        <symbol id="i-wallet" {...common} strokeWidth="1.6"><path d="M20 7H5a2 2 0 0 1 0-4h13v4" /><path d="M3 5v14a2 2 0 0 0 2 2h15V7" /><path d="M16 14h.01" /></symbol>
        <symbol id="i-coins" {...common} strokeWidth="1.6"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82" /></symbol>
        <symbol id="i-swap" {...common} strokeWidth="1.6"><path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" /></symbol>
        <symbol id="i-bot" {...common} strokeWidth="1.6"><rect x="3" y="8" width="18" height="12" rx="3" /><path d="M12 8V4M8 4h8M9 13v2M15 13v2" /></symbol>
        <symbol id="i-shield" {...common} strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></symbol>
        <symbol id="i-eye" {...common} strokeWidth="1.6"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></symbol>
        <symbol id="i-user" {...common} strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></symbol>
        <symbol id="i-route" {...common} strokeWidth="1.6"><circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /></symbol>
        <symbol id="i-lock" {...common} strokeWidth="1.6"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></symbol>
        <symbol id="i-layers" {...common} strokeWidth="1.6"><path d="m12 2 10 5-10 5L2 7l10-5Z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></symbol>
        <symbol id="i-image" {...common} strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></symbol>
        <symbol id="i-clock" {...common} strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></symbol>
        <symbol id="i-vote" {...common} strokeWidth="1.6"><path d="m9 12 2 2 4-4" /><path d="M5 7V4h14v3M3 7h18v13H3z" /></symbol>
        <symbol id="i-rocket" {...common} strokeWidth="1.6"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></symbol>
        <symbol id="i-chart" {...common} strokeWidth="1.6"><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 6-6" /></symbol>
      </defs>
    </svg>
  );
}
