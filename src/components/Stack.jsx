const TOOLS = [
  "Rust", "Anchor", "Token-2022", "Metaplex", "Solana Pay", "Actions & Blinks",
  "Wallet Adapter", "@solana/kit", "LiteSVM", "Compressed NFTs", "TypeScript", "Next.js"
];

export default function Stack() {
  return (
    <section className="stack" aria-label="Technologies we build with">
      <p className="stack-label">Built with the Solana toolchain</p>
      <div className="marquee">
        <div className="marquee-track">
          {TOOLS.map((tool) => <span key={tool}>{tool}</span>)}
          {/* Duplicate set so the marquee loops seamlessly. */}
          {TOOLS.map((tool) => <span key={`dup-${tool}`} aria-hidden="true">{tool}</span>)}
        </div>
      </div>
    </section>
  );
}
