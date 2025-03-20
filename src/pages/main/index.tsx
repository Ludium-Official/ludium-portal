import { Badge } from "@/components/ui/badge"

function MainPage() {
  return (
    <div className="mx-10 my-[60px]">
      <section>
        {/* typography/base sizes/5x large/font-size */}
        <Badge className="w-[43px] h-[20px] font-sans">D-3</Badge>
        <h1 className="text-5xl font-bold font-sans mb-3">Main headline</h1>
        <p className="text-lg">additional headline or text</p>
      </section>
    </div>
  )
}

export default MainPage