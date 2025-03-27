import { useUpdateMilestoneMutation } from "@/apollo/mutation/update-milestone.generated"
import { useApplicationQuery } from "@/apollo/queries/application.generated"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/hooks/use-auth"
import ApplicationCard from "@/pages/programs/details/_components/application-card"
import { MilestoneStatus } from "@/types/types.generated"
import { X } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"

function ProposalDetails() {
  const { email, isValidator } = useAuth()
  const { applicationId } = useParams()
  const { data, refetch } = useApplicationQuery({
    variables: {
      id: applicationId ?? "",
    },
    skip: !applicationId,
  })
  console.log("🚀 ~ ProposalDetails ~ data:", data)

  const [updateMilestone] = useUpdateMilestoneMutation()

  const [description, setDescription] = useState<string>()

  const [links, setLinks] = useState<string[]>([''])

  const submitMilestone = (milestoneId: string) => {
    updateMilestone({
      variables: {
        input: {
          id: milestoneId,
          status: MilestoneStatus.RevisionRequested,
          links: links.map(l => ({ title: l, url: l })),
          description,
        }
      },
      onCompleted: () => {
        refetch()
      }
    })
  }

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
            <div key={m.id} className="border rounded-xl p-6 min-h-[196px]">
              <div className="flex justify-between items-center mb-2">
                <Badge>{m.status}</Badge>
                <span className="text-muted-foreground text-xs">{m.price} {m.currency} | DEADLINE 30, MAR, 2025</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{m.title}</h3>
              <p className="truncate max-w-[600px] text-sm mb-5">Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS) ....</p>

              {m.status === MilestoneStatus.Pending && data.application?.applicant?.email === email && <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-10 block ml-auto">Submit Milestone</Button>
                </DialogTrigger>

                <DialogContent>
                  <h2 className="text-2xl font-semibold">
                    Submit Milestone
                  </h2>

                  <label htmlFor="title">
                    <p className="font-medium text-sm">{m.title}</p>
                    {/* <Input id="title" /> */}

                  </label>

                  <label htmlFor="description">
                    <p className="font-medium text-sm">Description</p>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" />
                  </label>

                  <label htmlFor="links" className="space-y-2 block mb-10">
                    <p className="text-sm font-medium">Links</p>
                    <span className="block text-[#71717A] text-sm">Add links to your website, blog, or social media profiles.</span>

                    {links.map((l, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <div key={idx} className="flex items-center gap-2">
                        <Input className="h-10 max-w-[431.61px]" value={l} onChange={(e) => {
                          setLinks((prev) => {
                            const newLinks = [...prev]
                            newLinks[idx] = e.target.value
                            return newLinks
                          })
                        }} />
                        {idx !== 0 && <X onClick={() => setLinks((prev) => {
                          const newLinks = [...[...prev].slice(0, idx), ...[...prev].slice(idx + 1)]

                          return newLinks
                        })} />}
                      </div>
                    ))}
                    <Button onClick={() => setLinks((prev) => [...prev, ''])} type="button" variant="outline" size="sm" className="rounded-[6px]">Add URL</Button>
                    {/* {extraErrors.validator && <span className="text-red-400 text-sm block">Links is required</span>} */}

                  </label>

                  <Button className="bg-[#B331FF] hover:bg-[#B331FF]/90 max-w-[165px] w-full ml-auto h-10" onClick={() => submitMilestone(m.id ?? '')}>Submit Milestone</Button>
                </DialogContent>
              </Dialog>}


              {m.status === MilestoneStatus.RevisionRequested && isValidator && <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-10 block ml-auto">Check Milestone</Button>
                </DialogTrigger>

                <DialogContent>
                  <h2 className="text-2xl font-semibold">
                    Review Milestone
                  </h2>

                  <label htmlFor="title">
                    <p className="font-medium text-sm">{m.title}</p>
                    {/* <Input id="title" /> */}

                  </label>

                  <label htmlFor="description">
                    <p className="font-medium text-sm mb-2">Description</p>
                    <Textarea value={m.description ?? ''} disabled id="description" />
                  </label>

                  <div className="space-y-2">
                    <p className="font-medium text-sm">Links</p>
                    {m.links?.map(l => (
                      <Input key={l.url} value={l.url ?? ""} disabled className="h-10 max-w-[431.61px]" />
                    ))}
                  </div>

                  <div className="w-full flex justify-between">
                    <Button variant="outline" className="max-w-[165px] w-full h-10" onClick={() => updateMilestone({ variables: { input: { id: m.id ?? "", status: MilestoneStatus.Pending } } })}>Reject milestone</Button>
                    <Button className="bg-[#B331FF] hover:bg-[#B331FF]/90 max-w-[165px] w-full h-10" onClick={() => updateMilestone({ variables: { input: { id: m.id ?? "", status: MilestoneStatus.Completed } } })}>Accept Milestone</Button>
                  </div>
                </DialogContent>
              </Dialog>}
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default ProposalDetails