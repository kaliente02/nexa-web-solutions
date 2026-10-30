import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import { revealDelay } from "../reveal.js";

const PRODUCTS = [
  ["image", "Mint", "Token and NFT minting with Token-2022 and Metaplex. Includes metadata, allowlists and collection management."],
  ["clock", "Vest", "On-chain vesting schedules with cliffs, linear unlocks and a claim dashboard for your token holders."],
  ["vote", "DAO", "Governance, proposals, voting and multisig treasury flows for communities and protocol teams."],
  ["layers", "Chain", "A program deployment pipeline covering builds, devnet staging, upgrade-authority handling and release notes."],
  ["bot", "Agent", "AI agent and chatbot platform for support, onboarding and on-chain workflows."],
  ["chart", "Pulse", "Dashboards for on-chain analytics, with AI summaries of holders, volume and program activity."]
];

export default function Products() {
  return (
    <section className="section" id="products" aria-labelledby="products-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">NECXSOFT products</span>
          <h2 className="section-title" id="products-heading">Proven starting points, tailored to your protocol.</h2>
          <p className="section-lead">
            Reusable foundations we customize for your product. You launch sooner without
            settling for a template.
          </p>
        </div>

        <div className="products">
          {PRODUCTS.map(([icon, name, text], index) => (
            <Card key={name} className="product reveal" style={revealDelay((index % 3) * 60)}>
              <div className="product-top">
                <span className="icon-box"><Icon name={icon} /></span>
                <span className="product-code">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>NECXSOFT <span>{name}</span></h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>

        <div className="products-foot reveal">
          <span>Need something different? We'll design a custom system around your protocol.</span>
          <a href="#contact" className="link-arrow">Talk to us <Icon name="arrow" width="16" height="16" /></a>
        </div>
      </div>
    </section>
  );
}
