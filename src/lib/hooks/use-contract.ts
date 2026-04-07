import { createPublicClient, http } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useWalletClient } from 'wagmi';
import RecruitmentContract from '../contract/recruitment-contract';
import { getFeeParams, type SendTransactionFn } from '../contract/send-transaction';
import { checkNetwork } from '../functions/checkNetwork';

export function useContract(network: string, contractAddress?: string) {
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();

  const networkChain = checkNetwork(network);
  const client = createPublicClient({
    chain: networkChain,
    transport: http(networkChain.rpcUrls.default.http[0]),
  });

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

  const signMessageFn = async (message: string | Uint8Array<ArrayBufferLike>): Promise<string> => {
    if (!walletClient) throw new Error('No wallet available for signing');
    const signature = await walletClient.signMessage({
      message:
        message instanceof Uint8Array ? { raw: message as Uint8Array } : (message as string),
    });
    return signature;
  };

  const callContract = new RecruitmentContract(
    contractAddress || '',
    checkNetwork(network).id,
    sendTx,
    client,
    signMessageFn,
  );

  return callContract;
}
