import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import Tags from "./Tags.jsx";

export default function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head-row">
          <div className="section-head reveal">
            <span className="eyebrow">Our work</span>
            <h2 className="section-title" id="projects-heading">Projects you can open and use.</h2>
          </div>
          <p className="section-lead reveal">
            We'd rather link to working products than describe them. Open the live
            build and try it yourself.
          </p>
        </div>

        <Card className="project reveal">
          <div className="project-copy">
            <div className="project-intro">
              <div className="project-meta">
                <span className="status-dot"></span>
                <span>Live on Solana devnet</span>
              </div>
              <h3>Necxsoft Perps &amp; Predictions</h3>
              <p>
                A perpetual futures exchange on Solana, with Predict and Earn sections in the
                same app. Traders post USDC collateral and go long or short on SOL-PERP with up to
                50× leverage. Market orders fill at the oracle price against the pool, and limit
                orders rest in a shared order book. The order panel shows take-profit and stop-loss,
                the estimated liquidation price, open and borrow fees, and slippage before
                anyone signs.
              </p>
            </div>
            <div className="project-side">
              <Tags items={["Solana", "Perpetual futures", "Up to 50× leverage", "Oracle pricing", "Limit order book", "USDC collateral", "Prediction markets"]} />
              <div className="project-actions">
                <a href="/perps-and-predictions" className="btn btn-primary" target="_blank" rel="noopener">
                  Open the live app
                  <Icon name="arrow" />
                </a>
                <a href="#contact" className="link-arrow">Build something similar <Icon name="arrow" width="16" height="16" /></a>
              </div>
            </div>
          </div>

          <a href="/perps-and-predictions" className="project-visual" target="_blank" rel="noopener" aria-label="Open Necxsoft Perps & Predictions">
            <div className="pv-window">
              <div className="code-bar" aria-hidden="true">
                <i></i><i></i><i></i>
                <span className="code-file">necxsoft.com/perps-and-predictions</span>
                <span className="code-badge">devnet</span>
              </div>
              <img
                src="/images/projects/perps-and-predictions.webp"
                width="1600"
                height="772"
                loading="lazy"
                alt="Necxsoft Perps trading screen: SOL-PERP price chart, order book, and a long/short order panel with leverage, collateral and fee details"
              />
            </div>
          </a>
        </Card>
      </div>
    </section>
  );
}
