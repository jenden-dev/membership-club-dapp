"use client";

import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { sepolia } from "wagmi/chains";

export function WalletCard() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address, chainId: sepolia.id });
  const { data: blockNumber } = useBlockNumber({ chainId: sepolia.id, watch: true });

  if (!isConnected || !address) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
        No wallet connected.
      </div>
    );
  }

  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
  const ethBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : "—";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Card top bar */}
      <div className="bg-indigo-600 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-200">
          Member Wallet
        </p>
        <p className="mt-2 font-mono text-lg font-semibold text-white break-all">
          {address}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
        <Stat label="Short Address" value={short} mono />
        <Stat label="Network" value={chain?.name ?? "Unknown"} />
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100">
        <Stat label="Balance" value={ethBalance} />
        <Stat
          label="Latest Block"
          value={blockNumber !== undefined ? `#${blockNumber.toLocaleString()}` : "…"}
        />
      </div>

      {/* Status footer */}
      <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-3">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="text-xs text-slate-500">Connected · Membership active</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-6 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}
