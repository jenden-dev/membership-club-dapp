"use client";

import { useAccount, useDisconnect } from "wagmi";

export function Header() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const short = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="font-semibold tracking-tight text-white">
            Membership Club
          </span>
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
            Sepolia
          </span>
        </div>

        {/* Wallet status */}
        {isConnected ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="font-mono text-sm text-slate-300">{short}</span>
            </div>
            <button
              onClick={() => disconnect()}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400 transition hover:bg-red-500/20"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-400">Not connected</span>
          </div>
        )}
      </div>
    </header>
  );
}
