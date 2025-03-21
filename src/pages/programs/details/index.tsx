import { useProgramQuery } from "@/apollo/queries/program.generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainSection from "@/pages/programs/details/_components/main-section";
import { ListFilter } from "lucide-react";
import { useParams } from "react-router";

const DetailsPage: React.FC = () => {
  const { id } = useParams()

  const { data } = useProgramQuery({
    variables: {
      id: id ?? ''
    }
  })
  console.log("🚀 ~ data.program:", data?.program)

  const program = data?.program

  return (
    <div className="bg-[#F7F7F7]">
      <MainSection program={program} />


      <Tabs className="mt-3 bg-white p-10 rounded-t-2xl">
        <h2>Proposals</h2>
        <section className="flex justify-between items-center mb-3">
          <TabsList className="">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="my-programs">My programs</TabsTrigger>
            <TabsTrigger value="by-newest">By newest</TabsTrigger>
            <TabsTrigger value="by-size">By size</TabsTrigger>
          </TabsList>
          <div className="h-10 flex items-center gap-3">
            <Input className="h-full w-[432px]" />
            <Button variant="outline" className="h-full rounded-[6px] "><ListFilter /> Filter</Button>
            {/* <Button className="h-[32px] rounded-[6px] gap-2" onClick={() => navigate('create')}><CirclePlus /> Create Program</Button> */}
          </div>
        </section>
      </Tabs>
    </div>
  );
};

export default DetailsPage;