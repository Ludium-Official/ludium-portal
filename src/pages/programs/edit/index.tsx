import client from "@/apollo/client";
import { useUpdateProgramV2Mutation } from "@/apollo/mutation/update-program-v2.generated";
import { GetProgramV2Document } from "@/apollo/queries/program-v2.generated";
import ProgramForm from "@/components/program/program-form/program-form";
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import { OnSubmitProgramFunc } from "@/types/recruitment";
import { ProgramVisibilityV2 } from "@/types/types.generated";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const EditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoggedIn, isAuthed } = useAuth();
  const [updateProgram, { loading }] = useUpdateProgramV2Mutation();

  const onSubmit: OnSubmitProgramFunc = (args) => {
    try {
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
