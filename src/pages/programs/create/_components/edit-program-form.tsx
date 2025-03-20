import { useKeywordsQuery } from "@/apollo/queries/keywords.generated"
import { useUsersByRoleQuery } from "@/apollo/queries/users-by-role.generated"
import { Button } from "@/components/ui/button"
import { } from "@/components/ui/command"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { SearchSelect } from "@/components/ui/search-select"
// import { MultiSelect } from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

// const frameworksList = [
//   { value: "react", label: "React" },
//   { value: "angular", label: "Angular" },
//   { value: "vue", label: "Vue" },
//   { value: "svelte", label: "Svelte" },
//   { value: "ember", label: "Ember" },
// ];

function EditProgramForm() {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // const [selectedValidator, setSelectedValidator] = useState<string[]>([]);

  const { data: keywords } = useKeywordsQuery()
  const { data: validators } = useUsersByRoleQuery({ variables: { role: "validator" } })

  const keywordOptions = keywords?.keywords?.map(k => ({ value: k.id ?? "", label: k.name ?? "" }))
  const validatorOptions = validators?.usersByRole?.map(v => ({ value: v.id ?? "", label: `${v.email} (${v.organizationName})` }))
  console.log("🚀 ~ EditProgramForm ~ keywords:", keywords)
  console.log("🚀 ~ EditProgramForm ~ validators:", validators)

  return (
    <form>
      <h1 className="font-medium text-xl mb-6">Program</h1>

      <label htmlFor="program-name" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Program name</p>
        <Input id="program-name" type="text" placeholder="Type name" className="h-10" />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
      </label>


      <label htmlFor="keyword" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Keywords</p>
        {/* <Input id="keyword" type="text" placeholder="Type keyword" className="h-10" /> */}
        <MultiSelect
          options={keywordOptions ?? []}
          value={selectedKeywords}
          onValueChange={setSelectedKeywords}
          defaultValue={selectedKeywords}
          placeholder="Select keywords"
          // variant="inverted"
          animation={2}
          maxCount={3}
        />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
      </label>

      <label htmlFor="price" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Price</p>
        <Input id="price" type="number" placeholder="Enter price" className="h-10" />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
      </label>

      <label htmlFor="deadline" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Deadline</p>
        <DatePicker />
        {/* <Input id="deadline" type="number" placeholder="Enter price" /> */}
        <span className="text-[#71717A] text-sm">This is an input description.</span>
      </label>

      <label htmlFor="summary" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Summary</p>
        <Input id="summary" type="number" placeholder="Type summary" className="h-10" />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
      </label>

      <label htmlFor="description" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Description</p>
        <Textarea id="description" placeholder="Type description" />
        <span className="text-[#71717A] text-sm">This is an input description.</span>
      </label>

      <label htmlFor="validators" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Validators</p>
        <SearchSelect options={validatorOptions ?? []} />
        {/* <MultiSelect
          options={validatorOptions ?? []}
          value={selectedValidator}
          onValueChange={setSelectedValidator}
          defaultValue={selectedValidator}
          placeholder="Select keywords"
          // variant="inverted"
          animation={2}
          maxCount={3}
        /> */}
        <span className="text-[#71717A] text-sm">This is an input description.</span>
      </label>

      <label htmlFor="links" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Links</p>
        <span className="block text-[#71717A] text-sm">Add links to your website, blog, or social media profiles.</span>
        <Input id="links" type="text" className="h-10" />

        <Button type="button" variant="outline" size="sm" className="rounded-[6px]">Add URL</Button>
      </label>

      <Button className="px-[32px] py-3 ml-auto block">Save and Upload</Button>
    </form>
  )
}

export default EditProgramForm