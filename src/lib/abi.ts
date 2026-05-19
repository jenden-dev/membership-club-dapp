export const MEMBERSHIP_ABI = [
  {
    name: "membershipFee",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "memberCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "isMember",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "join",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
] as const;
