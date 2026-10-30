import { useEffect, useMemo, useRef, useState } from "react";
import { address, formatDecimalFixedPoint, lamportsToSol } from "@solana/kit";
import { ClientProvider, useClient, useTrackedData } from "@solana/react";
import {
  WalletReadyGate,
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useWallets
} from "@solana/kit-plugin-wallet/react";
import { CLUSTER, client, explorerUrl } from "../solana.js";
import WalletPlaceholder, { WalletGlyph } from "./WalletPlaceholder.jsx";

const solFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 });

function shortAddress(value) {
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

function useBalance(accountAddress) {
  const { rpc, rpcSubscriptions } = useClient();

  // Memoized: the spec's identity drives teardown and re-subscription.
  const spec = useMemo(
    () =>
      accountAddress
        ? {
            initialValueSource: rpc.getBalance(accountAddress, { commitment: "confirmed" }),
            initialValueMapper: (lamports) => lamports,
            streamSource: rpcSubscriptions.accountNotifications(accountAddress, { commitment: "confirmed" }),
            streamValueMapper: ({ lamports }) => lamports
          }
        : null,
    [rpc, rpcSubscriptions, accountAddress]
  );

  const { data, status } = useTrackedData(spec);
  return { lamports: data?.value ?? null, status };
}

// Closes the popover on outside click or Escape.
function useDismiss(open, setOpen, ref) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, ref]);
}

function WalletList() {
  const client = useClient();
  const wallets = useWallets(client);
  const { dispatch: connect, isRunning, error } = useConnect(client);
  const [pending, setPending] = useState(null);

  function handleConnect(wallet) {
    setPending(wallet.name);
    connect(wallet);
  }

  if (wallets.length === 0) {
    return (
      <div className="wallet-empty">
        <p>No Solana wallet detected in this browser.</p>
        <p>Install a Wallet Standard wallet such as Phantom, Solflare or Backpack, then reload the page.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="wallet-list">
        {wallets.map((wallet) => (
          <li key={wallet.name}>
            <button type="button" disabled={isRunning} onClick={() => handleConnect(wallet)}>
              {wallet.icon && <img src={wallet.icon} alt="" width="24" height="24" />}
              <span>{wallet.name}</span>
              {isRunning && pending === wallet.name && <em>Connecting…</em>}
            </button>
          </li>
        ))}
      </ul>
      {error && !isRunning && (
        <p className="wallet-error" role="alert">
          Connection failed or was cancelled. Please try again.
        </p>
      )}
    </>
  );
}

function ConnectedPanel({ connected, onDone }) {
  const client = useClient();
  const { dispatch: disconnect, isRunning } = useDisconnect(client);
  const [copied, setCopied] = useState(false);

  const accountAddress = address(connected.account.address);
  const { lamports, status } = useBalance(accountAddress);

  async function copy() {
    try {
      await navigator.clipboard.writeText(accountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the address is still selectable.
    }
  }

  return (
    <div className="wallet-panel">
      <div className="wallet-row">
        <span className="wallet-label">Address</span>
        <button type="button" className="wallet-copy" onClick={copy} title="Copy address">
          <code>{shortAddress(accountAddress)}</code>
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="wallet-row">
        <span className="wallet-label">Balance</span>
        <span className="wallet-balance">
          {lamports != null
            ? `${formatDecimalFixedPoint(solFormatter, lamportsToSol(lamports))} SOL`
            : status === "error" ? "Unavailable" : "Loading…"}
        </span>
      </div>
      <div className="wallet-row">
        <span className="wallet-label">Network</span>
        <span className="wallet-network">Solana {CLUSTER}</span>
      </div>
      <div className="wallet-actions">
        <a href={explorerUrl(`address/${accountAddress}`)} target="_blank" rel="noopener noreferrer">
          View on Explorer
        </a>
        <button
          type="button"
          disabled={isRunning}
          onClick={() => {
            disconnect();
            onDone();
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

function WalletMenu() {
  const client = useClient();
  const connected = useConnectedWallet(client);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useDismiss(open, setOpen, ref);

  // Close the popover once a wallet connects (or switches account).
  const connectedAddress = connected?.account.address;
  useEffect(() => {
    if (connectedAddress) setOpen(false);
  }, [connectedAddress]);

  return (
    <div className="wallet" ref={ref}>
      <button
        type="button"
        className={`wallet-btn${connected ? " is-connected" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={connected ? connected.account.address : "Connect wallet"}
        onClick={() => setOpen((value) => !value)}
      >
        <WalletGlyph />
        <span className="wallet-btn-label">
          {connected ? shortAddress(connected.account.address) : "Connect wallet"}
        </span>
      </button>

      {open && (
        <div className="wallet-pop" role="dialog" aria-label={connected ? "Connected wallet" : "Connect a wallet"}>
          <div className="wallet-pop-head">
            <strong>{connected ? connected.account.label || "Your wallet" : "Connect a wallet"}</strong>
            <span className="wallet-chip">{CLUSTER}</span>
          </div>
          {connected ? (
            <ConnectedPanel connected={connected} onDone={() => setOpen(false)} />
          ) : (
            <WalletList />
          )}
        </div>
      )}
    </div>
  );
}

// Loaded lazily from Nav, so the Solana SDK stays out of the main bundle.
export default function WalletButton() {
  return (
    <ClientProvider client={client}>
      {/* Hold the inert button until wallet discovery and auto-reconnect settle. */}
      <WalletReadyGate client={client} fallback={<WalletPlaceholder />}>
        <WalletMenu />
      </WalletReadyGate>
    </ClientProvider>
  );
}
