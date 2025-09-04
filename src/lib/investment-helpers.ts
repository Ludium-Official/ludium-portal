// Investment helper functions for handling ERC20 token approvals and investments
import { ethers } from 'ethers';
import type { InvestmentContract } from './contract/investment-contract';
import notify from './notify';

// Token configurations for different networks
export const TOKEN_CONFIGS = {
  educhain: {
    USDC: {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      decimals: 6,
      name: 'USDC',
    },
    USDT: {
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 6,
      name: 'USDT',
    },
  },
  'base-sepolia': {
    USDC: {
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      decimals: 6,
      name: 'USDC',
    },
  },
  'arbitrum-sepolia': {
    USDC: {
      address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      decimals: 6,
      name: 'USDC',
    },
  },
  sepolia: {
    USDC: {
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      decimals: 6,
      name: 'USDC',
    },
  },
};

export interface InvestmentParams {
  projectId: number;
  amount: string; // Human-readable amount (e.g., "100" for 100 USDC)
  tokenSymbol?: 'USDC' | 'USDT' | 'EDU' | 'ETH'; // Token symbol, EDU and ETH are native
  network: string;
  userAddress: string;
  investmentContract: InvestmentContract;
}

/**
 * Handle investment with automatic token approval for ERC20 tokens
 */
export async function handleInvestment({
  projectId,
  amount,
  tokenSymbol = 'EDU',
  network,
  userAddress,
  investmentContract,
}: InvestmentParams) {
  try {
    // Check if it's a native token investment (EDU or ETH)
    const isNative = tokenSymbol === 'EDU' || tokenSymbol === 'ETH' || !tokenSymbol;

    if (isNative) {
      // Native token investment - simple flow
      const amountWei = ethers.utils.parseEther(amount);

      const result = await investmentContract.investFund({
        projectId,
        amount: amountWei.toString(),
        tokenName: tokenSymbol || 'EDU',
      });

      notify('Investment successful!', 'success');
      return result;
    }

    // ERC20 token investment - check token config
    const networkConfig = TOKEN_CONFIGS[network as keyof typeof TOKEN_CONFIGS];
    if (!networkConfig) {
      throw new Error(`Network ${network} not supported`);
    }

    const tokenConfig = networkConfig[tokenSymbol as keyof typeof networkConfig];
    if (!tokenConfig) {
      throw new Error(`Token ${tokenSymbol} not configured for ${network}`);
    }

    // Convert amount to smallest unit (considering decimals)
    const amountInSmallestUnit = ethers.utils.parseUnits(amount, tokenConfig.decimals);

    try {
      // First, try to invest directly
      const investResult = await investmentContract.investFund({
        projectId,
        amount: amountInSmallestUnit.toString(),
        token: tokenConfig.address,
        tokenName: tokenConfig.name,
        tokenDecimals: tokenConfig.decimals,
        userAddress,
      });

      notify('Investment successful!', 'success');
      return investResult;
    } catch (error) {
      // Check if approval is required
      if (error instanceof Error && error.message === 'TOKEN_APPROVAL_REQUIRED') {
        notify('Token approval required. Please approve the transaction.');

        // Request token approval
        const approvalResult = await investmentContract.approveTokenForInvestment({
          tokenAddress: tokenConfig.address,
          amount: amountInSmallestUnit.toString(),
          tokenName: tokenConfig.name,
          tokenDecimals: tokenConfig.decimals,
        });

        if (approvalResult.approved) {
          notify('Token approved! Now processing investment...');

          // Retry investment after approval
          const investResult = await investmentContract.investFund({
            projectId,
            amount: amountInSmallestUnit.toString(),
            token: tokenConfig.address,
            tokenName: tokenConfig.name,
            tokenDecimals: tokenConfig.decimals,
            userAddress,
          });

          notify('Investment successful!', 'success');
          return investResult;
        }
        throw new Error('Token approval failed');
      }
      // Other errors - re-throw
      throw error;
    }
  } catch (error) {
    console.error('Investment failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // User-friendly error messages
    if (errorMessage.includes('User rejected')) {
      notify('Transaction cancelled', 'error');
    } else if (errorMessage.includes('insufficient funds')) {
      notify('Insufficient funds in your wallet', 'error');
    } else if (errorMessage.includes('Token not whitelisted')) {
      notify('This token is not whitelisted for investments', 'error');
    } else {
      notify(`Investment failed: ${errorMessage}`, 'error');
    }

    throw error;
  }
}

/**
 * Check if user has sufficient token balance
 */
export async function checkTokenBalance(
  userAddress: string,
  tokenAddress: string,
  requiredAmount: string,
  provider: ethers.providers.Provider,
): Promise<boolean> {
  const ERC20_ABI = [
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
  ];

  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await tokenContract.balanceOf(userAddress);
    return balance.gte(requiredAmount);
  } catch (error) {
    console.error('Failed to check token balance:', error);
    return false;
  }
}

/**
 * Format investment amount for display
 */
export function formatInvestmentAmount(
  amount: string,
  decimals: number,
  tokenSymbol: string,
): string {
  try {
    const formatted = ethers.utils.formatUnits(amount, decimals);
    // Remove trailing zeros
    const cleaned = Number.parseFloat(formatted).toString();
    return `${cleaned} ${tokenSymbol}`;
  } catch (_error) {
    return `${amount} ${tokenSymbol}`;
  }
}

/**
 * Validate investment amount
 */
export function validateInvestmentAmount(
  amount: string,
  minAmount = '0',
  maxAmount?: string,
): { valid: boolean; error?: string } {
  try {
    const value = Number.parseFloat(amount);

    if (Number.isNaN(value) || value <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }

    if (minAmount && value < Number.parseFloat(minAmount)) {
      return { valid: false, error: `Minimum investment is ${minAmount}` };
    }

    if (maxAmount && value > Number.parseFloat(maxAmount)) {
      return { valid: false, error: `Maximum investment is ${maxAmount}` };
    }

    return { valid: true };
  } catch (_error) {
    return { valid: false, error: 'Invalid amount' };
  }
}
