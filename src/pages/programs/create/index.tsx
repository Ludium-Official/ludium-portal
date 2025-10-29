import client from '@/apollo/client';
import { useCreateProgramV2Mutation } from '@/apollo/mutation/create-program-v2.generated';
import { ProgramsV2Document } from '@/apollo/queries/programs-v2.generated';
import ProgramForm from '@/components/program/program-form/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import type { OnSubmitProgramFunc } from '@/types/recruitment';
import { ProgramStatusV2, ProgramVisibilityV2 } from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();

  const { isLoggedIn, isAuthed } = useAuth();
  const [createProgram, { loading }] = useCreateProgramV2Mutation();

  const onSubmit: OnSubmitProgramFunc = (args) => {
    if (!args.deadline) {
      notify('Deadline is required', 'error');
      return;
    }

    if (!args.network) {
      notify('Network is required', 'error');
      return;
    }

    createProgram({
      variables: {
        input: {
          title: args.programTitle,
          currency: args.currency,
          price: args.price ?? '0',
          description: args.description,
          deadline: args.deadline.toISOString(),
          skills: Array.isArray(args.skills) ? args.skills : [],
          network: args.network,
          visibility: args.visibility as ProgramVisibilityV2,
          invitedMembers: Array.isArray(args.builders) ? args.builders : [],
          status: (args.status as ProgramStatusV2) ?? ProgramStatusV2.Open,
        },
      },
      onCompleted: async () => {
        const message =
          args.status === ProgramStatusV2.Draft
            ? 'Successfully saved as draft'
            : 'Successfully created the program';
        notify(message, 'success');
        navigate('/programs');
        client.refetchQueries({ include: [ProgramsV2Document] });
      },
    });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      notify('Please login first', 'success');
      return;
    }
    if (!isAuthed) {
      navigate('/my-profile/edit');
      notify('Please add your email', 'success');
      return;
    }
  }, [isLoggedIn, isAuthed]);

  return (
    <div className="w-full bg-gray-light p-10 pr-[55px]" defaultValue="edit">
      <ProgramForm onSubmitProgram={onSubmit} createLoading={loading} />
    </div>
  );
};

export default CreateProgram;
