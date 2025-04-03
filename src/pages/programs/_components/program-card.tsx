
import { Badge } from "@/components/ui/badge"
import { } from "@/components/ui/dialog"
import { useAuth } from "@/lib/hooks/use-auth"
// import { useAuth } from "@/lib/hooks/use-auth"
import { ApplicationStatus, type Program } from "@/types/types.generated"
import { format } from "date-fns"
import { ArrowRight, Settings } from "lucide-react"
import { Link, } from "react-router"

function ProgramCard({ program }: { program: Program }) {
  const { isSponsor } = useAuth()
  const { id, name, keywords, summary } = program ?? {}
  const badgeVariants = ['teal', 'orange', 'pink']

  // const navigate = useNavigate()

  return (
    // <Link to={`/programs/${id}/details`} className="block w-full border border-[#E9E9E9] rounded-[20px] px-10 py-[18px]">
    <div className="block w-full border border-[#E9E9E9] rounded-[20px] px-10 pt-8 pb-6">

      <div className="flex justify-between mb-5">
        <div className="flex gap-2 mb-1">
          {keywords?.map((k, i) => (
            <Badge key={k.id} variant={badgeVariants[i % badgeVariants.length] as 'default' | 'secondary' | 'purple'}>{k.name}</Badge>
          ))}
          {/* <Badge>New</Badge>
          <Badge variant='secondary'>Social</Badge>
          <Badge variant="purple">Solidity</Badge> */}
        </div>
        <span className="font-medium flex gap-2 items-center text-sm">Ongoing {isSponsor && <Link to={`/programs/${program?.id}/edit`}><Settings className="w-4 h-4" /></Link>}</span>
      </div>

      <Link to={`/programs/${id}`} className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <h2 className="text-lg font-bold">
          {/* PROGRAM NAME 1: SAMPLE */}
          {name}
        </h2>
      </Link>
      <div className="mb-4">
        <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
          <span className="inline-block mr-2">{program?.price} {program?.currency}</span>
          <span className="h-3 border-l border-[#B331FF] inline-block" />
          <span className="inline-block ml-2">DEADLINE {format(new Date(program?.deadline ?? new Date()), "dd . MMM . yyyy").toUpperCase()}</span>
        </p>
        {/* <p className="font-sans text-[#71717A] font-normal text-xs leading-7">
          {price} {currency} |  DEADLINE {deadline}
        </p> */}
      </div>

      <div className="mb-6">
        <p className="text-foreground text-sm font-normal leading-5 truncate">{summary}</p>
      </div>

      <div className="flex justify-between">
        <div className="space-x-3">
          <Link to="" className="text-xs font-semibold bg-[#F4F4F5] rounded-full px-2.5 py-0.5 leading-4">
            Submitted Application <span className="text-[#B331FF]">{program.applications?.length ?? 0}</span>
          </Link>
          <Link to="" className="text-xs font-semibold bg-[#18181B] text-white rounded-full px-2.5 py-0.5">
            Approved Application <span className="text-[#FDE047]">{program.applications?.filter(a => a.status === ApplicationStatus.Approved).length ?? 0}</span>
          </Link>
        </div>

        <Link to={`/programs/${id}`} className="flex items-center gap-2 text-sm">See details <ArrowRight className="w-4 h-4" /></Link>
      </div>

      {/* {isBuilder && <Dialog>
        <DialogTrigger asChild>
          <Button onClick={(e) => e.stopPropagation()} className="mt-6 mb-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]">Send a proposal</Button>
        </DialogTrigger>
        <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
          <CreateProposalForm program={program} />
        </DialogContent>
      </Dialog>} */}

      {/* </Link> */}
    </div>
  )
}

export default ProgramCard