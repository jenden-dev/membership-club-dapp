"use client";

import { useAccount, useBlockNumber } from "wagmi";
import { sepolia } from "wagmi/chains";

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-4xl font-bold">Membership Club dApp</h1>
      <p className="mt-4 text-slate-600">
        v03 — Wallet connection added with RainbowKit.
      </p>

      <RpcStatus />

      {isConnected ? (
        <MemberBadge />
      ) : (
        <p className="mt-8 text-sm text-slate-500">
          Connect your wallet in the header to access the members area. No
          account or database required.
        </p>
      )}
    </main>
  );
}

function RpcStatus() {
  const { data: blockNumber } = useBlockNumber({
    chainId: sepolia.id,
    watch: true,
  });

  return (
    <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">RPC Status</h2>
      <p className="mt-1 text-sm text-slate-500">Current Sepolia block:</p>
      <p className="mt-1 text-2xl font-bold">
        {blockNumber !== undefined ? blockNumber.toLocaleString() : "…"}
      </p>
    </section>
  );
}

function MemberBadge() {
  const { address } = useAccount();
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
      Logged in as <span className="font-mono font-semibold">{short}</span> —
      membership active.
    </div>
  );
}
