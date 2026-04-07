import type { PublicClient } from 'viem';

export type SendTransactionFn = (params: {
  to?: `0x${string}`;
  data?: `0x${string}`;
  value?: bigint;
  chainId?: number;
  gas?: bigint;
}) => Promise<{ hash: `0x${string}` }>;

/**
 * Returns explicit EIP-1559 fee params derived from the latest block's baseFeePerGas.
 * Setting both maxFeePerGas and maxPriorityFeePerGas prevents wagmi/viem from calling
 * eth_feeHistory, which can return astronomical values on some chains (e.g. EduChain).
 */
export async function getFeeParams(
  client: PublicClient,
): Promise<{ maxFeePerGas?: bigint; maxPriorityFeePerGas?: bigint }> {
  try {
    const block = await client.getBlock({ blockTag: 'latest' });
    if (block.baseFeePerGas != null) {
      return {
        maxFeePerGas: block.baseFeePerGas * 2n + 1_000_000n,
        maxPriorityFeePerGas: 1_000_000n,
      };
    }
  } catch {
    // ignore — fall through to fallback
  }
  // Fallback: only set priority fee; let wagmi estimate maxFeePerGas
  return { maxPriorityFeePerGas: 1_000_000n };
}
