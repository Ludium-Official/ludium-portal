
import { useUpdateMilestoneMutation } from "@/apollo/mutation/update-milestone.generated"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Application, MilestoneStatus } from "@/types/types.generated"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

function ApplicationCard({ application, refetch }: { application: Application, refetch: () => void }) {
  const [updateMilestone] = useUpdateMilestoneMutation()

  console.log("🚀 ~ ApplicationCard ~ application:", application)
  return (
    <div className="border rounded-xl p-6">
      <header className="flex justify-between mb-4">
        <Badge>{application.status}</Badge>
        <Link to="" className="flex items-center gap-2 text-sm">See details <ArrowRight className="w-4 h-4" /></Link>
      </header>
      <div className="flex gap-4 items-center mb-2">
        <div className="w-10 h-10 bg-slate-400 rounded-full" />
        <h3 className="text-lg font-bold">{application.applicant?.organizationName}</h3>
      </div>
      <div className="mb-6">
        <span className="text-xs text-muted-foreground">40,000 USDT |  DEADLINE 30, MAR, 2025</span>
      </div>
      <div className="flex justify-between">
        <div>
          <h4 className="text-sm font-bold mb-1">Proposal</h4>
          <p className="truncate max-w-[600px] text-sm">Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS)</p>
        </div>
        <div className="gap-3 flex">
          <Button variant="outline" className="max-h-10">Deny</Button>
          <Button className="max-h-10" onClick={() => {
            updateMilestone({
              variables: {
                input: {
                  id: application.id ?? "",
                  status: MilestoneStatus.RevisionRequested
                }
              },
              onCompleted: () => {
                refetch()
              }
            })
          }}>Select</Button>
        </div>
      </div>
    </div>
  )
}

export default ApplicationCard