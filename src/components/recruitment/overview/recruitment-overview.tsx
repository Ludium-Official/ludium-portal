import { useCreateApplicationV2Mutation } from "@/apollo/mutation/create-application-v2.generated";
import { useGetProgramV2Query } from "@/apollo/queries/program-v2.generated";
import InputLabel from "@/components/common/label/inputLabel";
import { MarkdownEditor, MarkdownPreviewer } from "@/components/markdown";
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
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import {
  formatDate,
  formatPrice,
  getCurrencyIcon,
  reduceString,
} from "@/lib/utils";
import { ProgramStatusV2 } from "@/types/types.generated";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import StatusBadge from "../statusBadge/statusBadge";

const RecruitmentOverview: React.FC = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const { data, loading, error } = useGetProgramV2Query({
    variables: {
      id: id || "",
    },
    skip: !id,
  });

  const [createApplication, { loading: submitting }] =
    useCreateApplicationV2Mutation();

  const program = data?.programV2;
  const [status, setStatus] = useState<string>(program?.status || "open");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isOwner = program?.sponsor?.id === userId;
  const isDraft = program?.status === ProgramStatusV2.Draft;

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
      });

      if (result.data?.createApplicationV2) {
        notify("Application submitted successfully!", "success");
        setIsDialogOpen(false);
        setCoverLetter("");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      notify("Failed to submit application. Please try again.", "error");
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

  const formattedCreatedAt = program.createdAt && formatDate(program.createdAt);
  const formattedDeadline = program.deadline && formatDate(program.deadline);
  const formattedPriceValue = program.price && formatPrice(program.price);

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
        <ShareButton />
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
                Price
              </div>
              <div>
                <div className="text-sm text-right">
                  {program.network?.chainName}
                </div>
                <div className="font-bold text-xl">
                  {!program.price ? (
                    "Negotiable"
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
                    disabled={
                      program.status !== ProgramStatusV2.Open && !isDraft
                    }
                  >
                    <Link to={`/programs/${program.id}/edit`}>Edit</Link>
                  </Button>
                  {program.status === "under_review" ? (
                    <Button disabled className="h-11 flex-1">
                      Under Review
                    </Button>
                  ) : status === "closed" ? (
                    <Button
                      variant="outline"
                      disabled
                      className="border h-11 flex-1 gap-2"
                    >
                      <StatusBadge status="closed" />
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={program.status !== "open"}
                      >
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
                          onClick={() => setStatus("open")}
                          className="cursor-pointer"
                        >
                          <StatusBadge status="open" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatus("closed")}
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    disabled={program.hasApplied || false}
                  >
                    {program.hasApplied ? "Applied" : "Submit application"}
                  </Button>
                </DialogTrigger>
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
                      {submitting ? "Submitting..." : "Submit application"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <div>
              <div className="mb-2 text-muted-foreground text-sm font-medium">
                Skills
              </div>
              <div className="flex gap-3 text-sm">
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
              <div className="flex gap-3 text-sm text-muted-foreground">
                {program.sponsor?.firstName && program.sponsor?.lastName
                  ? `${program.sponsor?.firstName} ${program.sponsor?.lastName}`
                  : reduceString(program.sponsor?.walletAddress || "", 6, 6)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentOverview;
