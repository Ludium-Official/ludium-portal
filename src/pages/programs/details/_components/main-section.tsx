import { Badge } from "@/components/ui/badge"
import type { Program } from "@/types/types.generated"
import { Settings } from "lucide-react"

function MainSection({ program }: { program?: Program | null }) {
  const badgeVariants = ['default', 'secondary', 'purple']

  return (
    <div className="flex bg-white rounded-b-2xl">
      <section className=" w-full max-w-[60%] border-r px-10 pt-5 pb-[50px]">
        <div className="w-full mb-9">
          <div className="flex justify-between mb-5">
            <div className="flex gap-2 mb-1">
              {program?.keywords?.map((k, i) => (
                <Badge key={k.id} variant={badgeVariants[i % badgeVariants.length] as "default" | "secondary" | "purple"}>{k.name}</Badge>
              ))}
              {/* <Badge variant="default">New</Badge>
              <Badge variant='secondary'>Social</Badge>
              <Badge variant="purple">Solidity</Badge> */}
            </div>
            <span className="font-medium flex gap-2 items-center">Ongoing  <Settings /></span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <h2 className="text-lg font-bold">
              {/* PROGRAM NAME 1: SAMPLE */}
              {program?.name}
            </h2>
          </div>
          <div className="mb-1">
            <p className="font-sans text-[#71717A] font-normal text-xs leading-7">
              {program?.price} {program?.currency} |  DEADLINE {program?.deadline} {/*30, MAR, 2025*/}
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