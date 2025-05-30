import { usePrivy } from '@privy-io/react-auth';
import type { PublicClient } from 'viem';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia, eduChain, eduChainTestnet } from 'viem/chains';
import ChainContract from '../contract';

export function useContract(network: string) {
  const { sendTransaction } = usePrivy();

  const checkNetwork = (() => {
    if (network === 'base') {
      return base;
    } else if (network === 'base-sepolia') {
      return baseSepolia;
    } else if (network === 'educhain-testnet') {
      return eduChainTestnet;
    }

    return eduChain;
  })();

  const checkContract = (() => {
    if (network === 'base' || network === 'base-sepolia') {
      return import.meta.env.VITE_BASE_CONTRACT_ADDRESS;
    }

    return import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS;
  })();

  // @ts-ignore
  const client: PublicClient = createPublicClient({
    chain: checkNetwork,
    transport: http(checkNetwork.rpcUrls.default.http[0]),
  });

  const callContract = new ChainContract(checkContract, checkNetwork.id, sendTransaction, client);

  return callContract;
}
