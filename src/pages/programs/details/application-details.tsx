import { useApplicationQuery } from "@/apollo/queries/application.generated"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ApplicationCard from "@/pages/programs/details/_components/application-card"
import { useParams } from "react-router"

function ProposalDetails() {
  const { applicationId } = useParams()
  const { data } = useApplicationQuery({
    variables: {
      id: applicationId ?? "",
    },
    skip: !applicationId,
  })
  console.log("🚀 ~ ProposalDetails ~ data:", data)

  return (
    <div className="bg-[#F7F7F7]">
      <div className="p-10 rounded-b-2xl bg-white">
        <h2 className="text-xl font-bold mb-4">Proposal</h2>
        <section className="space-y-5">
          <ApplicationCard application={data?.application} hideSeeDetails={true} hideControls={true} />
        </section>

      </div>

      <div className="mt-3 p-10 rounded-t-2xl bg-white">
        <h2 className="text-xl font-bold mb-4">Milestones</h2>
        <section className="space-y-10">
          {data?.application?.milestones?.map(m => (
            <div key={m.id} className="border rounded-xl p-6">
              <div className="flex justify-between items-center mb-2">
                <Badge>{m.status}</Badge>
                <span className="text-muted-foreground text-xs">{m.price} {m.currency} | DEADLINE 30, MAR, 2025</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{m.title}</h3>
              <p className="truncate max-w-[600px] text-sm mb-5">Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS) ....</p>
              <Button className="h-10 block ml-auto">Submit Milestone</Button>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default ProposalDetails