import { useProgramQuery } from "@/apollo/queries/program.generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/use-auth";
import ApplicationCard from "@/pages/programs/details/_components/application-card";
import MainSection from "@/pages/programs/details/_components/main-section";
import { ApplicationStatus } from "@/types/types.generated";
import { ListFilter } from "lucide-react";
import { useParams } from "react-router";

const DetailsPage: React.FC = () => {
  const { isValidator, email } = useAuth()
  const { id } = useParams()

  const { data, refetch } = useProgramQuery({
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
        <h2 className="text-xl font-bold mb-4">Applications</h2>
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

        <section className="space-y-5">
          {data?.program?.applications?.map(a => (
            <ApplicationCard key={a.id} application={a} refetch={refetch} hideControls={!isValidator || a.status !== ApplicationStatus.Pending || program?.validator?.email !== email} />
          ))}
        </section>
      </Tabs>
    </div>
  );
};

export default DetailsPage;