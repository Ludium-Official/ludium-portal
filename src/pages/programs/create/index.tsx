import client from '@/apollo/client';
import { useCreateProgramV2Mutation } from '@/apollo/mutation/create-program-v2.generated';
import { useCreateProgramWithOnchainV2Mutation } from '@/apollo/mutation/create-program-with-onchain-v2.generated';
import { GetProgramsV2Document } from '@/apollo/queries/programs-v2.generated';
import MobileFormHeader from '@/components/common/mobile-form-header';
import Container from '@/components/layout/container';
import ProgramForm from '@/components/program/program-form/program-form';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, toUTCString } from '@/lib/utils';
import type { OnSubmitProgramFunc, ProgramFormRef } from '@/types/recruitment';
import {
  OnchainProgramStatusV2,
  ProgramStatusV2,
  type ProgramVisibilityV2,
} from '@/types/types.generated';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

const CreateProgram: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const programFormRef = useRef<ProgramFormRef>(null);

  const { isAuthed, isAuthLoading } = useAuth();
  const [createProgram, { loading }] = useCreateProgramWithOnchainV2Mutation();
  const [createProgramV2] = useCreateProgramV2Mutation();

  const onSubmit: OnSubmitProgramFunc = (args) => {
    try {
      if (args.status === ProgramStatusV2.Draft) {
        createProgramV2({
          variables: {
            input: {
              title: args.title,
              networkId: Number(args.networkId),
              token_id: args.token_id,
              price: args.price,
              description: args.description,
              deadline: toUTCString(args.deadline),
              visibility: args.visibility as ProgramVisibilityV2,
              skills: args.skills,
              status: args.status,
            },
          },
          onCompleted: async () => {
            notify('Successfully saved the draft program', 'success');
            navigate('/programs/recruitment');
            client.refetchQueries({ include: [GetProgramsV2Document] });
          },
          onError: (error) => {
            console.error('Failed to saved draft program:', error);
            notify('Failed to saved draft program', 'error');
          },
        });
      } else {
        if (!args.contractId) {
          notify('Contract ID is required for creating a program', 'error');
          return;
        }

        createProgram({
          variables: {
            input: {
              onchain: {
                onchainProgramId: args.txResult?.programId ?? 0,
                smartContractId: Number(args.contractId),
                status: OnchainProgramStatusV2.Active,
                tx: args.txResult?.txHash ?? '',
              },
              program: {
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
          },
          onCompleted: async () => {
            notify('Successfully created the program', 'success');
            navigate('/dashboard/recruitment/sponsor');
            client.refetchQueries({ include: [GetProgramsV2Document] });
          },
          onError: (error) => {
            console.error('Failed to create program:', error);
            notify('Failed to create program', 'error');
          },
        });
      }
    } catch (error) {
      console.error('Invalid network or token:', error);
      notify((error as Error).message, 'error');
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthed) {
      navigate('/profile');
      notify('Please check your email and nickname', 'success');
    }
  }, [isAuthed, isAuthLoading, navigate]);

  return (
    <>
      {isMobile && (
        <MobileFormHeader
          title="Create Program"
          backLink="/programs/recruitment"
          isPublished={false}
          loading={loading}
          onPublish={() => programFormRef.current?.submitPublish()}
          onSaveDraft={() => programFormRef.current?.submitDraft()}
        />
      )}
      <Container className={cn('w-full bg-gray-light p-10 max-w-full', isMobile && 'mt-17 p-4')}>
        <ProgramForm onSubmitProgram={onSubmit} createLoading={loading} formRef={programFormRef} />
      </Container>
    </>
  );
};

export default CreateProgram;
