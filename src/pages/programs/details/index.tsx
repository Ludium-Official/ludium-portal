import { useProgramQuery } from '@/apollo/queries/program.generated';
import { Tabs } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import ApplicationCard from '@/pages/programs/details/_components/application-card';
import MainSection from '@/pages/programs/details/_components/main-section';
import { ApplicationStatus } from '@/types/types.generated';
import { useEffect } from 'react';
import { useParams } from 'react-router';

const DetailsPage: React.FC = () => {
  const { userId } = useAuth();
  const { id } = useParams();

  const { data, refetch } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
  });

  const program = data?.program;

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="bg-[#F7F7F7]">
      <MainSection program={program} />

      <Tabs className="mt-3 bg-white p-10 rounded-t-2xl" id="applications">
        <h2 className="text-xl font-bold mb-4">Applications</h2>
        <section className="flex justify-between items-center mb-3">
          {/* <TabsList className="">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="my-programs">My programs</TabsTrigger>
            <TabsTrigger value="by-newest">By newest</TabsTrigger>
            <TabsTrigger value="by-size">By size</TabsTrigger>
          </TabsList> */}
        </section>

        {
          <section className="space-y-5">
            {!data?.program?.applications?.length && (
              <div className="text-slate-600 text-sm">No applications yet.</div>
            )}
            {data?.program?.applications?.map((a) => (
              <ApplicationCard
                key={a.id}
                application={a}
                refetch={refetch}
                hideControls={
                  a.status !== ApplicationStatus.Pending || program?.validator?.id !== userId
                }
              />
            ))}
          </section>
        }
      </Tabs>
    </div>
  );
};

export default DetailsPage;
