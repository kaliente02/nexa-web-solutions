import { useEffect, useState } from "react";

export default function Footer() {
  // Prerendered with the build year, then updated in the browser.
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <a href="#home" className="brand" aria-label="NECXSOFT home">
              <img src="/images/team/logo.png" alt="" width="34" height="34" />
              NECXSOFT
            </a>
            <p>A Solana development studio building programs, dApps, token systems and AI agents for teams worldwide. Based in Davao City, Philippines.</p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Solana programs</a></li>
              <li><a href="#services">dApps &amp; wallets</a></li>
              <li><a href="#services">Tokens &amp; NFTs</a></li>
              <li><a href="#services">AI agents</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li><a href="mailto:support@necxsoft.com">Email</a></li>
              <li><a href="https://www.linkedin.com/company/necxsoft" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://www.facebook.com/necxsoft/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© <span id="year">{year}</span> NECXSOFT. All rights reserved.</span>
          <span>NECXSOFT is an independent studio, not affiliated with the Solana Foundation.</span>
        </div>
      </div>
    </footer>
  );
}
