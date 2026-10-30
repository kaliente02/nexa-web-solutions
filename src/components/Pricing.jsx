import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import { revealDelay } from "../reveal.js";

const PLANS = [
  {
    name: "Starter",
    price: "$5,000",
    php: "≈ ₱290,000+",
    desc: "A single Solana program, token launch or AI integration with a focused frontend.",
    features: [
      "One Anchor program or AI integration",
      "Custom dApp frontend",
      "Wallet connection setup",
      "Devnet + mainnet deployment",
      "Tested, reviewed program code",
      "Documentation & handoff"
    ],
    cta: "Book a discovery call"
  },
  {
    name: "Business",
    flag: "Most popular",
    featured: true,
    price: "$15,000",
    php: "≈ ₱870,000+",
    desc: "Multi-program dApps, token systems and AI agents for products going to market.",
    features: [
      "Everything in Starter",
      "Multi-program architecture",
      "Admin & on-chain dashboard",
      "Token-2022 or NFT infrastructure",
      "AI agent automation",
      "Priority development"
    ],
    cta: "Book a discovery call"
  },
  {
    name: "Custom",
    php: "Scoped to your protocol",
    desc: "DeFi protocols, enterprise AI systems, DAOs and long-term technology partnerships.",
    features: [
      "Everything in Business",
      "Protocol-scale architecture",
      "Custom AI implementations",
      "DAO & multisig governance",
      "Third-party audit coordination"
    ],
    cta: "Discuss your project"
  }
];

export default function Pricing() {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Investment</span>
          <h2 className="section-title" id="pricing-heading">Clear starting points.</h2>
          <p className="section-lead">We scope every quote after a discovery call. These are starting estimates, not final prices.</p>
        </div>

        <div className="pricing">
          {PLANS.map((plan, index) => (
            <Card
              key={plan.name}
              className={`plan${plan.featured ? " featured" : ""} reveal`}
              style={revealDelay(index * 60)}
            >
              <div className="plan-head">
                <span className="plan-name">{plan.name}</span>
                {plan.flag && <span className="plan-flag">{plan.flag}</span>}
              </div>
              <div className="plan-price">
                {plan.price ? <><small>from</small>{plan.price}</> : "Let's talk"}
              </div>
              <div className="plan-php">{plan.php}</div>
              <p className="plan-desc">{plan.desc}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><Icon name="check" />{feature}</li>
                ))}
              </ul>
              <a href="#contact" className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"} btn-block`}>{plan.cta}</a>
            </Card>
          ))}
        </div>
        <p className="fine" style={{ textAlign: "center" }}>Final pricing depends on scope, functionality, integrations, design requirements and complexity.</p>
      </div>
    </section>
  );
}
