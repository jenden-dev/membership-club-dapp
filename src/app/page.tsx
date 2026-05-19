"use client";

import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { WalletCard } from "@/components/wallet-card";

export default function HomePage() {
  const { isConnected } = useAccount();
  return isConnected ? <Dashboard /> : <LoginScreen />;
}

function LoginScreen() {
  const { connect, isPending, error } = useConnect();

  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-white/8 bg-white/3 p-10 text-center shadow-2xl backdrop-blur-xl">
          {/* MetaMask icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/25">
            <span className="text-4xl">🦊</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            Connect MetaMask
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your wallet — no account or database required.
          </p>

          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 disabled:opacity-60"
          >
            {isPending ? "Connecting…" : "Connect Wallet"}
          </button>

          {error && (
            <p className="mt-4 text-xs text-red-400">{error.message}</p>
          )}

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-600">
            <span>Sepolia Testnet</span>
            <span>·</span>
            <span>No gas needed</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function Dashboard() {
  const { address } = useAccount();
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Members Area</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back,{" "}
          <span className="font-mono text-indigo-400">{short}</span>
        </p>
      </div>

      <WalletCard />
    </main>
  );
}
