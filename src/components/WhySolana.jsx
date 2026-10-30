const STATS = [
  ["~400ms", "Target slot time"],
  ["<$0.01", "Typical transaction fee"],
  ["Parallel", "Transaction execution"],
  ["1 state", "Composable, no bridging between L2s"]
];

export default function WhySolana() {
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby="why-heading">
      <div className="container">
        <div className="why reveal">
          <div>
            <span className="eyebrow">Why Solana</span>
            <h2 className="section-title" id="why-heading">Built for products that need to feel instant.</h2>
            <p className="section-lead">
              Solana runs programs in parallel on one global state. Fast confirmations and
              low fees make consumer-grade on-chain experiences possible. We build there
              because that's where these products work best.
            </p>
          </div>
          <div>
            <div className="stats">
              {STATS.map(([value, label]) => (
                <div className="stat" key={label}>
                  <div className="stat-value grad-text">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
            <p className="why-note">Network figures are approximate and vary with network conditions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
