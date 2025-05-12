import { usePublishProgramMutation } from "@/apollo/mutation/publish-program.generated";
import contractJson from "@/lib/contract/contract.json";
import { Program } from "@/types/types.generated";
import type {
  TransactionError,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { ethers } from "ethers";
import type { ContractFunctionParameters } from "viem";
import { baseSepolia } from "wagmi/chains";

export default function TransactionWrapper({
  program,
  buttonText,
}: {
  program: Program;
  buttonText?: string;
}) {
  const [publishProgram] = usePublishProgramMutation();

  const price = ethers.utils.parseEther(program.price || "0");
  const startTime = Math.floor(Math.floor(Date.now()) / 1000);
  const endTime = Math.floor(
    Math.floor(new Date(program.deadline).getTime()) / 1000
  );

  const contracts = [
    {
      address: import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS,
      abi: contractJson.abi,
      functionName: "createEduProgram",
      args: [
        program.name,
        price,
        startTime,
        endTime,
        program.validator?.wallet?.address,
      ],
      value: price.toString(),
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  const handleSuccess = async (response: TransactionResponse) => {
    try {
      const receipt = response.transactionReceipts[0];
      const txHash = receipt.transactionHash;

      const eventSignature = ethers.utils.id(
        "ProgramCreated(uint256,address,address,uint256)"
      );

      const event = receipt.logs.find(
        (log) => log.topics[0] === eventSignature
      );

      if (event) {
        const programId = ethers.BigNumber.from(event.topics[1]).toNumber();

        await publishProgram({
          variables: {
            id: program.id ?? "",
            educhainProgramId: programId,
            txHash,
          },
        });

        console.log("Program published successfully");
      } else {
        console.error("ProgramCreated 이벤트를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Error processing transaction success:", error);
    }
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
          className="bg-[#B331FF] hover:bg-[#B331FF]/90 mt-0 mr-auto ml-auto max-w-full text-white"
          text={buttonText}
        />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
