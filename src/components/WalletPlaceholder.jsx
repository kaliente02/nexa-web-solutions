export function WalletGlyph() {
  return (
    <svg className="wallet-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <use href="#i-wallet" />
    </svg>
  );
}

// Inert stand-in shown in the prerendered HTML and while the wallet code
// loads, so the nav layout doesn't shift.
export default function WalletPlaceholder() {
  return (
    <div className="wallet">
      <button type="button" className="wallet-btn" disabled>
        <WalletGlyph />
        <span className="wallet-btn-label">Connect wallet</span>
      </button>
    </div>
  );
}
