import type { Program } from "@/types/types.generated";
import { ApplicationStatus } from "@/types/types.generated";
import { Link } from "react-router";
import { ProgramStatusBadge } from "./status-badge";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface InvestmentCardProps {
  program: Program;
}

function InvestmentCard({ program }: InvestmentCardProps) {
  const deadlineDate = new Date(program.deadline);
  const today = new Date();
  // Zero out the time for both dates to get full days difference
  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const daysUntilDeadline = Math.max(
    0,
    Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  );

  return (
    <Card className="w-full border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <CardContent className="">
        {/* Header with badges and status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-1.5">
            {program.keywords?.slice(0, 3).map((keyword, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-semibold"
              >
                {keyword.name}
              </Badge>
            ))}
          </div>
          {/* <Badge
            variant="outline"
            className={cn(
              "text-xs font-semibold",
              status === "Application ongoing" && "bg-gray-50 text-gray-900 border-gray-200"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-green-400 rounded-full" />
              {status}
            </div>
          </Badge> */}

          <ProgramStatusBadge program={program} />
        </div>

        {/* Content */}
        <Link to={`/investments/${program?.id}`} className="flex gap-4">
          {/* Thumbnail */}
          {program.image ? (
            <img
              src={program.image}
              className="w-29 h-29 rounded-md"
              alt="Program"
            />
          ) : (
            <div className="w-29 h-29 bg-slate-200 rounded-md " />
          )}

          {/* Title and details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
              {program.name || ""}
            </h3>

            {/* Deadline and amount */}
            <div className="space-y-3">
              <div className="bg-[#0000000A] rounded-md py-1 px-2 gap-2 inline-flex items-center">
                <div className="text-sm font-semibold text-neutral-400">
                  DATE
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const formatDate = (dateString: string) => {
                      return new Date(dateString)
                        .toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .toUpperCase()
                        .split(" ")
                        .join(" . ");
                    };

                    const renderDateRange = (
                      startDate: string,
                      endDate: string
                    ) => (
                      <>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                          {formatDate(startDate)}
                        </div>
                        <div className="w-2 h-px bg-muted-foreground" />
                        <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                          {formatDate(endDate)}
                        </div>
                      </>
                    );

                    const now = new Date();
                    const fundingHasStarted =
                      program.fundingStartDate &&
                      now >= new Date(program.fundingStartDate);

                    // Show funding dates if funding has started and dates are available
                    if (
                      fundingHasStarted &&
                      program.fundingStartDate &&
                      program.fundingEndDate
                    ) {
                      return renderDateRange(
                        program.fundingStartDate,
                        program.fundingEndDate
                      );
                    }

                    // Show application dates if available
                    if (
                      program.applicationStartDate &&
                      program.applicationEndDate
                    ) {
                      return renderDateRange(
                        program.applicationStartDate,
                        program.applicationEndDate
                      );
                    }

                    // Fallback when no dates are available
                    return (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        No dates set
                      </div>
                    );
                  })()}
                </div>
                <Badge className="bg-gray-900 text-white text-xs font-semibold">
                  D-{daysUntilDeadline || 0}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {program.summary ||
                  "Bas's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS) to ensure secure, private, and verifiable task-based payments. It enables seamless collaboration between sponsors and builders, automating fund disbursement upon task completion while maintaining privacy and trust."}
              </p>
            </div>
          </div>
        </Link>

        {/* Footer buttons */}
        <div className="flex justify-between mt-6">
          <Link
            to={`/investments/${program?.id}#applications`}
            className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4"
          >
            Submitted Project{" "}
            <span className="text-primary">
              {program.applications?.length ?? 0}
            </span>
          </Link>
          <Link
            to={`/investments/${program?.id}#applications`}
            className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4"
          >
            Approved Project{" "}
            <span className="text-green-600">
              {program.applications?.filter(
                (a) => a.status === ApplicationStatus.Accepted
              ).length ?? 0}
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvestmentCard;
