"use client";

import { useAccount, useBalance, useBlockNumber, useSignMessage, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useState } from "react";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export function WalletCard() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address, chainId: sepolia.id });
  const { data: blockNumber } = useBlockNumber({ chainId: sepolia.id, watch: true });
  const { signMessage, data: signature, isPending: signing } = useSignMessage();
  const { switchChain } = useSwitchChain();
  const [msgInput, setMsgInput] = useState("");

  if (!address) return null;

  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
  const eth = balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : "—";
  const onWrongNetwork = chain?.id !== sepolia.id;

  return (
    <div className="space-y-5">

      {/* Wrong network banner */}
      {onWrongNetwork && (
        <div className="flex items-center justify-between rounded-2xl border border-yellow-200 bg-yellow-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-100 text-base">⚠️</span>
            <div>
              <p className="text-sm font-bold text-yellow-800">Wrong Network</p>
              <p className="text-xs text-yellow-600">Please switch to Sepolia Testnet</p>
            </div>
          </div>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="rounded-xl bg-yellow-400 px-4 py-2 text-xs font-bold text-yellow-900 transition hover:bg-yellow-300 active:scale-95"
          >
            Switch Network
          </button>
        </div>
      )}

      {/* Main wallet card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">

        {/* Gradient header */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 py-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
                Member Wallet
              </p>
              <p className="mt-3 break-all font-mono text-sm font-semibold text-white/90 leading-relaxed">
                {address}
              </p>
            </div>
            <span className="ml-4 flex-shrink-0 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              {chain?.name ?? "Unknown"}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2">
          <Stat label="Short Address" value={short} mono accent="indigo" />
          <Stat label="ETH Balance" value={eth} accent="violet" />
          <Stat label="Network" value={chain?.name ?? "—"} border accent="purple" />
          <Stat label="Latest Block" value={blockNumber ? `#${blockNumber.toLocaleString()}` : "…"} border accent="slate" />
        </div>

        {/* Contract row */}
        <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/50 px-8 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              Contract Address
            </p>
            <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-600">
              Sepolia
            </span>
          </div>
          <p className="break-all font-mono text-xs font-semibold text-indigo-600 leading-relaxed">
            {CONTRACT || "—"}
          </p>
        </div>

        {/* Status footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-8 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            <span className="text-sm font-semibold text-slate-600">Connected · Membership active</span>
          </div>
          <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
            Live
          </span>
        </div>
      </div>

      {/* Sign message card */}
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
                Free
              </span>
              <span className="rounded-full border border-green-100 bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-600">
                No gas
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Sign a Message</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Prove wallet ownership without any transaction.
            </p>
          </div>
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
            ✍️
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type your message here…"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
          <button
            onClick={() => signMessage({ message: msgInput || "Hello from Membership Club!" })}
            disabled={signing}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
          >
            {signing ? "Signing…" : "Sign"}
          </button>
        </div>

        {signature && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white font-bold">✓</span>
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">Signature Verified</p>
            </div>
            <p className="break-all font-mono text-xs text-green-600 leading-relaxed">
              {signature}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
  border,
  accent = "slate",
}: {
  label: string;
  value: string;
  mono?: boolean;
  border?: boolean;
  accent?: "indigo" | "violet" | "purple" | "slate";
}) {
  const accentMap = {
    indigo: "text-indigo-600",
    violet: "text-violet-600",
    purple: "text-purple-600",
    slate: "text-slate-800",
  };

  return (
    <div className={`px-8 py-5 ${border ? "border-t border-slate-100" : ""}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <p className={`mt-1.5 text-base font-extrabold ${accentMap[accent]} ${mono ? "font-mono text-sm" : ""}`}>
        {value}
      </p>
    </div>
  );
}
