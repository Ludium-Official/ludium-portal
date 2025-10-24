import { useParams } from "react-router";
import { mockRecruitmentPrograms } from "@/mock/recruitment-programs";
import {
  formatDate,
  formatPrice,
  getCurrency,
  getCurrencyIcon,
  reduceString,
} from "@/lib/utils";
import { MarkdownPreviewer } from "@/components/markdown";
import { ShareButton } from "@/components/ui/share-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import StatusBadge from "../statusBadge/statusBadge";
import { Badge } from "@/components/ui/badge";

const RecruitmentOverview: React.FC = () => {
  const { id } = useParams();

  const recruitment = mockRecruitmentPrograms.find((item) => item.id === id);
  const [status, setStatus] = useState<string>(recruitment?.status || "");

  if (!recruitment) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Recruitment not found</div>
      </div>
    );
  }

  const formattedCreatedAt =
    recruitment.createdAt && formatDate(recruitment.createdAt);
  const formattedDeadline =
    recruitment.deadline && formatDate(recruitment.deadline);
  const formattedPriceValue =
    recruitment.price && formatPrice(recruitment.price);

  return (
    <div className="bg-white rounded-2xl p-10">
      <div className="flex items-center mb-4">
        <div className="mr-5">
          <StatusBadge status={recruitment.status} />
        </div>
        <div className="text-sm text-gray-500">
          Posted: {formattedCreatedAt}
        </div>
      </div>

      <h1 className="flex justify-between mb-8 text-3xl font-bold text-gray-900">
        {recruitment.title}
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
            {recruitment.description && (
              <MarkdownPreviewer value={recruitment.description} />
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
                  {getCurrency(recruitment.network)?.display}
                </div>
                <div className="font-bold text-xl">
                  {recruitment.budgetType === "negotiable" ? (
                    "Negotiable"
                  ) : recruitment.price && recruitment.currency ? (
                    <div className="flex items-center gap-3">
                      {formattedPriceValue}{" "}
                      <div className="flex items-center gap-2">
                        {getCurrencyIcon(recruitment.currency)}
                        {recruitment.currency}
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

            <div className="flex w-full">
              <div className="flex justify-end gap-2 w-full">
                <Button
                  variant="secondary"
                  className="h-11 flex-1"
                  disabled={recruitment.status !== "open"}
                >
                  Edit
                </Button>
                {recruitment.status === "under_review" ? (
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
                      disabled={recruitment.status !== "open"}
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

            <div>
              <div className="mb-2 text-muted-foreground text-sm font-medium">
                Skills
              </div>
              <div className="flex gap-3 text-sm">
                {recruitment.skills?.map((skill) => (
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
                Sponser
              </div>
              <div className="flex gap-3 text-sm text-muted-foreground">
                {recruitment.sponser?.first_name &&
                recruitment.sponser?.last_name
                  ? `${recruitment.sponser?.first_name} ${recruitment.sponser?.last_name}`
                  : reduceString(
                      recruitment.sponser?.wallet_address || "",
                      6,
                      6
                    )}
              </div>
            </div>

            <div className="text-sm font-medium">
              <span className="mr-2 text-muted-foreground">Applicants</span>{" "}
              <span className="text-primary">{recruitment.applicantCount}</span>
            </div>

            <div>
              <div className="flex items-center mb-2 text-muted-foreground text-sm font-medium">
                Visibility
                <div className="ml-3 font-bold capitalize">
                  <Badge variant="purple" className="text-xs font-semibold">
                    {recruitment.visibility}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center">
                {recruitment.builders &&
                  recruitment.builders.map((builder) => (
                    <Badge
                      key={builder.email}
                      variant="secondary"
                      className="text-xs font-semibold"
                    >
                      {builder?.first_name && builder?.last_name
                        ? `${builder?.first_name} ${builder?.last_name}`
                        : builder.email}
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
