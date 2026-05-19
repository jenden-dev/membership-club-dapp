"use client";

import {
  useAccount,
  useBalance,
  useConnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { formatEther, parseEther } from "viem";
import { MEMBERSHIP_ABI } from "@/lib/abi";

const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as `0x${string}`;

// Fallback fee if contract read fails
const FALLBACK_FEE = parseEther("0.01");

export default function HomePage() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending } = useConnect();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">

      <h1 className="text-4xl font-extrabold text-slate-900">
        Membership Club dApp
      </h1>
      <p className="mt-2 text-slate-500">
        v05 — You can now join the club.
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

      <p className="mt-8 text-sm text-slate-400">
        Next part (7): classify errors and show friendly feedback.
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
        <span className="font-semibold text-green-600">(Sepolia ✓)</span>
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
  const fee = data ?? FALLBACK_FEE;
  return (
    <span className="font-mono text-base text-slate-900">
      {formatEther(fee)} ETH
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
  const { data: feeData } = useReadContract({
    address: CONTRACT,
    abi: MEMBERSHIP_ABI,
    functionName: "membershipFee",
    chainId: sepolia.id,
  });

  const fee = feeData ?? FALLBACK_FEE;

  const { data: isMember, refetch } = useReadContract({
    address: CONTRACT,
    abi: MEMBERSHIP_ABI,
    functionName: "isMember",
    args: [address],
    chainId: sepolia.id,
  });

  const {
    writeContract,
    data: txHash,
    isPending: sending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: confirming, isSuccess: confirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  if (confirmed) refetch();

  // Classify the error into a friendly message
  const friendlyError = classifyError(writeError);

  if (isMember === undefined) {
    return <p className="text-slate-500">Checking membership…</p>;
  }

  if (isMember) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          <p className="font-semibold text-green-600">You are a member. Welcome!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-500">You are not a member yet.</p>

      {/* Join button */}
      <button
        onClick={() => {
          reset();
          writeContract({
            address: CONTRACT,
            abi: MEMBERSHIP_ABI,
            functionName: "join",
            value: fee,
          });
        }}
        disabled={sending || confirming}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-60"
      >
        {(sending || confirming) && <Spinner />}
        {sending
          ? "Confirm in MetaMask…"
          : confirming
          ? "Confirming…"
          : `Join for ${formatEther(fee)} ETH`}
      </button>

      {/* Tx hash */}
      {txHash && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Transaction</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all font-mono text-xs text-indigo-600 hover:underline"
          >
            {txHash}
          </a>
          {confirming && (
            <p className="text-xs font-medium text-amber-500">⏳ Waiting for block confirmation…</p>
          )}
          {confirmed && (
            <p className="text-xs font-semibold text-green-600">✓ Confirmed!</p>
          )}
        </div>
      )}

      {/* Friendly error */}
      {friendlyError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-red-500">
              {friendlyError.title}
            </p>
            <button
              onClick={() => reset()}
              className="text-xs font-semibold text-red-400 underline hover:text-red-600"
            >
              Dismiss
            </button>
          </div>
          <p className="text-sm text-red-700">{friendlyError.message}</p>
        </div>
      )}
    </div>
  );
}

/* ── Error classifier ── */

function classifyError(err: Error | null): { title: string; message: string } | null {
  if (!err) return null;
  const msg = err.message.toLowerCase();

  if (msg.includes("user rejected") || msg.includes("user denied"))
    return { title: "Cancelled", message: "You rejected the transaction in MetaMask." };

  if (msg.includes("insufficient funds"))
    return { title: "Insufficient Funds", message: "Your wallet doesn't have enough ETH to cover the fee + gas." };

  if (msg.includes("already a member") || msg.includes("already member"))
    return { title: "Already a Member", message: "This address is already registered as a member." };

  if (msg.includes("execution reverted"))
    return { title: "Contract Reverted", message: "The contract rejected the transaction. You may already be a member or the fee is incorrect." };

  return {
    title: "Transaction Error",
    message: (err as { shortMessage?: string }).shortMessage ?? err.message.split("\n")[0],
  };
}

/* ── Helpers ── */

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

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
