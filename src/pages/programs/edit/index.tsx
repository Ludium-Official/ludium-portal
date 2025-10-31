import client from "@/apollo/client";
import { useCreateProgramWithOnchainV2Mutation } from "@/apollo/mutation/create-program-with-onchain-v2.generated";
import { useUpdateProgramV2Mutation } from "@/apollo/mutation/update-program-v2.generated";
import { GetProgramV2Document } from "@/apollo/queries/program-v2.generated";
import { GetProgramsV2Document } from "@/apollo/queries/programs-v2.generated";
import ProgramForm from "@/components/program/program-form/program-form";
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import { OnSubmitProgramFunc } from "@/types/recruitment";
import {
  OnchainProgramStatusV2,
  ProgramStatusV2,
  ProgramVisibilityV2,
} from "@/types/types.generated";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const EditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoggedIn, isAuthed } = useAuth();
  const [createProgram] = useCreateProgramWithOnchainV2Mutation();
  const [updateProgram, { loading }] = useUpdateProgramV2Mutation();

  const onSubmit: OnSubmitProgramFunc = (args) => {
    try {
      // TODO: useCreateProgramWithOnchainV2Mutation와 비슷한 onchain에 업데이트할 mutation 만들면 여기에 넣어야 함
      // if (args.pastStatus === ProgramStatusV2.Draft) {
      //   createProgram({
      //     variables: {
      //       input: {
      //         onchain: {
      //           onchainProgramId: args.txResult?.programId ?? 0,
      //           smartContractId: args.contractId ? Number(args.contractId) : 0,
      //           status: OnchainProgramStatusV2.Active,
      //           tx: args.txResult?.txHash ?? "",
      //         },
      //         program: {
      //           title: args.title,
      //           networkId: Number(args.networkId),
      //           token_id: args.token_id,
      //           price: args.price ?? "0",
      //           description: args.description,
      //           deadline: args.deadline?.toISOString(),
      //           skills: Array.isArray(args.skills) ? args.skills : [],
      //           visibility: args.visibility as ProgramVisibilityV2,
      //           status: args.status ?? ProgramStatusV2.Open,
      //           invitedMembers: args.invitedMembers ?? [],
      //         },
      //       },
      //     },
      //     onCompleted: async () => {
      //       notify("Successfully created the program", "success");
      //       navigate("/programs");
      //       client.refetchQueries({ include: [GetProgramsV2Document] });
      //     },
      //     onError: (error) => {
      //       console.error("Failed to create program:", error);
      //       notify("Failed to create program", "error");
      //     },
      //   });
      // } else {
      updateProgram({
        variables: {
          id: id ?? "",
          input: {
            title: args.title,
            description: args.description,
            deadline: args.deadline?.toISOString() ?? undefined,
            skills: Array.isArray(args.skills) ? args.skills : [],
            visibility: args.visibility as ProgramVisibilityV2,
            invitedMembers: args.invitedMembers ?? [],
          },
        },
        onCompleted: async () => {
          notify("Successfully updated the program", "success");
          navigate("/programs");
          client.refetchQueries({ include: [GetProgramV2Document] });
        },
        onError: (error) => {
          console.error("Failed to update program:", error);
          notify("Failed to update program", "error");
        },
      });
      // }
    } catch (error) {
      console.error("Invalid network or token:", error);
      notify((error as Error).message, "error");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      notify("Please login first", "success");
      return;
    }
    if (!isAuthed) {
      navigate("/my-profile/edit");
      notify("Please add your email", "success");
      return;
    }
  }, [isLoggedIn, isAuthed]);

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      <ProgramForm
        isEdit={true}
        onSubmitProgram={onSubmit}
        createLoading={loading}
      />
    </div>
  );
};

export default EditProgram;
