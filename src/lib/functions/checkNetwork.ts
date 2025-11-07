import type { Chain } from 'viem';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  creditCoin3Mainnet,
  eduChain,
  eduChainTestnet,
} from 'viem/chains';

export const checkNetwork = (network: string): Chain => {
  if (network === 'base') {
    return base;
  }
  if (network === 'base-sepolia') {
    return baseSepolia;
  }
  if (network === 'educhain-testnet') {
    return eduChainTestnet;
  }
  if (network === 'arbitrum') {
    return arbitrum;
  }
  if (network === 'arbitrum-sepolia') {
    return arbitrumSepolia;
  }
  if (network === 'creditcoin') {
    return creditCoin3Mainnet;
  }

  return eduChain;
};
