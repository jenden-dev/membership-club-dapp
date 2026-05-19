"use client";

import { useAccount, useBalance, useConnect, useReadContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { formatEther } from "viem";
import { MEMBERSHIP_ABI } from "@/lib/abi";

const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as `0x${string}`;

export default function HomePage() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending } = useConnect();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">

      {/* Page title */}
      <h1 className="text-4xl font-extrabold text-slate-900">
        Membership Club dApp
      </h1>
      <p className="mt-2 text-slate-500">
        v04 — Reading live data from the MembershipClub contract.
      </p>

      <div className="mt-8 space-y-4">

        {/* Wallet Status */}
        <Card title="Wallet Status">
          {isConnected && address ? (
            <div className="space-y-4">
              <Field label="Address">
                <span className="font-mono text-base text-slate-900">{address}</span>
              </Field>
              <Field label="Network">
                <NetworkDisplay chain={chain} />
              </Field>
              <Field label="Balance">
                <BalanceDisplay address={address} />
              </Field>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-slate-500">No wallet connected.</p>
              <button
                onClick={() => connect({ connector: injected() })}
                disabled={isPending}
                className="w-fit rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-60"
              >
                {isPending ? "Connecting…" : "Connect MetaMask"}
              </button>
            </div>
          )}
        </Card>

        {/* Club Stats */}
        <Card title="Club Stats">
          <div className="grid grid-cols-2 gap-8">
            <Field label="Membership Fee">
              <MembershipFee />
            </Field>
            <Field label="Total Members">
              <TotalMembers />
            </Field>
          </div>
        </Card>

        {/* My Membership */}
        <Card title="My Membership">
          {isConnected && address ? (
            <MembershipStatus address={address} />
          ) : (
            <p className="text-slate-500">Connect your wallet to check membership.</p>
          )}
        </Card>

      </div>

      {/* Footer hint */}
      <p className="mt-8 text-sm text-indigo-500">
        Next part (5): add a Join button that sends a transaction.
      </p>
    </main>
  );
}

/* ── Sub-components ── */

function NetworkDisplay({ chain }: { chain: { id: number; name: string } | undefined }) {
  const onSepolia = chain?.id === sepolia.id;
  return (
    <span className="font-mono text-base text-slate-900">
      chainId {chain?.id ?? "—"}{" "}
      {onSepolia && (
        <span className="text-green-600 font-semibold">(Sepolia ✓)</span>
      )}
    </span>
  );
}

function BalanceDisplay({ address }: { address: `0x${string}` }) {
  const { data } = useBalance({ address, chainId: sepolia.id });
  return (
    <span className="font-mono text-base text-slate-900">
      {data ? data.formatted + " ETH" : "…"}
    </span>
  );
}

function MembershipFee() {
  const { data } = useReadContract({
    address: CONTRACT,
    abi: MEMBERSHIP_ABI,
    functionName: "membershipFee",
    chainId: sepolia.id,
  });
  return (
    <span className="font-mono text-base text-slate-900">
      {data !== undefined ? formatEther(data) + " ETH" : "…"}
    </span>
  );
}

function TotalMembers() {
  const { data } = useReadContract({
    address: CONTRACT,
    abi: MEMBERSHIP_ABI,
    functionName: "memberCount",
    chainId: sepolia.id,
  });
  return (
    <span className="font-mono text-base text-slate-900">
      {data !== undefined ? data.toString() : "…"}
    </span>
  );
}

function MembershipStatus({ address }: { address: `0x${string}` }) {
  const { data: isMember } = useReadContract({
    address: CONTRACT,
    abi: MEMBERSHIP_ABI,
    functionName: "isMember",
    args: [address],
    chainId: sepolia.id,
  });

  if (isMember === undefined) {
    return <p className="text-slate-500">Checking membership…</p>;
  }

  if (isMember) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
        <p className="font-semibold text-green-600">You are a member. Welcome!</p>
      </div>
    );
  }

  return (
    <p className="text-slate-500">
      You are not a member yet. Writing to the contract comes in v05.
    </p>
  );
}

/* ── Layout helpers ── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
