"use client";

import { useAccount, useDisconnect } from "wagmi";

export function Header() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">

        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
              Web3 dApp
            </p>
            <p className="text-base font-bold text-slate-900 leading-none">
              Membership Club
            </p>
          </div>
          <div className="ml-1 flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600">Sepolia</span>
          </div>
        </div>

        {/* Right side */}
        {isConnected ? (
          <div className="flex items-center gap-3">
            {/* Address pill */}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <span className="font-mono text-sm font-medium text-slate-700">{short}</span>
            </div>
            {/* Disconnect */}
            <button
              onClick={() => disconnect()}
              className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-300 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-slate-300" />
            </span>
            <span className="text-sm font-medium text-slate-400">Not connected</span>
          </div>
        )}

      </div>
    </header>
  );
}
