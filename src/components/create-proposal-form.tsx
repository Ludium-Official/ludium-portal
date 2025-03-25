import { useCreateApplicationMutation } from "@/apollo/mutation/create-application.generated"
import { useCreateMilestonesMutation } from "@/apollo/mutation/create-milestones.generated"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Program } from "@/types/types.generated"
import { useState } from "react"

type MilestoneType = {
  title: string,
  price: string,
  description: string,
  currency: string,
}

const emptyMilestone = {
  title: "",
  price: "",
  description: "",
  currency: "ETH"
}

function CreateProposalForm({ program }: { program: Program }) {
  console.log("🚀 ~ CreateProposalForm ~ program:", program)
  const [milestones, setMilestones] = useState<MilestoneType[]>([emptyMilestone])

  const [createApplication] = useCreateApplicationMutation()
  const [createMilestones] = useCreateMilestonesMutation()

  console.log("🚀 ~ CreateProposalForm ~ milestones:", milestones)

  const onSubmit = () => {
    createApplication({
      variables: {
        input: {
          programId: program.id ?? '',
          content: "",
        }
      },
      onCompleted: (data) => {
        createMilestones({
          variables: {
            input: milestones.map(m => ({
              applicationId: data.createApplication?.id ?? "",
              price: m.price,
              title: m.title,
              description: m.description,
              currency: m.currency
            }))
          }
        })
      }
    })
  }

  return (
    <form>
      <h2 className="text-2xl font-semibold mb-6">Send a proposal</h2>

      {milestones.map((m, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <No other way>
        <div key={idx} className="mb-6">
          <div className="flex items-end w-full gap-4 mb-4">
            <label htmlFor={`title${idx}`} className="w-full">
              <p className="text-sm font-medium mb-2">MILESTONE {idx + 1}</p>
              <Input id={`title${idx}`} className="h-10 w-full" value={m.title} onChange={e => {
                const newMilestone = { ...m }
                newMilestone.title = e.target.value
                setMilestones(prev => [...prev.slice(0, idx), newMilestone, ...prev.slice(idx + 1)])
              }} />
            </label>
            <div className="flex items-end gap-2 w-full">
              <label htmlFor={`price${idx}`} className="w-full">
                <p className="text-sm font-medium mb-2">PRICE</p>
                <Input id={`price${idx}`} className="h-10 w-full" value={m.price} onChange={e => {
                  const newMilestone = { ...m }
                  newMilestone.price = e.target.value
                  setMilestones(prev => [...prev.slice(0, idx), newMilestone, ...prev.slice(idx + 1)])
                }} />
              </label>
              <Button variant="outline" className="h-10">ETH</Button>
            </div>
          </div>
          <Textarea className="mb-3" />


          {milestones.length > 1 && <Button type="button" className="mr-2" size="sm" variant="outline" onClick={() => setMilestones(prev => [...prev.slice(0, idx), ...prev.slice(idx + 1)])}>Delete</Button>}
          {idx === milestones.length - 1 && <Button type="button" size="sm" onClick={() => setMilestones((prev) => [...prev, emptyMilestone])}>+ Add more</Button>}
        </div>
      ))}

      <Button type="button" className="bg-[#861CC4] h-10 ml-auto block hover:bg-[#861CC4]/90" onClick={onSubmit}>SUBMIT PROPOSAL</Button>
    </form>
  )
}

export default CreateProposalForm