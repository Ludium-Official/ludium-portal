import client from '@/apollo/client';
import { useCreateProgramMutation } from '@/apollo/mutation/create-program.generated';
import { ProgramsDocument } from '@/apollo/queries/programs.generated';
import type { OnSubmitProgramFunc } from '@/components/program-form';
import ProgramForm from '@/components/program-form';
import { useNavigate } from 'react-router';

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();
  const [createProgram] = useCreateProgramMutation();
  // const [updateProgram] = useUpdateProgramMutation()

  const onSubmit: OnSubmitProgramFunc = (args) => {
    createProgram({
      variables: {
        input: {
          name: args.programName,
          currency: args.currency,
          price: args.price ?? '0',
          description: args.description,
          summary: args.summary,
          deadline: args.deadline ?? '',
          keywords: args.keywords,
          validatorId: args.validatorId,
          links: args.links,
        },
      },
      onCompleted: () => {
        navigate('/programs');

        client.refetchQueries({ include: [ProgramsDocument] });
      },
    });
  };

  return (
    <div className="p-10 pr-[55px] w-[681px]" defaultValue="edit">
      {/* <EditProgramForm /> */}
      <ProgramForm isEdit={false} onSubmitProgram={onSubmit} />
    </div>
  );
};

export default CreateProgram;
