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
        <div className="flex items-center justify-between rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3">
          <span className="text-sm text-yellow-400">Wrong network — switch to Sepolia</span>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="rounded-lg bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300 transition hover:bg-yellow-500/30"
          >
            Switch
          </button>
        </div>
      )}

      {/* Main wallet card */}
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent">
        {/* Top bar */}
        <div className="border-b border-white/8 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">
            Member Wallet
          </p>
          <p className="mt-2 break-all font-mono text-sm text-white/80">
            {address}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-white/5">
          <Stat label="Short" value={short} mono />
          <Stat label="Balance" value={eth} />
          <Stat label="Network" value={chain?.name ?? "Unknown"} />
          <Stat label="Block" value={blockNumber ? `#${blockNumber.toLocaleString()}` : "…"} />
        </div>

        {/* Contract address */}
        <div className="border-t border-white/8 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Contract
          </p>
          <p className="mt-1 break-all font-mono text-xs text-indigo-400">
            {CONTRACT || "—"}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 border-t border-white/8 bg-white/3 px-6 py-3">
          <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
          <span className="text-xs text-slate-400">Connected · Membership active</span>
        </div>
      </div>

      {/* Sign message */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
        <h3 className="text-sm font-semibold text-white">Sign Message</h3>
        <p className="mt-1 text-xs text-slate-500">
          Prove wallet ownership — no transaction needed.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type a message…"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
          />
          <button
            onClick={() => signMessage({ message: msgInput || "Hello from Membership Club!" })}
            disabled={signing}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {signing ? "Signing…" : "Sign"}
          </button>
        </div>
        {signature && (
          <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
            <p className="text-xs font-medium text-green-400">Signature</p>
            <p className="mt-1 break-all font-mono text-xs text-green-300/70">
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
    <div className="bg-[#0a0a14]/60 px-6 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold text-white ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}
