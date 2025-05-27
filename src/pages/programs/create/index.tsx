import client from "@/apollo/client";
import { useCreateProgramMutation } from "@/apollo/mutation/create-program.generated";
import { ProgramsDocument } from "@/apollo/queries/programs.generated";
import type { OnSubmitProgramFunc } from "@/components/program-form";
import ProgramForm from "@/components/program-form";
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();
  const [createProgram] = useCreateProgramMutation();

  const { isLoggedIn, isAuthed } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      notify("Please login first", "success");
      return;
    } else if (!isAuthed) {
      navigate("/profile/edit");
      notify("Please add your email", "success");
      return;
    }
  }, [isLoggedIn, isAuthed]);

  const onSubmit: OnSubmitProgramFunc = (args) => {
    createProgram({
      variables: {
        input: {
          name: args.programName,
          currency: args.currency,
          price: args.price ?? "0",
          description: args.description,
          summary: args.summary,
          deadline: args.deadline ?? "",
          keywords: args.keywords,
          validatorId: args.validatorId,
          links: args.links,
          network: args.network,
        },
      },
      onCompleted: () => {
        navigate("/programs");

        client.refetchQueries({ include: [ProgramsDocument] });
      },
    });
  };

  return (
    <div className="p-10 pr-[55px] w-[681px]" defaultValue="edit">
      <ProgramForm isEdit={false} onSubmitProgram={onSubmit} />
    </div>
  );
};

export default CreateProgram;
