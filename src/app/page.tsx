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
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
          {/* MetaMask icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-200">
            <span className="text-4xl">🦊</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Connect MetaMask
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your wallet — no account or database required.
          </p>

          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-400 hover:to-orange-500 active:scale-95 disabled:opacity-60"
          >
            {isPending ? "Connecting…" : "Connect Wallet"}
          </button>

          {error && (
            <p className="mt-4 text-xs text-red-500">{error.message}</p>
          )}

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Sepolia Testnet
            </span>
            <span>·</span>
            <span>No gas needed</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Membership Club dApp · PBA Session 6
        </p>
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
        <h1 className="text-3xl font-bold text-slate-900">Members Area</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back,{" "}
          <span className="font-mono font-medium text-indigo-600">{short}</span>
        </p>
      </div>

      <WalletCard />
    </main>
  );
}
