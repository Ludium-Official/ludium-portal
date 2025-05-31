import client from '@/apollo/client';
import { useAcceptProgramMutation } from '@/apollo/mutation/accept-program.generated';
import { useRejectProgramMutation } from '@/apollo/mutation/reject-program.generated';
import { useSubmitProgramMutation } from '@/apollo/mutation/submit-program.generated';
import { ProgramDocument } from '@/apollo/queries/program.generated';
import MarkdownPreviewer from '@/components/markdown-previewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { formatProgramStatus, mainnetDefaultNetwork } from '@/lib/utils';
import { ApplicationStatus, type Program, type User } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { Settings, TriangleAlert } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import CreateApplicationForm from './create-application-form';

function MainSection({ program }: { program?: Program | null }) {
  const { userId, isAuthed, isLoggedIn } = useAuth();
  const { id } = useParams();
  const contract = useContract(program?.network || mainnetDefaultNetwork);
  const navigate = useNavigate();

  console.log('🚀 ~ MainSection ~ program:', program);
  const acceptedPrice = program?.applications
    ?.filter((a) => a.status === ApplicationStatus.Accepted)
    .reduce(
      (mlPrev, mlCurr) => {
        const mlPrice = mlCurr?.milestones?.reduce(
          (prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)),
          BigNumber(0, 10),
        );
        return mlPrev.plus(BigNumber(mlPrice ?? 0));
      },
      BigNumber(0, 10),
    )
    .toFixed();
  // console.log('🚀 ~ acceptedPrice ~ acceptedPrice:', acceptedPrice?.toFixed());
  const badgeVariants = ['teal', 'orange', 'pink'];

  const programActionOptions = {
    variables: { id: program?.id ?? id ?? '' },
    onCompleted: () => {
      client.refetchQueries({ include: [ProgramDocument] });
    },
  };

  const [acceptProgram] = useAcceptProgramMutation(programActionOptions);
  const [publishProgram] = useSubmitProgramMutation();
  const [rejectProgram] = useRejectProgramMutation(programActionOptions);

  const callTx = async () => {
    try {
      if (program) {
        const network = program.network as keyof typeof tokenAddresses;
        const tokens = tokenAddresses[network] || [];
        const targetToken = tokens.find((token) => token.name === program.currency);

        const result = await contract.createProgram({
          name: program.name as string | undefined,
          price: program.price as string | undefined,
          deadline: program.deadline,
          validatorAddress: program?.validator as User | undefined,
          token: targetToken,
          ownerAddress: program.validator?.walletAddress || '',
        });

        if (result) {
          await publishProgram({
            variables: {
              id: program?.id ?? '',
              educhainProgramId: result.programId,
              txHash: result.txHash,
            },
          });

          notify('Program published successfully', 'success');
        } else {
          notify('Program published failed', 'error');
        }
      }
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  return (
    <div className="flex bg-white rounded-b-2xl">
      <section className=" w-full max-w-[60%] border-r px-10 pt-5 pb-[50px]">
        <div className="w-full mb-9">
          <div className="flex justify-between mb-5 items-start">
            <div className="flex gap-2 mb-1 max-w-[70%] flex-wrap">
              {program?.keywords?.map((k, i) => (
                <Badge
                  key={k.id}
                  variant={
                    badgeVariants[i % badgeVariants.length] as 'default' | 'secondary' | 'purple'
                  }
                >
                  {k.name}
                </Badge>
              ))}
            </div>
            <span className="font-medium flex gap-2 items-center text-sm">
              {formatProgramStatus(program)}{' '}
              {program?.creator?.id === userId && (
                <>
                  {program &&
                    (program.network === 'base' || program.network === 'base-sepolia') && (
                      <Button
                        className="h-8 w-12 p-2 bg-[#F8ECFF] text-[#B331FF] text-xs hover:bg-[#F8ECFF]"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://ludium-farcaster.vercel.app/api/programs/${
                              program.name
                            }/${id}/${Math.floor(
                              new Date(program.deadline).getTime() / 1000,
                            )}/${program.price}/${program.currency}`,
                          );
                          notify('Copied program frame!', 'success');
                        }}
                      >
                        Copy
                      </Button>
                    )}
                  <Link to={`/programs/${program?.id}/edit`}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <h2 className="text-lg font-bold">{program?.name}</h2>
          </div>
          <div className="mb-1">
            <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
              <span className="inline-block mr-2">
                {acceptedPrice} {program?.currency}
                {acceptedPrice && ' / '}
                {program?.price} {program?.currency}
              </span>
              <span className="h-3 border-l border-[#B331FF] inline-block" />
              <span className="inline-block ml-2">
                DEADLINE{' '}
                {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-9">
          <h3 className="text-lg font-bold mb-3">SUMMARY</h3>
          <p className="text-slate-600 text-sm">{program?.summary}</p>
        </div>

        <div className="mb-9">
          <h3 className="text-lg font-bold mb-3">DESCRIPTION</h3>
          {program?.description && <MarkdownPreviewer value={program?.description} />}
        </div>

        <div className="mb-9">
          <h3 className="text-lg font-bold mb-3">LINKS</h3>
          {program?.links?.map((l) => (
            <a
              href={l?.url ?? ''}
              key={l.url}
              className="block hover:underline text-slate-600 text-sm"
              target="_blank"
              rel="noreferrer"
            >
              {l?.url}
            </a>
          ))}
        </div>

        {isLoggedIn &&
          program?.status === 'published' &&
          program.creator?.id !== userId &&
          program.validator?.id !== userId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={(e) => {
                    if (!isAuthed) {
                      notify('Please add your email', 'success');
                      navigate('/profile/edit');
                      return;
                    }

                    e.stopPropagation();
                  }}
                  className="mt-6 mb-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]"
                >
                  Send an application
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
                <CreateApplicationForm program={program} />
              </DialogContent>
            </Dialog>
          )}

        {program?.validator?.id === userId && program.status === 'draft' && (
          <div className="flex justify-end gap-4">
            <Button onClick={() => rejectProgram()} variant="outline" className="h-11 w-[118px]">
              Reject
            </Button>
            <Button
              onClick={async () => {
                await acceptProgram();
                notify('Program accepted', 'success');
              }}
              className="h-11 w-[118px]"
            >
              Confirm
            </Button>
          </div>
        )}

        {program?.creator?.id === userId && program.status === 'payment_required' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-6 mb-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]">
                Pay
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[400px] p-6 max-h-screen overflow-y-auto">
              <DialogClose id="pay-dialog-close" />
              <div className="text-center">
                <span className="text-red-600 w-[42px] h-[42px] rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <TriangleAlert />
                </span>
                <DialogTitle className="font-semibold text-lg text-[#18181B] mb-2">
                  Are you sure to pay the settlement for the program?
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm mb-4">
                  The amount will be securely stored until you will confirm the completion of the
                  project.
                </DialogDescription>
                <Button onClick={callTx}>Yes, Pay now</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </section>

      <section className="px-10 py-[60px] w-full max-w-[40%] bg-white">
        <div className="border rounded-xl w-full p-6 mb-6">
          <Link
            to={`/users/${program?.creator?.id}`}
            className="flex gap-4 items-center text-lg font-bold mb-5"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            PROGRAM SPONSOR
          </Link>

          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Name</p>
            <p className="text-xs">{program?.creator?.organizationName}</p>
          </div>

          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Email</p>
            <p className="text-xs">{program?.creator?.email}</p>
          </div>
        </div>

        {program?.validator && (
          <div className="border rounded-xl w-full p-6">
            <Link
              to={`/users/${program.validator.id}`}
              className="flex gap-4 items-center text-lg font-bold mb-5"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              PROGRAM VALIDATOR
            </Link>

            <div className="flex gap-3 mb-4">
              <p className="text-xs font-bold w-[57px]">Name</p>
              <p className="text-xs">{program?.validator?.organizationName}</p>
            </div>

            <div className="flex gap-3 mb-4">
              <p className="text-xs font-bold w-[57px]">Email</p>
              <p className="text-xs">{program?.validator?.email}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default MainSection;
