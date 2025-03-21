import { useProgramsQuery } from "@/apollo/queries/programs.generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgramCard from "@/pages/programs/_components/program-card";
import { CirclePlus, ListFilter, } from "lucide-react";
import { useNavigate } from "react-router";

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 10,
        offset: 0
      }
    }
  })
  console.log("🚀 ~ data:", data)


  return (
    <Tabs className="p-10 pr-[55px]">
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
          <Button className="h-[32px] rounded-[6px] gap-2" onClick={() => navigate('create')}><CirclePlus /> Create Program</Button>
        </div>
      </section>


      <section className="w-full space-y-4">
        {data?.programs?.data?.map((program) => <ProgramCard key={program.id} program={program} />)}

      </section>
    </Tabs>
  );
};

export default ProgramsPage;