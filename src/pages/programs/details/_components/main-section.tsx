import client from "@/apollo/client"
import { useAcceptProgramMutation } from "@/apollo/mutation/accept-program.generated"
// import { usePublishProgramMutation } from "@/apollo/mutation/publish-program.generated"
import { useRejectProgramMutation } from "@/apollo/mutation/reject-program.generated"
import { ProgramDocument } from "@/apollo/queries/program.generated"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { contractAbi } from "@/lib/contract"
import { useAuth } from "@/lib/hooks/use-auth"
import { formatProgramStatus } from "@/lib/utils"
import { wepinProvider } from "@/lib/wepin"
import type { Program } from "@/types/types.generated"
import { format } from "date-fns"
import { ethers } from "ethers"
import { Settings, TriangleAlert } from "lucide-react"
import { Link } from "react-router"
import CreateApplicationForm from "./create-application-form"

function MainSection({ program }: { program?: Program | null }) {
  const { userId } = useAuth()
  const badgeVariants = ['teal', 'orange', 'pink']

  const programActionOptions = {
    variables: { id: program?.id ?? '' },
    onCompleted: () => { client.refetchQueries({ include: [ProgramDocument] }) }
  }

  const [acceptProgram] = useAcceptProgramMutation(programActionOptions)
  // const [publishProgram] = usePublishProgramMutation(programActionOptions)
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
            <span className="font-medium flex gap-2 items-center text-sm">{formatProgramStatus(program)} {program?.creator?.id === userId && <Link to={`/programs/${program?.id}/edit`}><Settings className="w-4 h-4" /></Link>}</span>
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

        {program?.status === 'published' && program.creator?.id !== userId && program.validator?.id !== userId && (
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={(e) => e.stopPropagation()} className="mt-6 mb-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]">Send an application</Button>
            </DialogTrigger>
            <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
              <CreateApplicationForm program={program} />
            </DialogContent>
          </Dialog>)}

        {program?.validator?.id === userId && program.status === 'draft' && (
          <div className="flex justify-end gap-4">
            <Button onClick={() => rejectProgram()} variant="outline" className="h-11 w-[118px]">Reject</Button>
            <Button onClick={() => acceptProgram()} className="h-11 w-[118px]">Confirm</Button>
          </div>
        )}

        {program?.creator?.id === userId && program.status === 'payment_required' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-6 mb-3 text-sm font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]">Pay</Button>
            </DialogTrigger>
            <DialogContent className="w-[400px] p-6 max-h-screen overflow-y-auto">
              <div className="text-center">
                <span className="text-red-600 w-[42px] h-[42px] rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <TriangleAlert />
                </span>
                <DialogTitle className="font-semibold text-lg text-[#18181B] mb-2">Are you sure to pay the settlement for the program?</DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm mb-4">The amount will be securely stored until you will
                  confirm the completion of the project.</DialogDescription>
                <Button className="w-full" onClick={async () => {

                  const wpnProvider = await wepinProvider.getProvider('evmopencampus-testnet')

                  const provider = new ethers.providers.Web3Provider(wpnProvider);
                  const signer = provider.getSigner();

                  console.log("import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS", import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS)
                  const contract = new ethers.Contract(
                    import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS,
                    contractAbi,
                    signer,
                  );
                  console.log("🚀 ~ <ButtonclassName= onClick={ ~ signer:", signer)

                  console.log('Program Name:', program?.name ?? '');
                  console.log('Program Price:', program?.price ?? 0);
                  console.log('Start Time:', Date.now() / 1000);
                  console.log("deadline", program?.deadline)
                  console.log("deadline new date", new Date(program?.deadline).getTime() / 1000)
                  console.log('End Time:', (program?.deadline ? new Date(program?.deadline).getTime() : Date.now()) / 1000);
                  console.log('Validator Address:', program.validator?.wallet?.address);
                  console.log('Summary:', program?.summary ?? '');
                  console.log('Description:', program?.description ?? '');
                  console.log('Links:', program?.links ?? []);
                  console.log('Value:', { value: program?.price ?? 0 });

                  // Call the smart contract function with proper parameters

                  const price = ethers.utils.parseEther(program?.price ?? '0')
                  // const price = '0.001'
                  const tx = await contract.createEduProgram(
                    program?.name ?? '',
                    price,
                    program?.keywords?.map(k => k.name) ?? [],
                    Math.floor(Date.now() / 1000),
                    Math.floor((program?.deadline ? new Date(program?.deadline).getTime() : Date.now()) / 1000),
                    program.validator?.wallet?.address ?? '',
                    program?.summary ?? '',
                    program?.description ?? '',
                    program?.links?.map(l => l.url) ?? [],
                    { value: price }
                  );

                  console.log("tx", tx)

                  const receipt = await tx.wait()

                  console.log("tx RECEIPT", receipt)


                  const event = receipt.events.find((e: { event: string }) => e.event === 'ProgramCreated');
                  const programId = event?.args[0]
                  console.log("programId", programId)

                  console.log("event", event)

                  // publishProgram()


                }}>Yes, Pay now</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </section>

      <section className="px-10 py-[60px] w-full max-w-[40%] bg-white">
        <div className="border rounded-xl w-full p-6 mb-6">
          <h2 className="flex gap-4 items-center text-lg font-bold mb-5">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            PROGRAM SPONSOR
          </h2>

          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Name</p>
            <p className="text-xs">{program?.creator?.organizationName}</p>
          </div>

          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Summary</p>
            <p className="text-xs">{program?.creator?.about}</p>
          </div>


          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Email</p>
            <p className="text-xs">
              {program?.creator?.email}
            </p>
          </div>

          <div className="flex gap-3">
            <p className="text-xs font-bold w-[57px]">Links</p>
            <div>
              {program?.creator?.links?.map((l) => <p className="text-xs" key={l.url}>{l.url}</p>)}
            </div>
          </div>
        </div>

        {program?.validator && <div className="border rounded-xl w-full p-6">
          <h2 className="flex gap-4 items-center text-lg font-bold mb-5">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            PROGRAM VALIDATOR
          </h2>

          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Name</p>
            <p className="text-xs">{program?.validator?.organizationName}</p>
          </div>

          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Summary</p>
            <p className="text-xs">{program?.validator?.about}</p>
          </div>

          <div className="flex gap-3 mb-4">
            <p className="text-xs font-bold w-[57px]">Email</p>
            <p className="text-xs">
              {program?.validator?.email}
            </p>
          </div>

          <div className="flex gap-3">
            <p className="text-xs font-bold w-[57px]">Links</p>
            <div>
              {program?.validator?.links?.map((l) => <p className="text-xs" key={l.url}>{l.url}</p>)}
            </div>
          </div>
        </div>}
      </section>
    </div>
  )
}

export default MainSection