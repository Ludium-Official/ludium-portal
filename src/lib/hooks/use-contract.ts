import { type ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import type { Chain, PublicClient } from 'viem';
import { http, createPublicClient } from 'viem';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  eduChain,
  eduChainTestnet,
} from 'viem/chains';
import ChainContract from '../contract';

async function getSigner(checkNetwork: Chain, currentWallet: ConnectedWallet) {
  const eip1193Provider = await currentWallet.getEthereumProvider();

  const provider = new ethers.providers.Web3Provider(eip1193Provider);

  const targetNetwork = {
    chainId: `0x${checkNetwork.id.toString(16)}`,
    chainName: checkNetwork.name,
    rpcUrls: checkNetwork.rpcUrls.default.http,
    nativeCurrency: checkNetwork.nativeCurrency,
  };
  const currentChainId = await eip1193Provider.request({
    method: 'eth_chainId',
  });

  if (currentChainId !== targetNetwork.chainId) {
    await eip1193Provider.request({
      method: 'wallet_addEthereumChain',
      params: [targetNetwork],
    });
  }

  return provider.getSigner();
}

export function useContract(network: string) {
  const { user, sendTransaction } = usePrivy();

  const { wallets } = useWallets();
  const currentWallet = wallets.find((wallet) => wallet.address === user?.wallet?.address);

  // Check if the user is using an external wallet (like MetaMask)
  const injectedWallet = user?.wallet?.connectorType !== 'embedded';
  let sendTx = sendTransaction;

  // If no currentWallet found but user has a wallet, try to use the first available wallet
  const activeWallet = currentWallet || (injectedWallet && wallets.length > 0 ? wallets[0] : null);

  const checkNetwork: Chain = (() => {
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

    return eduChain;
  })();

  if (injectedWallet && activeWallet) {
    sendTx = async (input) => {
      const signer = await getSigner(checkNetwork, activeWallet);
      const txResponse = await signer.sendTransaction(input);
      return { hash: txResponse.hash as `0x${string}` };
    };
  } else if (injectedWallet && !activeWallet) {
    console.warn('User has an external wallet but no active wallet found. Transactions may fail.');
  }

  const checkContract = (() => {
    if (network === 'base' || network === 'base-sepolia') {
      return import.meta.env.VITE_BASE_CONTRACT_ADDRESS;
    }
    if (network === 'arbitrum' || network === 'arbitrum-sepolia') {
      return import.meta.env.VITE_ARBITRUM_CONTRACT_ADDRESS;
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
