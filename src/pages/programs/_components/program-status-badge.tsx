import { formatProgramStatus } from "@/lib/utils"
import { type Program, ProgramStatus } from "@/types/types.generated"

function ProgramStatusBadge({ program }: { program: Program }) {
  let statusColor = <span className="bg-gray-400 w-[14px] h-[14px] rounded-full block" />

  switch (program.status) {
    case ProgramStatus.Cancelled:
      statusColor = <span className="bg-red-400 w-[14px] h-[14px] rounded-full block" />
      break;
    case ProgramStatus.Closed:
      statusColor = <span className="bg-red-400 w-[14px] h-[14px] rounded-full block" />
      break;
    case ProgramStatus.Completed:
      statusColor = <span className="bg-purple-500 w-[14px] h-[14px] rounded-full block" />
      break;
    case ProgramStatus.Draft:
      statusColor = <span className="bg-gray-400 w-[14px] h-[14px] rounded-full block" />
      break;
    case ProgramStatus.PaymentRequired:
      statusColor = <span className="bg-blue-400 w-[14px] h-[14px] rounded-full block" />
      break;
    case ProgramStatus.Published:
      statusColor = <span className="bg-teal-400 w-[14px] h-[14px] rounded-full block" />
      break;
  }

  return (<span className="flex items-center gap-2 bg-gray-light px-2.5 py-0.5 rounded-full">{statusColor}{formatProgramStatus(program)}</span>)
}

export default ProgramStatusBadge