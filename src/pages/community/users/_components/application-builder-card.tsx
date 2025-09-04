import { ApplicationStatusBadge, ProgramStatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCurrencyIcon } from "@/lib/utils"
import type { Application } from "@/types/types.generated"
import BigNumber from "bignumber.js"
import { ArrowUpRightIcon } from "lucide-react"
import { Link } from "react-router"

function ApplicationBuilderCard({ application }: { application: Application }) {
  return (
    <div className="border rounded-lg p-5 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          {application.program?.keywords?.map((keyword) => (
            <Badge variant="secondary" key={keyword.id} className="font-semibold">{keyword.name}</Badge>
          ))}
        </div>

        <div>
          <ProgramStatusBadge program={application.program} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {application.program?.image ? (
            <img
              src={application.program.image}
              alt={application.program?.name ?? 'Program image'}
              className="w-8 h-8 rounded"
            />
          ) : (
            <div
              className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center"
              aria-label="No program image"
              role="img"
            />
          )}
          <p className="font-bold text-sm text-gray-dark truncate max-w-[450px]">{application.program?.name}</p>
        </div>
        <Link
          to={`/programs/${application.program?.id}/application/${application.id}`}
          className="flex items-center"
        >
          <ArrowUpRightIcon width={16} height={16} />
        </Link>
      </div>

      <Separator className="mb-4" />

      <ApplicationStatusBadge application={application} className="inline-flex mb-4" />

      <div>
        <div className="mb-4 bg-[#0000000A] inline-block p-2 py-1 rounded-md">
          {/* <p className="font-sans font-bold bg-primary-light text-primary leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]"> */}
          <div className="inline-flex justify-between items-center">
            <h4 className="text-neutral-400 text-sm font-bold">PRICE</h4>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm font-bold">
                <span className="text-sm ml-3">
                  {application?.milestones
                    ?.reduce(
                      (prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)),
                      BigNumber(0, 10),
                    )
                    .toFixed()}
                </span>
              </p>
              <span className="text-muted-foreground">
                {getCurrencyIcon(application?.program?.currency)}
              </span>

              <span className="text-sm text-muted-foreground">{application?.program?.currency}</span>
            </div>

            {/* <Separator orientation="vertical" /> */}

            <div className="border-l pl-2 ml-2 h-4 flex items-center">
              <span className="text-sm text-muted-foreground">
                {application?.program?.network}
              </span>
            </div>

          </div>

        </div>

        <div>
          <h4 className="text-sm text-muted-foreground font-semibold mb-1">PROPOSAL</h4>
          <p className="text-sm text-muted-foreground">{application?.summary}</p>
        </div>
      </div>
      {/* <h1>Application Builder Card {application.name}</h1> */}
    </div>
  )
}

export default ApplicationBuilderCard