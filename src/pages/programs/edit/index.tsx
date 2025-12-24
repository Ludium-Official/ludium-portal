import client from '@/apollo/client';
import { useCreateOnchainProgramInfoV2Mutation } from '@/apollo/mutation/create-onchain-program-info-v2.generated';
import { useUpdateProgramV2Mutation } from '@/apollo/mutation/update-program-v2.generated';
import { GetProgramV2Document } from '@/apollo/queries/program-v2.generated';
import ProgramForm from '@/components/program/program-form/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { toUTCString } from '@/lib/utils';
import type { OnSubmitProgramFunc } from '@/types/recruitment';
import {
  OnchainProgramStatusV2,
  ProgramStatusV2,
  type ProgramVisibilityV2,
} from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

const EditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isAuthed, isAuthLoading } = useAuth();
  const [updateProgram, { loading }] = useUpdateProgramV2Mutation();
  const [createOnchainProgramInfo] = useCreateOnchainProgramInfoV2Mutation();

  const onSubmit: OnSubmitProgramFunc = (args) => {
    try {
      if (args.status !== ProgramStatusV2.Draft) {
        createOnchainProgramInfo({
          variables: {
            input: {
              programId: id || '',
              networkId: Number(args.networkId),
              onchainProgramId: args.txResult?.programId ?? 0,
              smartContractId: Number(args.contractId),
              status: OnchainProgramStatusV2.Active,
              tx: args.txResult?.txHash ?? '',
            },
          },
        });
      }

      updateProgram({
        variables: {
          id: id ?? '',
          input: {
            title: args.title,
            networkId: Number(args.networkId),
            token_id: args.token_id,
            price: args.price ?? '0',
            description: args.description,
            deadline: toUTCString(args.deadline),
            skills: Array.isArray(args.skills) ? args.skills : [],
            visibility: args.visibility as ProgramVisibilityV2,
            status: args.status ?? ProgramStatusV2.Open,
            invitedMembers: args.invitedMembers ?? [],
          },
        },
        onCompleted: async () => {
          notify('Successfully updated the program', 'success');
          navigate('/dashboard/recruitment/sponsor');
          client.refetchQueries({ include: [GetProgramV2Document] });
        },
        onError: (error) => {
          console.error('Failed to update program:', error);
          notify('Failed to update program', 'error');
        },
      });
    } catch (error) {
      console.error('Invalid network or token:', error);
      notify((error as Error).message, 'error');
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthed) {
      navigate('/profile');
      notify('Please add your email', 'success');
    }
  }, [isAuthed, isAuthLoading, navigate]);

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      <ProgramForm isEdit={true} onSubmitProgram={onSubmit} createLoading={loading} />
    </div>
  );
};

export default EditProgram;
