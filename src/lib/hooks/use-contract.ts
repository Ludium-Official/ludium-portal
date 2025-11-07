import { type ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import type { Chain } from 'viem';
import { http, createPublicClient } from 'viem';
import RecruitmentContract from '../contract/recruitment-contract';
import { checkNetwork } from '../functions/checkNetwork';

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

export function useContract(network: string, contractAddress?: string) {
  const { user, sendTransaction } = usePrivy();

  const { wallets } = useWallets();
  const currentWallet = wallets.find((wallet) => wallet.address === user?.wallet?.address);

  const isExternalWallet = user?.wallet?.connectorType && user.wallet.connectorType !== 'embedded';

  let sendTx = sendTransaction;

  const activeWallet =
    currentWallet || (isExternalWallet && wallets.length > 0 ? wallets[0] : null);

  if (isExternalWallet && activeWallet) {
    sendTx = async (input, _uiOptions?: unknown) => {
      try {
        const signer = await getSigner(checkNetwork(network), activeWallet);
        const txResponse = await signer.sendTransaction(input);

        return { hash: txResponse.hash as `0x${string}` };
      } catch (error) {
        console.error('Error sending transaction with external wallet:', error);
        throw error;
      }
    };
  } else if (isExternalWallet && !activeWallet) {
    console.warn('User has an external wallet but no active wallet found. Transactions may fail.');
    sendTx = async () => {
      throw new Error(
        'External wallet detected but not properly connected. Please reconnect your wallet.',
      );
    };
  } else if (!user?.wallet) {
    sendTx = async () => {
      throw new Error('No wallet connected. Please connect a wallet to continue.');
    };
  }

  const signMessageFn = async (
    message: string | Uint8Array<ArrayBufferLike>,
    wallet?: ConnectedWallet,
  ): Promise<string> => {
    const targetWallet = wallet || activeWallet;
    if (!targetWallet) {
      throw new Error('No wallet available for signing');
    }

    try {
      const eip1193Provider = await targetWallet.getEthereumProvider();
      const provider = new ethers.providers.Web3Provider(eip1193Provider);
      const signer = provider.getSigner();

      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  const client = createPublicClient({
    chain: checkNetwork(network),
    transport: http(checkNetwork(network).rpcUrls.default.http[0]),
  });

  const callContract = new RecruitmentContract(
    contractAddress || '',
    checkNetwork(network).id,
    sendTx,
    client,
    signMessageFn,
  );

  return callContract;
}
