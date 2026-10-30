import { createClient } from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { walletSigner } from "@solana/kit-plugin-wallet";

// The site's demo apps run on devnet, so the wallet connects there too.
// Set VITE_SOLANA_RPC_URL to use a dedicated devnet RPC provider.
export const CLUSTER = "devnet";

const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL;

// One client for the whole site. The connected wallet fills payer + identity.
// SSR-safe: during prerender the wallet status stays "pending".
export const client = createClient()
  .use(walletSigner({ chain: `solana:${CLUSTER}` }))
  .use(solanaDevnetRpc({
    ...(rpcUrl ? { rpcUrl } : {}),
    transactionConfig: { version: 1 }
  }));

export function explorerUrl(path) {
  return `https://explorer.solana.com/${path}?cluster=${CLUSTER}`;
}
