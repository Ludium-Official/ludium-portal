import { type ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import type { Chain, PublicClient } from 'viem';
import { createPublicClient, http } from 'viem';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  creditCoin3Mainnet,
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

  const injectedWallet = user?.wallet?.connectorType !== 'embedded';
  let sendTx = sendTransaction;

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
    if (network === 'creditcoin') {
      return creditCoin3Mainnet;
    }

    return eduChain;
  })();

  if (injectedWallet && currentWallet) {
    sendTx = async (input) => {
      const signer = await getSigner(checkNetwork, currentWallet);
      const txResponse = await signer.sendTransaction(input);
      return { hash: txResponse.hash as `0x${string}` };
    };
  }

  const checkContract = (() => {
    if (network === 'base' || network === 'base-sepolia') {
      return import.meta.env.VITE_BASE_CONTRACT_ADDRESS;
    }
    if (network === 'arbitrum' || network === 'arbitrum-sepolia') {
      return import.meta.env.VITE_ARBITRUM_CONTRACT_ADDRESS;
    }
    if (network === 'creditcoin') {
      return import.meta.env.VITE_CREDITCOIN_CONTRACT_ADDRESS;
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
