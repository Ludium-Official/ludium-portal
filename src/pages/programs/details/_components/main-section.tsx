import client from "@/apollo/client"
import { usePublishProgramMutation } from "@/apollo/mutation/publish-program.generated"
import { useRejectProgramMutation } from "@/apollo/mutation/reject-program.generated"
import { ProgramDocument } from "@/apollo/queries/program.generated"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/lib/hooks/use-auth"
import type { Program } from "@/types/types.generated"
import { format } from "date-fns"
import { Settings } from "lucide-react"
import { Link } from "react-router"
import CreateProposalForm from "./create-proposal-form"

function MainSection({ program }: { program?: Program | null }) {
  const { isBuilder, isSponsor, userId } = useAuth()
  const badgeVariants = ['teal', 'orange', 'pink']

  const programActionOptions = {
    variables: { id: program?.id ?? '' },
    onCompleted: () => { client.refetchQueries({ include: [ProgramDocument] }) }
  }

  const [publishProgram] = usePublishProgramMutation(programActionOptions)
  const [rejectProgram] = useRejectProgramMutation(programActionOptions)

  return (
    <div className="flex bg-white rounded-b-2xl">
      <section className=" w-full max-w-[60%] border-r px-10 pt-5 pb-[50px]">
        <div className="w-full mb-9">
          <div className="flex justify-between mb-5">
            <div className="flex gap-2 mb-1">
              {program?.keywords?.map((k, i) => (
                <Badge key={k.id} variant={badgeVariants[i % badgeVariants.length] as "default" | "secondary" | "purple"}>{k.name}</Badge>
              ))}
            </div>
            <span className="font-medium flex gap-2 items-center text-sm">Ongoing {isSponsor && <Link to={`/programs/${program?.id}/edit`}><Settings className="w-4 h-4" /></Link>}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <h2 className="text-lg font-bold">
              {program?.name}
            </h2>
          </div>
          <div className="mb-1">
            <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
              <span className="inline-block mr-2">{program?.price} {program?.currency}</span>
              <span className="h-3 border-l border-[#B331FF] inline-block" />
              <span className="inline-block ml-2">DEADLINE {format(new Date(program?.deadline ?? new Date()), "dd . MMM . yyyy").toUpperCase()}</span>
            </p>
          </div>
        </div>

        <div className="mb-9">
          <h3 className="text-lg font-bold mb-3">SUMMARY</h3>
          <p className="text-slate-600 text-sm">{program?.summary}</p>
        </div>

        <div className="mb-9">
          <h3 className="text-lg font-bold mb-3">DESCRIPTION</h3>
          <p className="text-slate-600 text-sm">{program?.description}</p>
        </div>

        <div className="mb-9">
          <h3 className="text-lg font-bold mb-3">LINKS</h3>
          {program?.links?.map(l => (
            <p key={l.url} className="text-slate-600 text-sm">{l?.url}</p>
          ))}
        </div>

        {isBuilder && program?.status === 'published' && <Dialog>
          <DialogTrigger asChild>
            <Button onClick={(e) => e.stopPropagation()} className="mt-6 mb-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]">Send a proposal</Button>
          </DialogTrigger>
          <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
            <CreateProposalForm program={program} />
          </DialogContent>
        </Dialog>}

        {program?.validator?.id === userId && program.status === 'draft' && (
          <div className="flex justify-end gap-4">
            <Button onClick={() => rejectProgram()} variant="outline" className="h-11 w-[118px]">Reject</Button>
            <Button onClick={() => publishProgram()} className="h-11 w-[118px]">Confirm</Button>
          </div>
        )}
      </section>

      <section className="px-10 py-[60px] w-full max-w-[40%] bg-white">
        <div className="border rounded-xl w-full p-6 mb-6">
          <h2 className="flex gap-4 items-center text-lg font-bold mb-5">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            PROGRAM SPONSOR
          </h2>

          <div className="flex gap-2 mb-4">
            <p className="text-xs font-bold w-[57px]">Name</p>
            <p className="text-xs">{program?.creator?.organizationName}</p>
          </div>

          <div className="flex gap-2">
            <p className="text-xs font-bold w-[57px]">Email</p>
            <p className="text-xs">
              {program?.creator?.email}
            </p>
          </div>
        </div>

        <div className="border rounded-xl w-full p-6">
          <h2 className="flex gap-4 items-center text-lg font-bold mb-5">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            PROGRAM VALIDATOR
          </h2>

          <div className="flex gap-2 mb-4">
            <p className="text-xs font-bold w-[57px]">Name</p>
            <p className="text-xs">{program?.validator?.organizationName}</p>
          </div>

          <div className="flex gap-2">
            <p className="text-xs font-bold w-[57px]">Email</p>
            <p className="text-xs">
              {program?.validator?.email}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MainSection