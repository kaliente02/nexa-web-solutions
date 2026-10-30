import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import Tags from "./Tags.jsx";

const SMALL_SERVICES = [
  {
    icon: "wallet",
    title: "dApps & wallets",
    text: "Fast web frontends with wallet connection, transaction building and confirmation states that users can follow.",
    tags: ["Wallet Adapter", "Solana Pay", "Blinks"],
    delay: ".06s"
  },
  {
    icon: "coins",
    title: "Tokens & NFTs",
    text: "SPL and Token-2022 launches with transfer hooks, fees and on-chain metadata, plus Metaplex Core and compressed NFT collections.",
    tags: ["Token-2022", "Metaplex Core", "cNFTs"]
  },
  {
    icon: "swap",
    title: "DeFi integrations",
    text: "Swap routing, oracle price feeds, staking, escrow and vesting flows, wired into your product with clear failure handling.",
    tags: ["Swaps", "Oracles", "Staking"],
    delay: ".06s"
  },
  {
    icon: "bot",
    title: "AI agents on Solana",
    text: "LLM agents that read on-chain data, explain it and act on it. Spending limits and human approval come built in.",
    tags: ["LLMs", "On-chain data", "Guardrails"],
    delay: ".12s"
  }
];

const SECURITY_CHECKS = [
  "missing signer check",
  "account owner check",
  "arithmetic overflow",
  "PDA seed collision",
  "closed-account reuse"
];

export default function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-heading">
      <div className="container">
        <div className="section-head-row">
          <div className="section-head reveal">
            <span className="eyebrow">What we build</span>
            <h2 className="section-title" id="services-heading">Solana engineering, from the program to the product.</h2>
          </div>
          <p className="section-lead reveal" style={{ maxWidth: 420 }}>
            One team covers the on-chain logic, the interface people use and the automation
            around it, so nothing gets lost between handoffs.
          </p>
        </div>

        <div className="bento">
          <Card className="service service-feature reveal">
            <div className="service-copy">
              <span className="icon-box"><Icon name="code" /></span>
              <h3>Solana programs</h3>
              <p>
                On-chain programs in Rust and Anchor. Clean account design, PDAs and CPIs, and
                validation on every instruction. We write them to be readable, testable and
                ready for an audit.
              </p>
              <Tags items={["Rust", "Anchor", "PDAs & CPI", "Upgrade authority"]} />
            </div>
            <div className="mini-graph" aria-hidden="true">
              <div className="acct"><b>owner</b><em className="ok">Signer</em></div>
              <div className="acct-arrow">↓ seeds = ["vault", owner]</div>
              <div className="acct"><b>vault PDA</b><em>Account&lt;Vault&gt;</em></div>
              <div className="acct-arrow">↓ CPI</div>
              <div className="acct"><b>token program</b><em className="ok">transfer_checked</em></div>
            </div>
          </Card>

          {SMALL_SERVICES.map((service) => (
            <Card
              key={service.title}
              className="service reveal"
              style={service.delay ? { "--d": service.delay } : undefined}
            >
              <span className="icon-box"><Icon name={service.icon} /></span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <Tags items={service.tags} />
            </Card>
          ))}

          <Card className="service service-feature service-wide reveal">
            <div className="service-copy">
              <span className="icon-box"><Icon name="shield" /></span>
              <h3>Testing &amp; security review</h3>
              <p>
                Every program ships with unit, integration and fuzz tests, plus an internal
                review against common Solana issues. For mainnet launches that hold real value,
                we prepare your code for an independent third-party audit.
              </p>
              <Tags items={["LiteSVM", "Fuzzing", "Audit prep"]} />
            </div>
            <div className="mini-graph" aria-hidden="true">
              {SECURITY_CHECKS.map((check) => (
                <div className="acct" key={check}><b>{check}</b><em className="ok">covered</em></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
