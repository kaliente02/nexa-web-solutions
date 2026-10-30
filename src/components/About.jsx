import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import { revealDelay } from "../reveal.js";

const PRINCIPLES = [
  ["eye", "Demo before commitment", "You see a working devnet prototype before final payment."],
  ["user", "Direct access to the builder", "You work with the founder and a small named team, with no account managers in between."],
  ["route", "Transparent process", "Seven defined steps with demos at each milestone, so progress is never a mystery."],
  ["lock", "Security-first defaults", "Checked math, strict account validation and tests from the very first commit."]
];

const MISSION = [
  ["Vision", "To become a trusted technology partner that turns ideas into reliable, impactful products on Solana."],
  ["Mission", "To deliver practical Solana and AI solutions that help businesses and protocols improve, grow and reach their goals."],
  ["Values", "Innovation, integrity, quality, collaboration, customer focus and continuous improvement."]
];

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Why teams choose us</span>
          <h2 className="section-title" id="about-heading">Built to be verified, not just believed.</h2>
          <p className="section-lead">
            We're an early-stage, founder-led studio. We'd rather show you how we work than
            quote numbers we can't back up.
          </p>
        </div>

        <div className="principles">
          {PRINCIPLES.map(([icon, title, text], index) => (
            <Card key={title} className="principle reveal" style={revealDelay(index * 60)}>
              <span className="icon-box"><Icon name={icon} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>

        <div className="mission">
          {MISSION.map(([title, text], index) => (
            <Card as="div" key={title} className="reveal" style={revealDelay(index * 60)}>
              <h4>{title}</h4>
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
