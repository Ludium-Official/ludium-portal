import { useCreateApplicationV2Mutation } from "@/apollo/mutation/create-application-v2.generated";
import { useUpdateProgramV2Mutation } from "@/apollo/mutation/update-program-v2.generated";
import { useGetProgramV2Query } from "@/apollo/queries/program-v2.generated";
import { GetProgramsV2Document } from "@/apollo/queries/programs-v2.generated";
import InputLabel from "@/components/common/label/inputLabel";
import { MarkdownEditor, MarkdownPreviewer } from "@/components/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareButton } from "@/components/ui/share-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import {
  formatDate,
  formatPrice,
  getCurrencyIcon,
  getInitials,
  getUserDisplayName,
  reduceString,
} from "@/lib/utils";
import { ProgramStatusV2, ProgramVisibilityV2 } from "@/types/types.generated";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import StatusBadge from "../statusBadge/statusBadge";

const RecruitmentOverview: React.FC = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useGetProgramV2Query({
    variables: {
      id: id || "",
    },
    skip: !id,
  });

  const [createApplication, { loading: submitting }] =
    useCreateApplicationV2Mutation();
  const [updateProgram] = useUpdateProgramV2Mutation();

  const program = data?.programV2;
  const [status, setStatus] = useState<ProgramStatusV2>(
    program?.status || ProgramStatusV2.Open
  );
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (program?.status) {
      setStatus(program.status);
    }
  }, [program?.status]);

  const isOwner = program?.sponsor?.id === userId;
  const isDraft = program?.status === ProgramStatusV2.Draft;
  const formattedCreatedAt =
    program?.createdAt && formatDate(program.createdAt);
  const formattedDeadline = program?.deadline && formatDate(program.deadline);
  const formattedPriceValue = program?.price && formatPrice(program.price);
  const isDeadlinePassed =
    program?.deadline && new Date(program.deadline).getTime() < Date.now();

  const handleSubmitApplication = async () => {
    if (!id || !coverLetter.trim()) {
      notify("Please provide a cover letter", "error");
      return;
    }

    try {
      const result = await createApplication({
        variables: {
          input: {
            programId: id,
            content: coverLetter,
          },
        },
        refetchQueries: [
          {
            query: GetProgramsV2Document,
            variables: {
              id: id || "",
            },
          },
        ],
      });

      if (result.data?.createApplicationV2) {
        notify("Application submitted successfully!", "success");
        navigate("/profile/recruitment/builder");

        return;
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      notify("Failed to submit application. Please try again.", "error");
    }
  };

  const handleStatusChange = async (newStatus: ProgramStatusV2) => {
    if (!id) {
      toast.error("Missing program ID");
      return;
    }

    try {
      await updateProgram({
        variables: {
          id: id,
          input: {
            status:
              newStatus === ProgramStatusV2.Closed
                ? ProgramStatusV2.Closed
                : ProgramStatusV2.Open,
          },
        },
      });

      await refetch();
      toast.success(`Program ${newStatus.toLowerCase()} successfully`);
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to close program:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to close program"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Loading program...</div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-500">
          {error ? "Error loading program" : "Program not found"}
        </div>
      </div>
    );
  }

  if (
    program.visibility === ProgramVisibilityV2.Private &&
    !isOwner &&
    !program.invitedMembers?.includes(userId)
  ) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg text-gray-700 font-semibold mb-2">
            Private Program
          </div>
          <div className="text-sm text-gray-500">
            This program is private. Please log in to view the details.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-10">
      <div className="flex items-center mb-4">
        <div className="mr-5">
          <StatusBadge status={program.status || "open"} />
        </div>
        <div className="text-sm text-gray-500">
          Posted: {formattedCreatedAt}
        </div>
      </div>

      <h1 className="flex justify-between mb-8 text-3xl font-bold text-gray-900">
        {program.title}
        <ShareButton
          linkToCopy={`${window.location.origin}/programs/${program.id}`}
        />
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="flex items-end">
            <span className="p-2 border-b border-b-primary font-medium text-sm">
              Details
            </span>
            <span className="block border-b w-full" />
          </h3>

          <div className="mt-3">
            {program.description && (
              <MarkdownPreviewer value={program.description} />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-5 border-b">
              <div className="text-muted-foreground text-sm font-medium">
                Budget
              </div>
              <div>
                <div className="text-sm text-right">
                  {program.network?.chainName}
                </div>
                <div className="font-bold text-xl">
                  {!program.price ? (
                    <div className="flex items-center gap-2">
                      {getCurrencyIcon(program.token?.tokenName || "")}
                      <span>Negotiable</span>
                    </div>
                  ) : program.price && program.token ? (
                    <div className="flex items-center gap-3">
                      {formattedPriceValue}{" "}
                      <div className="flex items-center gap-2">
                        {getCurrencyIcon(program.token.tokenName || "")}
                        {program.token.tokenName}
                      </div>
                    </div>
                  ) : (
                    <div className="font-bold text-lg">-</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm font-medium">
                Deadline
              </div>
              <div>
                <div className="font-bold text-xl">{formattedDeadline}</div>
              </div>
            </div>

            {isOwner ? (
              <div className="flex w-full">
                <div className="flex justify-end gap-2 w-full">
                  <Button
                    variant="secondary"
                    className="h-11 flex-1"
                    disabled={!isDraft && isDeadlinePassed}
                  >
                    <Link
                      className="flex items-center justify-center w-full h-full"
                      to={`/programs/${program.id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
                  {program.status === "under_review" ? (
                    <Button disabled className="h-11 flex-1">
                      Under Review
                    </Button>
                  ) : isDeadlinePassed || isDraft ? (
                    <Button
                      variant="outline"
                      disabled
                      className="border h-11 flex-1 gap-2"
                    >
                      <StatusBadge status={status} />
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="border h-11 flex-1 gap-2"
                        >
                          <StatusBadge status={status} />
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(ProgramStatusV2.Open)
                          }
                          className="cursor-pointer"
                        >
                          <StatusBadge status="open" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(ProgramStatusV2.Closed)
                          }
                          className="cursor-pointer"
                        >
                          <StatusBadge status="closed" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ) : (
              userId && (
                <TooltipProvider>
                  <Tooltip>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <TooltipTrigger asChild>
                        <span className="w-full">
                          <DialogTrigger asChild>
                            <Button
                              className="w-full"
                              disabled={
                                program.status !== ProgramStatusV2.Open ||
                                program.hasApplied ||
                                isDeadlinePassed ||
                                false
                              }
                            >
                              {program.hasApplied
                                ? "Applied"
                                : "Submit application"}
                            </Button>
                          </DialogTrigger>
                        </span>
                      </TooltipTrigger>
                      {isDeadlinePassed && (
                        <TooltipContent>
                          <p className="text-black">Deadline has passed</p>
                        </TooltipContent>
                      )}
                      <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="flex-row items-center justify-between space-y-0">
                          <DialogTitle>Add Cover Letter</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <InputLabel
                            labelId="coverLetter"
                            title="Highlight your skills and explain why you're a great fit for this role."
                            isPrimary
                            inputClassName="hidden"
                          >
                            <MarkdownEditor
                              onChange={(value: string) => {
                                setCoverLetter(value);
                              }}
                              content={coverLetter}
                            />
                          </InputLabel>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSubmitApplication}
                            disabled={submitting || !coverLetter.trim()}
                          >
                            {submitting
                              ? "Submitting..."
                              : "Submit application"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Tooltip>
                </TooltipProvider>
              )
            )}

            <div className="mt-4">
              <div className="mb-2 text-muted-foreground text-sm font-medium">
                Skills
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {program.skills?.map((skill: string) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs font-semibold"
                  >
                    {skill.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-muted-foreground text-sm font-medium">
                Sponsor
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={program.sponsor?.profileImage || ""} />
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      getUserDisplayName(
                        program.sponsor?.firstName,
                        program.sponsor?.lastName,
                        program.sponsor?.email
                      )
                    )}
                  </AvatarFallback>
                </Avatar>
                {getUserDisplayName(
                  program.sponsor?.firstName,
                  program.sponsor?.lastName,
                  program.sponsor?.email
                )}
              </div>
            </div>

            <div className="text-sm font-medium">
              <span className="mr-2 text-muted-foreground">Applicants</span>{" "}
              <span className="text-primary">
                {program.applicationCount ?? 0}
              </span>
            </div>

            <div>
              <div className="flex items-center mb-2 text-muted-foreground text-sm font-medium">
                Visibility
                <div className="ml-3 font-bold capitalize">
                  <Badge variant="purple" className="text-xs font-semibold">
                    {program.visibility}
                  </Badge>
                </div>
              </div>
              {isOwner && (
                <div className="flex items-center gap-2">
                  {program.invitedMembers &&
                    program.invitedMembers.map((member: string) => (
                      <Badge
                        key={member}
                        variant="secondary"
                        className="text-xs font-semibold"
                      >
                        {reduceString(member, 6, 6)}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentOverview;
