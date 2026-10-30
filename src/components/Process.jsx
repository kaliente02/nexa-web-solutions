import { revealDelay } from "../reveal.js";

const STEPS = [
  ["Discovery", "Your users, token model, goals and constraints."],
  ["Planning", "Scope, account architecture and roadmap."],
  ["Design", "UX flows, interface and instruction design."],
  ["Build", "Programs and dApp, built in prioritized iterations."],
  ["Test", "Testing, internal review and devnet demos."],
  ["Launch", "Mainnet deployment and production setup."],
  ["Improve", "Iterate on on-chain data and user feedback."]
];

const TIMELINE = [
  ["Mint & landing pages", "~1–2 weeks"],
  ["Programs & dApps", "~2–6 weeks"],
  ["AI agents & integrations", "~3–8 weeks"],
  ["Complex protocols", "Scoped in discovery"]
];

export default function Process() {
  return (
    <section className="section" id="process" aria-labelledby="process-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">How we work</span>
          <h2 className="section-title" id="process-heading">Seven steps from idea to mainnet.</h2>
          <p className="section-lead">Every engagement follows the same process, so you always know what's next and what you'll see.</p>
        </div>

        <ol className="process">
          {STEPS.map(([title, text], index) => (
            <li key={title} className="step reveal" style={revealDelay(index * 50)}>
              <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>

        <dl className="timeline reveal">
          {TIMELINE.map(([label, duration]) => (
            <div key={label}><dt>{label}</dt><dd>{duration}</dd></div>
          ))}
        </dl>
        <p className="fine">Timelines depend on scope, integrations, revisions, content readiness and complexity.</p>
      </div>
    </section>
  );
}
