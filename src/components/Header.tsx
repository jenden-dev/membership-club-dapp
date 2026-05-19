"use client";

import { useAccount, useDisconnect } from "wagmi";

export function Header() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <div>
            <span className="font-bold tracking-tight text-slate-900">
              Membership Club
            </span>
            <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 border border-indigo-100">
              Sepolia
            </span>
          </div>
        </div>

        {/* Wallet status */}
        {isConnected ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
              <span className="font-mono text-sm text-slate-700">{short}</span>
            </div>
            <button
              onClick={() => disconnect()}
              className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-100"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="text-sm text-slate-400">Not connected</span>
          </div>
        )}
      </div>
    </header>
  );
}
