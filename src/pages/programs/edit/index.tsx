import client from "@/apollo/client";
import { useUpdateProgramMutation } from "@/apollo/mutation/update-program.generated";
import { ProgramDocument } from "@/apollo/queries/program.generated";
import { ProgramsDocument } from "@/apollo/queries/programs.generated";
import type { OnSubmitProgramFunc } from "@/components/program-form";
import ProgramForm from "@/components/program-form";
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const EditProgram: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [updateProgram] = useUpdateProgramMutation();
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
    updateProgram({
      variables: {
        input: {
          id: args.id ?? "",
          name: args.programName,
          price: args.price,
          description: args.description,
          summary: args.summary,
          currency: args.currency,
          deadline: args.deadline,
          keywords: args.keywords,
          validatorId: args.validatorId,
          links: args.links,
          network: args.network,
        },
      },
      onCompleted: () => {
        notify("Program successfully updated.");
        client.refetchQueries({ include: [ProgramsDocument, ProgramDocument] });
        navigate(`/programs/${id}`);
      },
    });
  };

  return (
    <div className="p-10 pr-[55px] w-[681px]">
      <ProgramForm isEdit={true} onSubmitProgram={onSubmit} />
    </div>
  );
};

export default EditProgram;
