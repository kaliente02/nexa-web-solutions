import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import { revealDelay } from "../reveal.js";
import { PACKAGES, PACKAGE_PARAM, PACKAGE_SELECT_EVENT } from "../packages.js";

// Puts ?package=<slug>#contact in the URL so the choice can be shared, tells
// the contact form to prefill, and smooth-scrolls down to the form.
function bookPackage(event, pkg) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const form = document.getElementById("contactForm");
  if (!form) return;

  event.preventDefault();

  const url = new URL(window.location.href);
  url.searchParams.set(PACKAGE_PARAM, pkg.slug);
  url.hash = "contact";
  history.pushState(null, "", url);

  window.dispatchEvent(new CustomEvent(PACKAGE_SELECT_EVENT, { detail: pkg.slug }));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: form.getBoundingClientRect().top + window.scrollY - 120,
    behavior: reduceMotion ? "instant" : "smooth"
  });
}

export default function Packages() {
  return (
    <section className="section" id="packages" aria-labelledby="packages-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Quick-start</span>
          <h2 className="section-title" id="packages-heading">Fixed-price packages</h2>
          <p className="section-lead">Clear scope, fixed price, delivered in 2 weeks or less. A low-risk way to start working with us.</p>
        </div>

        <div className="packages">
          {PACKAGES.map((pkg, index) => (
            <Card
              key={pkg.slug}
              className="plan package reveal"
              style={revealDelay(index * 60)}
              aria-labelledby={`pkg-${pkg.slug}`}
            >
              <div className="plan-head">
                <h3 className="plan-name" id={`pkg-${pkg.slug}`}>{pkg.name}</h3>
                <span className="package-time">
                  <Icon name="clock" />
                  <span className="visually-hidden">Delivery: </span>{pkg.delivery}
                </span>
              </div>
              <div className="plan-price">{pkg.price}<small>fixed</small></div>
              <ul>
                {pkg.features.map((feature) => (
                  <li key={feature}><Icon name="check" />{feature}</li>
                ))}
              </ul>
              <a
                href={`?${PACKAGE_PARAM}=${pkg.slug}#contact`}
                className="btn btn-ghost btn-block"
                aria-describedby={`pkg-${pkg.slug}`}
                onClick={(event) => bookPackage(event, pkg)}
              >
                Book this package <Icon name="arrow" />
              </a>
            </Card>
          ))}
        </div>
        <p className="fine" style={{ textAlign: "center" }}>
          Need something bigger? See our <a href="#pricing" className="text-link">Starter and Business plans</a> above,
          or <a href="#contact" className="text-link">book a discovery call</a>.
        </p>
      </div>
    </section>
  );
}
