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
import {
  InvestmentContract,
  type InvestmentContractAddresses,
} from '../contract/investment-contract';

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

// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<string, InvestmentContractAddresses> = {
  sepolia: {
    core: import.meta.env.VITE_SEPOLIA_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_SEPOLIA_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_SEPOLIA_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_SEPOLIA_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
  'educhain-testnet': {
    core: import.meta.env.VITE_EDUCHAIN_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_EDUCHAIN_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_EDUCHAIN_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_EDUCHAIN_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
  'base-sepolia': {
    core: import.meta.env.VITE_BASE_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_BASE_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_BASE_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_BASE_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
  // Add more networks as needed
};

export function useInvestmentContract(network: string | null = null) {
  const { user, sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  const currentWallet = wallets.find((wallet) => wallet.address === user?.wallet?.address);

  const injectedWallet = user?.wallet?.connectorType !== 'embedded';
  let sendTx = sendTransaction;

  const checkNetwork: Chain = (() => {
    if (network === 'sepolia') {
      return {
        id: 11155111,
        name: 'Sepolia',
        network: 'sepolia',
        nativeCurrency: {
          decimals: 18,
          name: 'Sepolia Ether',
          symbol: 'SEP',
        },
        rpcUrls: {
          default: {
            http: ['https://sepolia.infura.io/v3/'],
          },
          public: {
            http: ['https://rpc.sepolia.org'],
          },
        },
        blockExplorers: {
          default: {
            name: 'Etherscan',
            url: 'https://sepolia.etherscan.io',
          },
        },
        testnet: true,
      } as const;
    }
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

  if (injectedWallet && currentWallet) {
    sendTx = async (input) => {
      const signer = await getSigner(checkNetwork, currentWallet);
      const txResponse = await signer.sendTransaction(input);
      return { hash: txResponse.hash as `0x${string}` };
    };
  }

  const contractAddresses =
    CONTRACT_ADDRESSES[network || 'educhain-testnet'] || CONTRACT_ADDRESSES['educhain-testnet'];

  // @ts-ignore
  const client: PublicClient = createPublicClient({
    chain: checkNetwork,
    transport: http(checkNetwork.rpcUrls.default.http[0]),
  });

  const investmentContract = new InvestmentContract(
    contractAddresses,
    checkNetwork.id,
    sendTx,
    client,
  );

  return investmentContract;
}

// Non-hook version for use in event handlers
export function getInvestmentContract(
  network: string,
  sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'],
  client: PublicClient,
) {
  const contractAddresses =
    CONTRACT_ADDRESSES[network || 'educhain-testnet'] || CONTRACT_ADDRESSES['educhain-testnet'];

  return new InvestmentContract(
    contractAddresses,
    getChainIdForNetwork(network),
    sendTransaction,
    client,
  );
}

function getChainIdForNetwork(network: string): number {
  const chainMap: Record<string, number> = {
    sepolia: 11155111,
    base: 8453,
    'base-sepolia': 84532,
    'educhain-testnet': 656476,
    educhain: 41923,
    arbitrum: 42161,
    'arbitrum-sepolia': 421614,
  };

  return chainMap[network] || 656476; // Default to EduChain testnet
}
