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
  'arbitrum-sepolia': {
    // Arbitrum Sepolia uses the same addresses as defined in .env
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
    // Base mainnet - needs to be configured
    core: import.meta.env.VITE_BASE_MAINNET_INVESTMENT_CORE_ADDRESS || '',
    funding: import.meta.env.VITE_BASE_MAINNET_INVESTMENT_FUNDING_ADDRESS || '',
    milestone: import.meta.env.VITE_BASE_MAINNET_INVESTMENT_MILESTONE_ADDRESS || '',
    timeLock: import.meta.env.VITE_BASE_MAINNET_INVESTMENT_TIMELOCK_ADDRESS || '',
  },
  // Add more networks as needed
};

export function useInvestmentContract(network: string | null = null) {
  const { user, sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  const currentWallet = wallets.find((wallet) => wallet.address === user?.wallet?.address);

  // Check if the user is using an external wallet (like MetaMask)
  // External wallets have connectorType like 'injected', 'wallet_connect', etc.
  // Only 'embedded' wallets are Privy's internal wallets
  const isExternalWallet = user?.wallet?.connectorType && user.wallet.connectorType !== 'embedded';

  let sendTx = sendTransaction;

  // If no currentWallet found but user has a wallet, try to use the first available wallet
  const activeWallet =
    currentWallet || (isExternalWallet && wallets.length > 0 ? wallets[0] : null);

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

  if (isExternalWallet && activeWallet) {
    console.log('Using external wallet for investment transactions:', activeWallet.address);
    sendTx = async (input, _uiOptions?: unknown) => {
      // Note: _uiOptions is ignored for external wallets since they use their own UI
      try {
        console.log('Sending investment transaction with external wallet...', input);
        const signer = await getSigner(checkNetwork, activeWallet);
        const txResponse = await signer.sendTransaction(input);
        console.log('Investment transaction sent successfully:', txResponse.hash);
        return { hash: txResponse.hash as `0x${string}` };
      } catch (error) {
        console.error('Error sending investment transaction with external wallet:', error);
        throw error;
      }
    };
  } else if (isExternalWallet && !activeWallet) {
    console.warn('User has an external wallet but no active wallet found. Transactions may fail.');
    // Throw a more helpful error
    sendTx = async () => {
      throw new Error(
        'External wallet detected but not properly connected. Please reconnect your wallet.',
      );
    };
  } else if (!user?.wallet) {
    sendTx = async () => {
      throw new Error('No wallet connected. Please connect a wallet to continue.');
    };
  } else {
  }

  const contractAddresses =
    CONTRACT_ADDRESSES[network || 'educhain-testnet'] || CONTRACT_ADDRESSES['educhain-testnet'];

  // @ts-ignore
  const client: PublicClient = createPublicClient({
    chain: checkNetwork,
    transport: http(checkNetwork.rpcUrls.default.http[0]),
  });

  // Get chain ID for the network
  const chainId = checkNetwork.id;

  const investmentContract = new InvestmentContract(contractAddresses, sendTx, client, chainId);

  return investmentContract;
}

// Non-hook version for use in event handlers
export function getInvestmentContract(
  network: string,
  sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'],
  client: PublicClient,
  userAddress?: string,
) {
  const contractAddresses =
    CONTRACT_ADDRESSES[network || 'educhain-testnet'] || CONTRACT_ADDRESSES['educhain-testnet'];

  // Get chain ID for the network
  const chainIdMap: Record<string, number> = {
    'educhain-testnet': 656476,
    'base-sepolia': 84532,
    'arbitrum-sepolia': 421614,
    sepolia: 11155111,
  };

  const chainId = chainIdMap[network] || chainIdMap['educhain-testnet'];

  return new InvestmentContract(contractAddresses, sendTransaction, client, chainId, userAddress);
}
