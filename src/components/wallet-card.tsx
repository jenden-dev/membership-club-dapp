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
    <div className="space-y-4">
      {/* Wrong network banner */}
      {onWrongNetwork && (
        <div className="flex items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-3">
          <span className="text-sm text-yellow-700">Wrong network — switch to Sepolia</span>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 transition hover:bg-yellow-200"
          >
            Switch
          </button>
        </div>
      )}

      {/* Main wallet card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-100">
        {/* Top gradient bar */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
            Member Wallet
          </p>
          <p className="mt-2 break-all font-mono text-sm text-white/90">
            {address}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
          <Stat label="Short Address" value={short} mono />
          <Stat label="Balance" value={eth} />
          <Stat label="Network" value={chain?.name ?? "Unknown"} />
          <Stat label="Latest Block" value={blockNumber ? `#${blockNumber.toLocaleString()}` : "…"} />
        </div>

        {/* Contract address */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Contract Address
          </p>
          <p className="mt-1 break-all font-mono text-xs text-indigo-600">
            {CONTRACT || "—"}
          </p>
        </div>

        {/* Status footer */}
        <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-6 py-3">
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
          <span className="text-xs text-slate-500">Connected · Membership active</span>
        </div>
      </div>

      {/* Sign message card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Sign Message</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Prove wallet ownership — no transaction needed.
            </p>
          </div>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 border border-indigo-100">
            Free
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type a message…"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
          <button
            onClick={() => signMessage({ message: msgInput || "Hello from Membership Club!" })}
            disabled={signing}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
          >
            {signing ? "Signing…" : "Sign"}
          </button>
        </div>

        {signature && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-xs font-semibold text-green-700">✓ Signature</p>
            <p className="mt-1 break-all font-mono text-xs text-green-600">
              {signature}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-6 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}
