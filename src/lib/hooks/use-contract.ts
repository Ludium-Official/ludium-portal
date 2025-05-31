import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import type { PublicClient } from 'viem';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia, eduChain, eduChainTestnet } from 'viem/chains';
import ChainContract from '../contract';

async function getSigner(checkNetwork: any) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const targetNetwork = {
    chainId: '0x' + checkNetwork.id.toString(16),
    chainName: checkNetwork.name,
    rpcUrls: checkNetwork.rpcUrls.default.http,
    nativeCurrency: checkNetwork.nativeCurrency,
  };
  const currentChainId = await window.ethereum.request({
    method: 'eth_chainId',
  });

  if (currentChainId !== targetNetwork.chainId) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [targetNetwork],
    });
  }

  return signer;
}

export function useContract(network: string) {
  const { user, sendTransaction } = usePrivy();
  const injectedWallet = user?.wallet?.connectorType === 'injected';
  let sendTx = sendTransaction;

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

  if (injectedWallet) {
    sendTx = async (input) => {
      const signer = await getSigner(checkNetwork);
      const transactionResponse = await signer.sendTransaction(input);
      return { hash: transactionResponse.hash as `0x${string}` };
    };
  }

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

  const callContract = new ChainContract(checkContract, checkNetwork.id, sendTx, client);

  return callContract;
}
