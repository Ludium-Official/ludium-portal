import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function EditProgramForm() {
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
        <Input id="keyword" type="text" placeholder="Type keyword" className="h-10" />
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
        <Input id="validators" type="number" placeholder="Enter price" className="h-10" />
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