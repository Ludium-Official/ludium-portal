import { defineChain } from "viem";

export const tokenAddresses = {
  base: [
    {
      name: "USDT",
      address: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
      decimal: 6,
    },
    {
      name: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimal: 6,
    },
  ],
  "base-sepolia": [
    {
      name: "USDT",
      address: "0x73b4a58138cccbda822df9449feda5eac6669ebd",
      decimal: 6,
    },
    {
      name: "USDC",
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      decimal: 6,
    },
  ],
  arbitrum: [
    {
      name: "USDT",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimal: 6,
    },
    {
      name: "USDC",
      address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
      decimal: 6,
    },
  ],
  "arbitrum-sepolia": [
    {
      name: "USDT",
      address: "0xe5b6c29411b3ad31c3613bba0145293fc9957256",
      decimal: 6,
    },
    {
      name: "USDC",
      address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      decimal: 6,
    },
  ],
  educhain: [
    {
      name: "USDT",
      address: "0x7277cc818e3f3ffbb169c6da9cc77fc2d2a34895",
      decimal: 6,
    },
    {
      name: "USDC",
      address: "0x836d275563bab5e93fd6ca62a95db7065da94342",
      decimal: 6,
    },
  ],
  "educhain-testnet": [
    {
      name: "USDT",
      address: "0x3BfB66999C22c0189B0D837D12D5A4004844EC12",
      decimal: 6,
    },
    {
      name: "USDC",
      address: "0x19EeaDcBA1801Afec43e87Cefcd4239E13fc294d",
      decimal: 6,
    },
  ],
  coredao: [],
  "coredao-testnet": [],
};

export const coreDaoTestnet = /*#__PURE__*/ defineChain({
  id: 1114,
  name: "Core Dao Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "tCore2",
    symbol: "tCORE2",
  },
  rpcUrls: {
    default: { http: ["https://rpc.test2.btcs.network"] },
  },
  blockExplorers: {
    default: {
      name: "CoreDao Testnet",
      url: "https://scan.test2.btcs.network",
    },
  },
  contracts: {},
  testnet: true,
});
