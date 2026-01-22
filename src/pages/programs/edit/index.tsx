import client from "@/apollo/client";
import { useCreateOnchainProgramInfoV2Mutation } from "@/apollo/mutation/create-onchain-program-info-v2.generated";
import { useUpdateProgramV2Mutation } from "@/apollo/mutation/update-program-v2.generated";
import {
  GetProgramV2Document,
  useGetProgramV2Query,
} from "@/apollo/queries/program-v2.generated";
import MobileFormHeader from "@/components/common/mobile-form-header";
import Container from "@/components/layout/container";
import ProgramForm from "@/components/program/program-form/program-form";
import { useAuth } from "@/lib/hooks/use-auth";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import notify from "@/lib/notify";
import { cn, toUTCString } from "@/lib/utils";
import type { OnSubmitProgramFunc, ProgramFormRef } from "@/types/recruitment";
import {
  OnchainProgramStatusV2,
  ProgramStatusV2,
  type ProgramVisibilityV2,
} from "@/types/types.generated";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

const EditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();
  const programFormRef = useRef<ProgramFormRef>(null);

  const { userId, isAuthed, isAuthLoading } = useAuth();
  const [updateProgram, { loading }] = useUpdateProgramV2Mutation();
  const [createOnchainProgramInfo] = useCreateOnchainProgramInfoV2Mutation();

  const { data: programData, loading: programLoading } = useGetProgramV2Query({
    variables: { id: id ?? "" },
    skip: !id,
  });

  const sponsorId = programData?.programV2?.sponsor?.id;
  const isOwner = sponsorId && userId && String(sponsorId) === String(userId);
  const hasPermission = isOwner;

  const currentStatus = programData?.programV2?.status;
  const isAlreadyPublished = currentStatus !== ProgramStatusV2.Draft;

  const onSubmit: OnSubmitProgramFunc = (args) => {
    try {
      if (args.status !== ProgramStatusV2.Draft) {
        createOnchainProgramInfo({
          variables: {
            input: {
              programId: id || "",
              networkId: Number(args.networkId),
              onchainProgramId: args.txResult?.programId ?? 0,
              smartContractId: Number(args.contractId),
              status: OnchainProgramStatusV2.Active,
              tx: args.txResult?.txHash ?? "",
            },
          },
        });
      }

      updateProgram({
        variables: {
          id: id ?? "",
          input: {
            title: args.title,
            networkId: Number(args.networkId),
            token_id: args.token_id,
            price: args.price ?? "0",
            description: args.description,
            deadline: toUTCString(args.deadline),
            skills: Array.isArray(args.skills) ? args.skills : [],
            visibility: args.visibility as ProgramVisibilityV2,
            status: args.status ?? ProgramStatusV2.Open,
            invitedMembers: args.invitedMembers ?? [],
          },
        },
        onCompleted: async () => {
          notify("Successfully updated the program", "success");
          navigate("/dashboard/recruitment/sponsor");
          client.refetchQueries({ include: [GetProgramV2Document] });
        },
        onError: (error) => {
          console.error("Failed to update program:", error);
          notify("Failed to update program", "error");
        },
      });
    } catch (error) {
      console.error("Invalid network or token:", error);
      notify((error as Error).message, "error");
    }
  };

  useEffect(() => {
    if (isAuthLoading || programLoading) return;

    if (!isAuthed) {
      navigate("/profile");
      notify("Please check your email and nickname", "success");
      return;
    }

    if (!hasPermission && programData) {
      notify("You do not have permission to edit this program", "error");
      navigate(`/programs/recruitment/${id}`);
    }
  }, [
    isAuthed,
    isAuthLoading,
    programLoading,
    hasPermission,
    programData,
    navigate,
    id,
  ]);

  if (isAuthLoading || programLoading) {
    return null;
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <>
      {isMobile && (
        <MobileFormHeader
          title="Edit Program"
          backLink={`/programs/recruitment/${id}`}
          isPublished={isAlreadyPublished}
          loading={loading}
          onPublish={() => programFormRef.current?.submitPublish()}
          onSaveDraft={() => programFormRef.current?.submitDraft()}
        />
      )}
      <Container
        className={cn(
          "w-full bg-gray-light p-10 max-w-full",
          isMobile && "p-0!"
        )}
      >
        <ProgramForm
          isEdit={true}
          onSubmitProgram={onSubmit}
          createLoading={loading}
          formRef={programFormRef}
        />
      </Container>
    </>
  );
};

export default EditProgram;
