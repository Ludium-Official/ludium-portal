import { useApproveApplicationMutation } from "@/apollo/mutation/approve-application.generated";
import { useCheckMilestoneMutation } from "@/apollo/mutation/check-milestone.generated";
import { useDenyApplicationMutation } from "@/apollo/mutation/deny-application.generated";
import { useApplicationQuery } from "@/apollo/queries/application.generated";
import { useProgramQuery } from "@/apollo/queries/program.generated";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import SubmitMilestoneForm from "@/pages/programs/details/_components/submit-milestone-form";
import {
  ApplicationStatus,
  CheckMilestoneStatus,
  MilestoneStatus,
} from "@/types/types.generated";
import { TransactionResponse } from "@coinbase/onchainkit/transaction";
import { format } from "date-fns";
import { ethers } from "ethers";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import TransactionWrapper from "./_components/transaction-wrapper";

function ApplicationDetails() {
  const { userId } = useAuth();
  const { id, applicationId } = useParams();
  const { data, refetch } = useApplicationQuery({
    variables: {
      id: applicationId ?? "",
    },
    skip: !applicationId,
  });

  const { data: programData, refetch: programRefetch } = useProgramQuery({
    variables: {
      id: id ?? "",
    },
  });

  const program = programData?.program;

  const { name, keywords } = program ?? {};

  const applicationMutationParams = {
    onCompleted: () => {
      refetch();
      programRefetch();
    },
    variables: {
      id: applicationId ?? "",
    },
  };

  const [checkMilestone] = useCheckMilestoneMutation();

  const [approveApplication] = useApproveApplicationMutation(
    applicationMutationParams
  );
  const [denyApplication] = useDenyApplicationMutation(
    applicationMutationParams
  );

  const navigate = useNavigate();

  const badgeVariants = ["teal", "orange", "pink"];

  const handleSuccess = async (
    response: TransactionResponse,
    id?: string | null
  ) => {
    try {
      const receipt = response.transactionReceipts[0];

      const eventSignature = ethers.utils.id(
        "MilestoneAccepted(uint256,address,uint256)"
      );

      const event = receipt.logs.find(
        (log) => log.topics[0] === eventSignature
      );

      if (event) {
        checkMilestone({
          variables: {
            input: { id: id ?? "", status: CheckMilestoneStatus.Completed },
          },
          onCompleted: () => {
            refetch();
            programRefetch();
          },
        });

        notify("Milestone accept successfully", "success");
      } else {
        notify("Can't found acceptMilestone event", "error");
      }
    } catch (error) {
      notify((error as Error).message, "error");
    }
  };

  return (
    <div className="bg-[#F7F7F7]">
      <section className="bg-white p-10 mb-3 rounded-b-2xl">
        <div className="flex justify-between mb-5">
          <div className="flex gap-2 mb-1">
            {keywords?.map((k, i) => (
              <Badge
                key={k.id}
                variant={
                  badgeVariants[i % badgeVariants.length] as
                    | "default"
                    | "secondary"
                    | "purple"
                }
              >
                {k.name}
              </Badge>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-medium flex gap-2 items-center text-sm cursor-pointer"
          >
            Back to Program detail <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <Link to={`/programs/${id}`} className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <h2 className="text-lg font-bold">{name}</h2>
        </Link>
        <div className="mb-4">
          <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
            <span className="inline-block mr-2">
              {program?.price} {program?.currency}
            </span>
            <span className="h-3 border-l border-[#B331FF] inline-block" />
            <span className="inline-block ml-2">
              DEADLINE{" "}
              {format(
                new Date(program?.deadline ?? new Date()),
                "dd . MMM . yyyy"
              ).toUpperCase()}
            </span>
          </p>
        </div>
      </section>

      <section className="flex bg-white rounded-t-2xl">
        <div className="p-10 flex-[60%]">
          <div className="flex justify-between mb-5">
            <div className="flex gap-2 mb-1">
              <Badge variant="default">{data?.application?.status}</Badge>
            </div>
          </div>

          <Link to={`/programs/${id}`} className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <h2 className="text-lg font-bold">
              {data?.application?.applicant?.organizationName}
            </h2>
          </Link>
          <div className="mb-6">
            <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
              <span className="inline-block mr-2">
                {data?.application?.milestones?.reduce(
                  (prev, curr) => prev + (Number(curr?.price) ?? 0),
                  0
                )}{" "}
                {program?.currency}
              </span>
              <span className="h-3 border-l border-[#B331FF] inline-block" />
              <span className="inline-block ml-2">
                DEADLINE{" "}
                {format(
                  new Date(program?.deadline ?? new Date()),
                  "dd . MMM . yyyy"
                ).toUpperCase()}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-[#18181B] text-lg mb-3">
              APPLICATION
            </h2>
            <p className="text-slate-600 text-sm">{data?.application?.name}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-[#18181B] text-lg mb-3">
              DESCRIPTION
            </h2>
            <p className="text-slate-600 text-sm">
              {data?.application?.content}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-[#18181B] text-lg mb-3">LINKS</h2>
            {data?.application?.links?.map((l) => (
              <p className="text-slate-600 text-sm" key={l.url}>
                {l.url}
              </p>
            ))}
          </div>

          {program?.validator?.id === userId &&
            data?.application?.status === "pending" && (
              <div className="flex justify-end gap-3">
                <Button
                  className="h-10"
                  variant="outline"
                  onClick={() => denyApplication()}
                >
                  Deny
                </Button>
                <Button
                  className="h-10"
                  onClick={() => {
                    approveApplication();
                  }}
                >
                  Select
                </Button>
              </div>
            )}
        </div>

        <div className="border-r" />

        <div className="p-10 flex-[40%]">
          <Accordion type="single" collapsible>
            {data?.application?.milestones?.map((m, idx) => (
              <AccordionItem key={m.id} value={`${m.id}${idx}`}>
                <AccordionTrigger>{m.title}</AccordionTrigger>
                <AccordionContent>
                  <Badge variant="secondary" className="mb-2">
                    {m.status}
                  </Badge>
                  <h2 className="text-lg font-bold mb-2">
                    Milestone #{idx + 1}
                  </h2>
                  <div className="mb-6">
                    <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
                      <span className="inline-block mr-2">
                        {m?.price} {program?.currency}
                      </span>
                      <span className="h-3 border-l border-[#B331FF] inline-block" />
                      <span className="inline-block ml-2">
                        DEADLINE{" "}
                        {format(
                          new Date(program?.deadline ?? new Date()),
                          "dd . MMM . yyyy"
                        ).toUpperCase()}
                      </span>
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className="font-bold text-[#18181B] text-sm mb-3">
                      SUMMARY
                    </h2>
                    <p className="text-slate-600 text-xs">{m.description}</p>
                  </div>

                  {!!m.links?.length && (
                    <div className="mb-10">
                      <h2 className="font-bold text-[#18181B] text-sm mb-3">
                        LINKS
                      </h2>
                      {m.links?.map((l) => (
                        <p key={l.url} className="text-slate-600 text-xs">
                          {l.url}
                        </p>
                      ))}
                    </div>
                  )}

                  {m.status === MilestoneStatus.RevisionRequested &&
                    program?.validator?.id === userId && (
                      <div className="flex justify-between">
                        <Button
                          className="h-10"
                          variant="outline"
                          onClick={() => {
                            checkMilestone({
                              variables: {
                                input: {
                                  id: m.id ?? "",
                                  status: CheckMilestoneStatus.Pending,
                                },
                              },
                              onCompleted: () => {
                                refetch();
                                programRefetch();
                              },
                            });
                          }}
                        >
                          Reject Milestone
                        </Button>
                        <TransactionWrapper
                          buttonText="Accept Milestone"
                          handleSuccess={(response) =>
                            handleSuccess(response, m.id)
                          }
                          functionName="acceptMilestone"
                          args={{
                            args: [
                              Number(program?.educhainProgramId),
                              data?.application?.applicant?.wallet?.address ??
                                "",
                              ethers.utils.parseEther(m.price ?? ""),
                            ],
                          }}
                        />
                      </div>
                    )}

                  {m.status === MilestoneStatus.Pending &&
                    data?.application?.status === ApplicationStatus.Approved &&
                    data?.application?.applicant?.id === userId && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="h-10 block ml-auto">
                            Submit Milestone
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle />
                          <DialogDescription />
                          <DialogClose id="submit-milestone-dialog-close" />
                          <SubmitMilestoneForm
                            milestone={m}
                            refetch={refetch}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

export default ApplicationDetails;
