const QUESTIONS = [
  ["Why do you focus on Solana?", "Fast confirmations, low fees and one composable state make Solana the best fit for consumer and high-throughput products. Going deep on one ecosystem means sharper expertise in its programs, tooling and security patterns."],
  ["Can you work with other chains?", "Solana is our focus. If your product also needs an EVM chain, for example to bridge or to support multiple chains, we scope that during discovery."],
  ["Do you audit smart contracts?", "Every program goes through thorough testing and an internal security review. For mainnet launches that will hold real value, we recommend an independent third-party audit. We prepare your codebase for it and help coordinate the audit."],
  ["How long does a project take?", "It depends on scope. Mint and landing pages typically take 1–2 weeks, programs and dApps 2–6 weeks, and AI agents and integrations 3–8 weeks."],
  ["Do I need to pay before I see anything?", "No. We work demo-first, so you see a working devnet preview before any commitment is final."],
  ["Do you work with clients outside the Philippines?", "Yes. We work with US and international clients entirely online."],
  ["What happens after launch?", "We offer ongoing support and maintenance, including program upgrades, monitoring and new features as your product grows."],
  ["How much does a project cost?", "Starter projects begin at $5,000 and Business projects at $15,000. We quote complex protocols individually after discovery."]
];

export default function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-heading" style={{ paddingTop: 0 }}>
      <div className="container faq-wrap">
        <div className="section-head reveal">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title" id="faq-heading">Common questions.</h2>
          <p className="section-lead">Can't find your answer? Email <a href="mailto:support@necxsoft.com" className="grad-text">support@necxsoft.com</a>.</p>
        </div>

        <div className="faq-list reveal">
          {QUESTIONS.map(([question, answer]) => (
            <details className="faq-item" key={question}>
              <summary>{question}<span className="faq-icon" aria-hidden="true"></span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
