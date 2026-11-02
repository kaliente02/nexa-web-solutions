// Fixed-price quick-start packages. Edit here; the Packages section and the
// contact form prefill both read from this list.
export const PACKAGES = [
  {
    slug: "token-launch",
    name: "Token Launch",
    price: "$750",
    delivery: "1 week",
    features: [
      "SPL or Token-2022 token",
      "On-chain metadata + logo upload",
      "Mint & freeze authority setup",
      "Mainnet deployment + handover doc"
    ]
  },
  {
    slug: "nft-collection",
    name: "NFT Collection",
    price: "$1,200",
    delivery: "2 weeks",
    features: [
      "Metaplex Core collection (up to 10k items)",
      "Metadata + asset upload",
      "Mint page with wallet connect",
      "Mainnet deployment"
    ]
  },
  {
    slug: "solana-pay-blinks",
    name: "Solana Pay / Blinks",
    price: "$900",
    delivery: "1 week",
    features: [
      "Accept SOL/USDC payments",
      "Shareable Blinks for X and websites",
      "Transaction confirmation flow",
      "Integration into your existing site"
    ]
  },
  {
    slug: "pre-audit-review",
    name: "Pre-Audit Review",
    price: "$1,500",
    delivery: "1–2 weeks",
    features: [
      "Manual review of your Anchor program",
      "LiteSVM test suite for critical paths",
      "Written findings report with severity levels",
      "One follow-up review after fixes"
    ]
  }
];

export const PACKAGE_PARAM = "package";
export const PACKAGE_SELECT_EVENT = "necx:package-select";

export function findPackage(slug) {
  return PACKAGES.find((pkg) => pkg.slug === slug);
}

export function packageMessage(pkg) {
  return `Hi NECXSOFT, I'm interested in the ${pkg.name} package (${pkg.price}). Project details: `;
}
