"use client";

import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useReadContract,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { formatEther, parseEther } from "viem";
import { MEMBERSHIP_ABI } from "@/lib/abi";

const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as `0x${string}`;
const FALLBACK_FEE = parseEther("0.01");

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const chainId = useChainId();
  const onSepolia = chainId === sepolia.id;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">

      <h1 className="text-4xl font-extrabold text-slate-900">
        Membership Club dApp
      </h1>
      <p className="mt-2 text-slate-500">
        v05 — You can now join the club.
      </p>

      {/* Wrong network banner */}
      {isConnected && !onSepolia && <WrongNetworkBanner />}

      <div className="mt-6 space-y-4">

        {/* Wallet Status */}
        <Card title="Wallet Status">
          {isConnected && address ? (
            <div className="space-y-4">
              <Field label="Address">
                <span className="font-mono text-base text-slate-900">{address}</span>
              </Field>
              <Field label="Network">
                <span className="font-mono text-base text-slate-900">
                  chainId {chainId}{" "}
                  {onSepolia && (
                    <span className="font-semibold text-green-600">(Sepolia ✓)</span>
                  )}
                  {!onSepolia && (
                    <span className="font-semibold text-red-500">(switch to Sepolia)</span>
                  )}
                </span>
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
          {!isConnected || !address ? (
            <p className="text-slate-500">Connect your wallet to check membership.</p>
          ) : !onSepolia ? (
            <p className="text-slate-500">Switch to Sepolia to check your membership.</p>
          ) : (
            <MembershipStatus address={address} />
          )}
        </Card>

      </div>

      <p className="mt-8 text-sm text-slate-400">
        Next part (7): classify errors and show friendly feedback.
      </p>
    </main>
  );
}

/* ── Wrong network banner ── */

function WrongNetworkBanner() {
  const { switchChain, isPending } = useSwitchChain();
  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
      <div>
        <p className="text-sm font-bold text-yellow-800">Wrong Network</p>
        <p className="text-xs text-yellow-600 mt-0.5">
          Your wallet is not on Sepolia. Contract reads and joins are disabled.
        </p>
      </div>
      <button
        onClick={() => switchChain({ chainId: sepolia.id })}
        disabled={isPending}
        className="ml-4 flex-shrink-0 rounded-xl bg-yellow-400 px-4 py-2 text-xs font-bold text-yellow-900 transition hover:bg-yellow-300 active:scale-95 disabled:opacity-60"
      >
        {isPending ? "Switching…" : "Switch to Sepolia"}
      </button>
    </div>
  );
}

/* ── Sub-components ── */

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

  const friendlyError = classifyError(writeError);

  if (isMember) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
        <p className="font-semibold text-green-600">You are a member. Welcome!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-500">
        {isMember === undefined ? "Checking membership status…" : "You are not a member yet."}
      </p>

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
        {(sending || confirming) && <Spinner className="text-white" />}
        {sending ? "Confirm in MetaMask…" : confirming ? "Confirming…" : `Join for ${formatEther(fee)} ETH`}
      </button>

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
          {confirming && <p className="text-xs font-medium text-amber-500">⏳ Waiting for confirmation…</p>}
          {confirmed && <p className="text-xs font-semibold text-green-600">✓ Confirmed!</p>}
        </div>
      )}

      {friendlyError && (
        <FriendlyError
          error={friendlyError}
          onDismiss={() => reset()}
          onRetry={
            friendlyError.retryable
              ? () => { reset(); writeContract({ address: CONTRACT, abi: MEMBERSHIP_ABI, functionName: "join", value: fee }); }
              : undefined
          }
        />
      )}
    </div>
  );
}

/* ── Error types ── */

type ErrorKind = "cancelled" | "funds" | "duplicate" | "reverted" | "unknown";

interface ClassifiedError {
  kind: ErrorKind;
  title: string;
  message: string;
  hint?: string;
  retryable: boolean;
}

function classifyError(err: Error | null): ClassifiedError | null {
  if (!err) return null;
  const msg = err.message.toLowerCase();

  if (msg.includes("user rejected") || msg.includes("user denied"))
    return { kind: "cancelled", title: "Transaction Cancelled", message: "You rejected the transaction in MetaMask.", hint: "Click Join again when you are ready.", retryable: true };

  if (msg.includes("insufficient funds"))
    return { kind: "funds", title: "Insufficient Funds", message: "Your wallet does not have enough ETH to cover the membership fee and gas.", hint: "Top up your Sepolia wallet at a faucet and try again.", retryable: false };

  if (msg.includes("already a member") || msg.includes("already member") || msg.includes("already registered"))
    return { kind: "duplicate", title: "Already a Member", message: "This wallet address is already registered as a member.", retryable: false };

  if (msg.includes("execution reverted"))
    return { kind: "reverted", title: "Contract Reverted", message: "The smart contract rejected the transaction.", hint: "You may already be a member, or the membership fee sent was incorrect.", retryable: true };

  return { kind: "unknown", title: "Transaction Failed", message: (err as { shortMessage?: string }).shortMessage ?? err.message.split("\n")[0], retryable: true };
}

/* ── FriendlyError component ── */

const errorStyles: Record<ErrorKind, { border: string; bg: string; icon: string; titleColor: string; msgColor: string; hintColor: string }> = {
  cancelled: { border: "border-slate-200", bg: "bg-slate-50", icon: "🚫", titleColor: "text-slate-500", msgColor: "text-slate-600", hintColor: "text-slate-400" },
  funds:     { border: "border-yellow-200", bg: "bg-yellow-50", icon: "💰", titleColor: "text-yellow-700", msgColor: "text-yellow-700", hintColor: "text-yellow-500" },
  duplicate: { border: "border-blue-200", bg: "bg-blue-50", icon: "✅", titleColor: "text-blue-700", msgColor: "text-blue-600", hintColor: "text-blue-400" },
  reverted:  { border: "border-red-200", bg: "bg-red-50", icon: "⛔", titleColor: "text-red-600", msgColor: "text-red-700", hintColor: "text-red-400" },
  unknown:   { border: "border-red-200", bg: "bg-red-50", icon: "⚠️", titleColor: "text-red-600", msgColor: "text-red-700", hintColor: "text-red-400" },
};

function FriendlyError({ error, onDismiss, onRetry }: { error: ClassifiedError; onDismiss: () => void; onRetry?: () => void }) {
  const s = errorStyles[error.kind];
  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} px-4 py-4 space-y-2`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{s.icon}</span>
          <p className={`text-sm font-bold ${s.titleColor}`}>{error.title}</p>
        </div>
        <button onClick={onDismiss} className="text-xs font-semibold text-slate-400 underline hover:text-slate-600 flex-shrink-0">
          Dismiss
        </button>
      </div>
      <p className={`text-sm ${s.msgColor}`}>{error.message}</p>
      {error.hint && <p className={`text-xs ${s.hintColor}`}>{error.hint}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-1 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95">
          Try Again
        </button>
      )}
    </div>
  );
}

/* ── Helpers ── */

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
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
