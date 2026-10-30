import Icon from "./Icon.jsx";

const CODE_LINES = [
  <><span className="tk-k">use</span> anchor_lang::prelude::*;</>,
  null,
  <span className="tk-m">#[program]</span>,
  <><span className="tk-k">pub mod</span> <span className="tk-t">vault</span> {"{"}</>,
  <>    <span className="tk-k">use super</span>::*;</>,
  null,
  <>    <span className="tk-k">pub fn</span> <span className="tk-f">deposit</span>(ctx: <span className="tk-t">Context</span>&lt;<span className="tk-t">Deposit</span>&gt;, amount: <span className="tk-t">u64</span>) -&gt; <span className="tk-t">Result</span>&lt;()&gt; {"{"}</>,
  <>        <span className="tk-m">require!</span>(amount &gt; <span className="tk-s">0</span>, <span className="tk-t">VaultError</span>::ZeroAmount);</>,
  <>        <span className="tk-k">let</span> vault = &amp;<span className="tk-k">mut</span> ctx.accounts.vault;</>,
  "        vault.balance = vault.balance",
  <>            .<span className="tk-f">checked_add</span>(amount)</>,
  <>            .<span className="tk-f">ok_or</span>(<span className="tk-t">VaultError</span>::Overflow)?;</>,
  <>        <span className="tk-t">Ok</span>(())</>,
  "    }",
  "}",
  null,
  <span className="tk-m">#[derive(Accounts)]</span>,
  <><span className="tk-k">pub struct</span> <span className="tk-t">Deposit</span>&lt;<span className="tk-s">'info</span>&gt; {"{"}</>,
  <>    <span className="tk-m">#[account(mut, seeds = [b"vault", owner.key().as_ref()], bump)]</span></>,
  <>    <span className="tk-k">pub</span> vault: <span className="tk-t">Account</span>&lt;<span className="tk-s">'info</span>, <span className="tk-t">Vault</span>&gt;,</>,
  <>    <span className="tk-k">pub</span> owner: <span className="tk-t">Signer</span>&lt;<span className="tk-s">'info</span>&gt;,</>,
  "}"
];

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="pill reveal"><span className="pill-tag">Solana</span> Development studio · Davao City, PH</span>

          <h1 id="hero-heading" className="reveal" style={{ "--d": ".08s" }}>
            We build what<br />ships on <span className="grad-text">Solana.</span>
          </h1>

          <p className="hero-sub reveal" style={{ "--d": ".16s" }}>
            NECXSOFT designs, builds and launches Solana programs, dApps, token systems and
            AI agents. We handle the work from the first spec through to mainnet, for founders
            and teams worldwide.
          </p>

          <div className="hero-actions reveal" style={{ "--d": ".24s" }}>
            <a href="#contact" className="btn btn-primary">
              Book a discovery call
              <Icon name="arrow" />
            </a>
            <a href="#services" className="btn btn-ghost">Explore services</a>
          </div>

          <ul className="hero-facts reveal" style={{ "--d": ".32s" }}>
            <li><Icon name="check" />Rust &amp; Anchor native</li>
            <li><Icon name="check" />Demo before commitment</li>
            <li><Icon name="check" />Direct line to the founder</li>
          </ul>
        </div>

        <div className="hero-visual reveal" style={{ "--d": ".2s" }} aria-hidden="true">
          <div className="code-window">
            <div className="code-bar">
              <i></i><i></i><i></i>
              <span className="code-file">programs/vault/src/lib.rs</span>
              <span className="code-badge">anchor build ✓</span>
            </div>
            <pre className="code-body">
              {CODE_LINES.map((line, index) => (
                <span className="ln" key={index}>{line}</span>
              ))}
            </pre>
          </div>

          <div className="float-chip chip-a">
            <span className="chip-dot"><Icon name="shield" /></span>
            <div><strong>Checked math · PDA seeds</strong><span>safety by default</span></div>
          </div>

          <div className="float-chip chip-b">
            <span className="chip-dot violet"><Icon name="rocket" /></span>
            <div><strong>devnet → mainnet</strong><span>staged releases</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
