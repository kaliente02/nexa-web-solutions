import Icon from "./Icon.jsx";

export default function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-band reveal">
          <span className="eyebrow">Ready when you are</span>
          <h2 id="cta-heading" style={{ marginTop: 18 }}>Your next launch on Solana starts with one call.</h2>
          <p>Tell us what you're building. You'll leave the call with a clear scope, a timeline and the next steps.</p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">Book a discovery call <Icon name="arrow" /></a>
            <a href="mailto:support@necxsoft.com" className="btn btn-ghost">support@necxsoft.com</a>
          </div>
        </div>
      </div>
    </section>
  );
}
