import contractJson from '@/lib/contract/contract.json';
import type { TransactionError, TransactionResponse } from '@coinbase/onchainkit/transaction';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { ContractFunctionParameters } from 'viem';
import { baseSepolia } from 'viem/chains';

export default function TransactionWrapper({
  handleSuccess,
  functionName,
  args,
  buttonText,
}: {
  handleSuccess: (response: TransactionResponse) => Promise<void>;
  functionName: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  args: any;
  buttonText?: string;
}) {
  const contracts = [
    {
      address: import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS,
      abi: contractJson.abi,
      functionName,
      ...args,
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  return (
    <div className="flex">
      <Transaction
        contracts={contracts}
        chainId={baseSepolia.id}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton
          className="bg-primary hover:bg-primary/90 mt-0 mr-auto ml-auto max-w-full text-white"
          text={buttonText || 'Execute'}
        />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
