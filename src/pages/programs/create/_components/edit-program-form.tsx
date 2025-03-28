import { useCreateProgramMutation } from "@/apollo/mutation/create-program.generated"
import { useKeywordsQuery } from "@/apollo/queries/keywords.generated"
import { useUsersByRoleQuery } from "@/apollo/queries/users-by-role.generated"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { SearchSelect } from "@/components/ui/search-select"
// import { MultiSelect } from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { X } from "lucide-react"
import { useReducer, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"


function EditProgramForm() {
  const [deadline, setDeadline] = useState<Date>()
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedValidator, setSelectedValidator] = useState<string>();
  console.log("🚀 ~ EditProgramForm ~ selectedValidator:", selectedValidator)

  const { data: keywords } = useKeywordsQuery()
  const { data: validators } = useUsersByRoleQuery({ variables: { role: "validator" } })
  const [extraErrors, dispatchErrors] = useReducer(extraErrorReducer, { keyword: false, deadline: false, validator: false, links: false })

  const keywordOptions = keywords?.keywords?.map(k => ({ value: k.id ?? "", label: k.name ?? "" }))
  const validatorOptions = validators?.usersByRole?.map(v => ({ value: v.id ?? "", label: `${v.email} (${v.organizationName})` }))
  console.log("🚀 ~ EditProgramForm ~ keywords:", keywords)
  console.log("🚀 ~ EditProgramForm ~ validators:", validators)

  const navigate = useNavigate()

  const [createProgram] = useCreateProgramMutation()


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      programName: "",
      price: "",
      description: "",
      summary: "",
    },
  })

  const [links, setLinks] = useState<string[]>([''])

  const onSubmit = (data: {
    programName: string,
    price: string,
    description: string,
    summary: string,
  }) => {
    if (extraErrors.deadline || extraErrors.keyword || extraErrors.links || extraErrors.validator) return

    createProgram({
      variables: {
        input: {
          name: data.programName,
          price: data.price,
          description: data.description,
          summary: data.summary,
          currency: "ETH",
          deadline: deadline ? format(deadline, 'yyyy-MM-dd') : undefined,
          keywords: selectedKeywords,
          validatorId: selectedValidator ?? "",
          links: links.map(l => ({ title: l, url: l })),
        }
      },
      onCompleted: () => {
        navigate('/programs')
      }
    })
  }

  const extraValidation = () => {
    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS })
    if (!selectedKeywords?.length) dispatchErrors({ type: ExtraErrorActionKind.SET_KEYWORDS_ERROR })
    if (!selectedValidator) dispatchErrors({ type: ExtraErrorActionKind.SET_VALIDATOR_ERROR })
    if (!deadline) dispatchErrors({ type: ExtraErrorActionKind.SET_DEADLINE_ERROR })
    if (!links?.[0]) dispatchErrors({ type: ExtraErrorActionKind.SET_LINKS_ERROR })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-medium text-xl mb-6">Program</h1>

      <label htmlFor="programName" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Program name</p>
        <Input id="programName" type="text" placeholder="Type name" className="h-10" {...register("programName", { required: true })} />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
        {errors.programName && <span className="text-red-400 text-sm block">Program name is required</span>}

      </label>


      <label htmlFor="keyword" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Keywords</p>
        <MultiSelect
          options={keywordOptions ?? []}
          value={selectedKeywords}
          onValueChange={setSelectedKeywords}
          defaultValue={selectedKeywords}
          placeholder="Select keywords"
          animation={2}
          maxCount={3}
        />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
        {extraErrors.keyword && <span className="text-red-400 text-sm block">Keywords is required</span>}

      </label>

      <label htmlFor="price" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Price</p>
        <Input id="price" type="number" placeholder="Enter price" className="h-10" {...register("price", { required: true })} />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
        {errors.price && <span className="text-red-400 text-sm block">Price is required</span>}

      </label>

      <label htmlFor="deadline" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Deadline</p>
        <DatePicker date={deadline} setDate={setDeadline} />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
        {extraErrors.deadline && <span className="text-red-400 text-sm block">Deadline is required</span>}

      </label>

      <label htmlFor="summary" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Summary</p>
        <Input id="summary" type="text" placeholder="Type summary" className="h-10" {...register("summary", { required: true })} />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
        {errors.summary && <span className="text-red-400 text-sm block">Summary is required</span>}

      </label>

      <label htmlFor="description" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Description</p>
        <Textarea id="description" placeholder="Type description" {...register("description", { required: true })} />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
        {errors.description && <span className="text-red-400 text-sm block">Description is required</span>}

      </label>

      <label htmlFor="validator" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Validators</p>
        <SearchSelect options={validatorOptions ?? []} value={selectedValidator} setValue={setSelectedValidator} />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
        {extraErrors.validator && <span className="text-red-400 text-sm block">Validator is required</span>}
      </label>

      <label htmlFor="links" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Links</p>
        <span className="block text-[#71717A] text-sm">Add links to your website, blog, or social media profiles.</span>

        {links.map((l, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={idx} className="flex items-center gap-2">
            <Input className="h-10 max-w-[555px]" value={l} onChange={(e) => {
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
        {extraErrors.validator && <span className="text-red-400 text-sm block">Links is required</span>}

      </label>


      <Button type="submit" className="px-[32px] py-3 ml-auto block" onClick={() => {
        extraValidation()
      }}>Save and Upload</Button>
    </form>
  )
}

export default EditProgramForm

enum ExtraErrorActionKind {
  SET_KEYWORDS_ERROR = 'SET_KEYWORDS_ERROR',
  SET_VALIDATOR_ERROR = 'SET_VALIDATOR_ERROR',
  SET_DEADLINE_ERROR = 'SET_DEADLINE_ERROR',
  SET_LINKS_ERROR = 'SET_LINKS_ERROR',
  CLEAR_ERRORS = 'CLEAR_ERRORS',
}

interface ExtraErrorAction {
  type: ExtraErrorActionKind;
}

interface ExtraErrorState {
  keyword: boolean;
  validator: boolean;
  deadline: boolean;
  links: boolean;
}

function extraErrorReducer(state: ExtraErrorState, action: ExtraErrorAction) {
  const { type } = action;
  switch (type) {
    case ExtraErrorActionKind.SET_KEYWORDS_ERROR:
      return {
        ...state,
        keyword: true,
      };
    case ExtraErrorActionKind.SET_DEADLINE_ERROR:
      return {
        ...state,
        deadline: true,
      };
    case ExtraErrorActionKind.SET_VALIDATOR_ERROR:
      return {
        ...state,
        validator: true,
      };
    case ExtraErrorActionKind.SET_LINKS_ERROR:
      return {
        ...state,
        links: true,
      };
    case ExtraErrorActionKind.CLEAR_ERRORS:
      return {
        keyword: false,
        validator: false,
        deadline: false,
        links: false,
      };
    default:
      return state;
  }
}