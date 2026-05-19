# Snapshot v01 — Stack Setup

**Part:** 1 Frontend App Stack
**Status:** Fresh Next.js project. All web3 dependencies installed but not yet wired.

## What's in this snapshot

- Next.js 14 App Router with TypeScript and Tailwind
- `wagmi`, `viem`, `@rainbow-me/rainbowkit`, `@tanstack/react-query` in `package.json`
- A static landing page at `/` listing the stack
- Zero web3 logic yet. No providers. No hooks. No contract.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. You should see the landing page.

## What changes next (v02)

We'll add `wagmi.config.ts`, wrap the app in `WagmiProvider` + `QueryClientProvider`, and configure the Sepolia RPC transport.
