import type { PublicClient } from 'viem';
import { http, createPublicClient } from 'viem';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  creditCoin3Mainnet,
  eduChain,
  eduChainTestnet,
} from 'viem/chains';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import {
  InvestmentContract,
  type InvestmentContractAddresses,
} from '../contract/investment-contract';
import { getFeeParams, type SendTransactionFn } from '../contract/send-transaction';

// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<string, InvestmentContractAddresses> = {
  sepolia: {
    core: import.meta.env.VITE_SEPOLIA_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_SEPOLIA_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_SEPOLIA_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_SEPOLIA_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
  'arbitrum-sepolia': {
    core: import.meta.env.VITE_ARBITRUM_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_ARBITRUM_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_ARBITRUM_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_ARBITRUM_INVESTMENT_TIMELOCK_ADDRESS || '',
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
  arbitrum: {
    core: import.meta.env.VITE_ARBITRUM_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_ARBITRUM_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_ARBITRUM_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_ARBITRUM_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
  base: {
    core: import.meta.env.VITE_BASE_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_BASE_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_BASE_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_BASE_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
  creditcoin: {
    core: import.meta.env.VITE_CREDITCOIN_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_CREDITCOIN_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_CREDITCOIN_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_CREDITCOIN_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
};

function getChain(network: string | null) {
  switch (network) {
    case 'sepolia':
      return {
        id: 11155111,
        name: 'Sepolia',
        nativeCurrency: { decimals: 18, name: 'Sepolia Ether', symbol: 'SEP' },
        rpcUrls: {
          default: { http: ['https://sepolia.infura.io/v3/'] },
          public: { http: ['https://rpc.sepolia.org'] },
        },
        blockExplorers: {
          default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
        },
        testnet: true,
      } as const;
    case 'base':
      return base;
    case 'base-sepolia':
      return baseSepolia;
    case 'educhain-testnet':
      return eduChainTestnet;
    case 'arbitrum':
      return arbitrum;
    case 'arbitrum-sepolia':
      return arbitrumSepolia;
    case 'creditcoin':
      return creditCoin3Mainnet;
    default:
      return eduChain;
  }
}

export function useInvestmentContract(network: string | null = null) {
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();

  const networkChain = getChain(network);
  const contractAddresses =
    CONTRACT_ADDRESSES[network || 'educhain-testnet'] || CONTRACT_ADDRESSES['educhain-testnet'];

  const client: PublicClient = createPublicClient({
    chain: networkChain,
    transport: http(networkChain.rpcUrls.default.http[0]),
  }) as PublicClient;

  const sendTx: SendTransactionFn = async (input) => {
    if (!address) throw new Error('No wallet connected. Please connect a wallet to continue.');
    if (input.chainId) {
      await switchChainAsync({ chainId: input.chainId });
    }
    const feeParams = await getFeeParams(client);
    const hash = await sendTransactionAsync({
      ...(input as Parameters<typeof sendTransactionAsync>[0]),
      ...feeParams,
    });
    return { hash: hash as `0x${string}` };
  };

  const chainId = networkChain.id;

  return new InvestmentContract(contractAddresses, sendTx, client, chainId);
}

// Non-hook version for use in event handlers
export function getInvestmentContract(
  network: string,
  sendTransaction: SendTransactionFn,
  client: PublicClient,
  userAddress?: string,
) {
  const contractAddresses =
    CONTRACT_ADDRESSES[network || 'educhain-testnet'] || CONTRACT_ADDRESSES['educhain-testnet'];

  const chainIdMap: Record<string, number> = {
    'educhain-testnet': eduChainTestnet.id,
    'base-sepolia': baseSepolia.id,
    'arbitrum-sepolia': arbitrumSepolia.id,
    sepolia: 11155111,
    educhain: eduChain.id,
    arbitrum: arbitrum.id,
    base: base.id,
    creditcoin: creditCoin3Mainnet.id,
  };

  const chainId = chainIdMap[network] || chainIdMap['educhain-testnet'];

  return new InvestmentContract(contractAddresses, sendTransaction, client, chainId, userAddress);
}
