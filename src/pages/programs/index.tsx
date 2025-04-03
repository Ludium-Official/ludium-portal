import { useProgramsQuery } from "@/apollo/queries/programs.generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageSize, Pagination } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/use-auth";
import ProgramCard from "@/pages/programs/_components/program-card";
import { CirclePlus, ListFilter, } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

const ProgramsPage: React.FC = () => {
  const { isSponsor } = useAuth()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data } = useProgramsQuery({
    variables: {
      pagination: {
        limit: PageSize,
        offset: (currentPage - 1) * PageSize
      }
    }
  })

  const totalCount = data?.programs?.count ?? 0
  console.log("🚀 ~ totalCount:", totalCount)
  const totalPages = data?.programs?.count ? Math.floor(data?.programs?.count / 5 + 1) : 0
  console.log("🚀 ~ totalPages:", totalPages)
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
          {isSponsor && <Button className="h-[32px] rounded-[6px] gap-2" onClick={() => navigate('create')}><CirclePlus /> Create Program</Button>}
        </div>
      </section>


      <section className="w-full space-y-4 mb-5">
        {data?.programs?.data?.map((program) => <ProgramCard key={program.id} program={program} />)}
      </section>


      <Pagination totalCount={totalCount} />
    </Tabs>
  );
};

export default ProgramsPage;