import { useState } from "react";
import Card from "./Card.jsx";
import Icon from "./Icon.jsx";
import { BRAND_CONFIG, FORM_CONFIG } from "../config.js";

const NEXT_STEPS = [
  ["Send your brief", "Tell us what you're building, your timeline and your budget."],
  ["We reply by email", "We'll ask any follow-up questions and agree a time for a call."],
  ["Discovery call", "About 30 minutes on Google Meet to scope the project together."],
  ["Scope & proposal", "A clear plan with a timeline and a quote. No commitment until you've seen a demo."]
];

function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form)
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.message || "Submission failed");

      setStatus({
        type: "success",
        message: "Message sent. This is an inquiry, not a booked call. We'll follow up by email."
      });
      form.reset();
    } catch (error) {
      console.error("Web3Forms error:", error);
      setStatus({
        type: "error",
        message: `Something went wrong. Please try again or email ${BRAND_CONFIG.email}.`
      });
    }

    setSending(false);
  }

  return (
    <form className="form" id="contactForm" noValidate onSubmit={handleSubmit}>
      <input type="hidden" name="access_key" value={FORM_CONFIG.web3formsAccessKey} />
      <input type="hidden" name="subject" value="New inquiry from necxsoft.com" />
      <input type="hidden" name="from_name" value="NECXSOFT Website" />
      <input type="checkbox" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="form-row">
        <div className="field">
          <label htmlFor="contactName">Name *</label>
          <input id="contactName" name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="contactEmail">Email *</label>
          <input id="contactEmail" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="contactCompany">Company / project</label>
          <input id="contactCompany" name="company" type="text" autoComplete="organization" maxLength={150} placeholder="Optional" />
        </div>
        <div className="field">
          <label htmlFor="contactPhone">Phone / Telegram</label>
          <input id="contactPhone" name="phone" type="text" autoComplete="tel" maxLength={30} placeholder="Optional" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="contactMessage">What are you building? *</label>
        <textarea id="contactMessage" name="message" required maxLength={3000} placeholder="A few lines about your product, timeline and budget." />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
        {sending ? "Sending…" : <>Send inquiry <Icon name="arrow" /></>}
      </button>

      <p className="form-consent">By sending, you agree to our <a href="/privacy">Privacy Policy</a>. We use your details only to reply to your inquiry.</p>

      <p id="formStatus" className={`form-status${status.type ? ` ${status.type}` : ""}`} role="status" aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}

export default function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Let's build</span>
          <h2 className="section-title" id="contact-heading">Have a Solana idea? Let's ship it.</h2>
          <p className="section-lead">We serve clients worldwide from Davao City, Philippines, and take on a limited number of new projects each quarter.</p>
        </div>

        <div className="contact">
          <Card as="div" className="contact-panel reveal">
            <h3>What happens next</h3>
            <p>A free discovery call to understand your product, your goals and the right Solana solution for it.</p>

            <ol className="next-steps">
              {NEXT_STEPS.map(([title, text], index) => (
                <li key={title}>
                  <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                  <div><b>{title}</b><p>{text}</p></div>
                </li>
              ))}
            </ol>

            <div className="contact-direct">
              <span>Prefer email?</span>
              <a href="mailto:support@necxsoft.com" className="link-arrow">support@necxsoft.com <Icon name="arrow" width="16" height="16" /></a>
            </div>
          </Card>

          <Card as="div" className="contact-panel reveal" style={{ "--d": ".06s" }}>
            <h3>Tell us about your project</h3>
            <p>We'll reply by email to set up your discovery call.</p>
            <ContactForm />
          </Card>
        </div>
      </div>
    </section>
  );
}
