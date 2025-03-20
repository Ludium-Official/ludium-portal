import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

function ProgramCard({ name, description, deadline, amount, currency }: { name?: string | null, description?: string | null, deadline?: string | null, amount?: string | null, currency?: string | null }) {
  return (
    <div className="w-full border border-[#E9E9E9] rounded-[20px] px-10 py-[18px]">


      <div className="flex justify-between mb-5">
        <div className="flex gap-2 mb-1">
          <Badge>New</Badge>
          <Badge variant='secondary'>Social</Badge>
          <Badge variant="purple">Solidity</Badge>
        </div>
        <span className="font-medium flex gap-2 items-center">Ongoing  <Settings /></span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <h2 className="text-lg font-bold">
          {/* PROGRAM NAME 1: SAMPLE */}
          {name}
        </h2>
      </div>
      <div className="mb-1">
        <p className="font-sans text-[#71717A] font-normal text-xs leading-7">
          {amount} {currency} |  DEADLINE {deadline} {/*30, MAR, 2025*/}
        </p>
      </div>

      <div>
        <p className="text-foreground text-sm font-normal leading-5 truncate">{description}</p>
      </div>

      <Button className="mt-6 mb-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]">Send a proposal</Button>
    </div>
  )
}

export default ProgramCard