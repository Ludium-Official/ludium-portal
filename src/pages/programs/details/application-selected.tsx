import { useSubmitMilestoneMutation } from "@/apollo/mutation/submit-milestone.generated";
import { useApplicationQuery } from "@/apollo/queries/application.generated";
import { useProgramQuery } from "@/apollo/queries/program.generated";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/use-auth";
// import { useAuth } from "@/lib/hooks/use-auth";
import ApplicationCard from "@/pages/programs/details/_components/application-card";
import MainSection from "@/pages/programs/details/_components/main-section";
import { MilestoneStatus } from "@/types/types.generated";
import { format } from "date-fns";
// import { ApplicationStatus } from "@/types/types.generated";
import { X } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

const ApplicationSelected: React.FC = () => {

  const { email } = useAuth()
  const [description, setDescription] = useState<string>()

  const [links, setLinks] = useState<string[]>([''])

  const [submitMutation] = useSubmitMilestoneMutation()


  const { id, applicationId } = useParams()

  const { data, refetch } = useProgramQuery({
    variables: {
      id: id ?? ''
    }
  })
  const { data: applicationData, refetch: appRefetch } = useApplicationQuery({
    variables: {
      id: applicationId ?? "",
    },
    skip: !applicationId,
  })

  const submitMilestone = (milestoneId: string) => {
    submitMutation({
      variables: {
        input: {
          id: milestoneId,
          // status: MilestoneStatus.RevisionRequested,
          links: links.map(l => ({ title: l, url: l })),
          description,
        }
      },
      onCompleted: () => {
        refetch()
        appRefetch()
      }
    })
  }

  const program = data?.program

  const application = program?.applications?.find(a => a.id === applicationId)

  return (
    <div className="bg-[#F7F7F7]">
      <MainSection program={program} />

      <div className="mt-3 bg-white p-10 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Application</h2>
        <section className="space-y-5">
          <ApplicationCard application={application} refetch={refetch} hideControls={true} />
        </section>
      </div>

      <div className="mt-3 p-10 rounded-t-2xl bg-white">
        <h2 className="text-xl font-bold mb-4">Milestones</h2>
        <section className="space-y-10">
          {applicationData?.application?.milestones?.map(m => (
            <div key={m.id} className="border rounded-xl p-6 min-h-[196px]">
              <div className="flex justify-between items-center mb-2">
                <Badge>{m.status}</Badge>

                <div className="mb-1">
                  <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
                    <span className="inline-block mr-2">{m?.price} {m?.currency}</span>
                    <span className="h-3 border-l border-[#B331FF] inline-block" />
                    <span className="inline-block ml-2">DEADLINE {format(new Date(program?.deadline ?? new Date()), "dd . MMM . yyyy").toUpperCase()}</span>
                  </p>
                </div>
                {/* <span className="text-muted-foreground text-xs">{m.price} {m.currency} | DEADLINE 30, MAR, 2025</span> */}
              </div>
              <h3 className="text-lg font-bold mb-2">{m.title}</h3>
              <p className="truncate max-w-[600px] text-sm mb-5">{m.description}</p>

              {m.status === MilestoneStatus.Pending && applicationData.application?.applicant?.email === email && <Dialog>
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
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ApplicationSelected;