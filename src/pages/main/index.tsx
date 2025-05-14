import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import thumbnail from '@/assets/thumbnail.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDraggableScroll } from '@/lib/hooks/use-draggable-scroll';
import { ApplicationStatus } from '@/types/types.generated';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

function MainPage() {
  const badgeVariants = ['teal', 'orange', 'pink'];
  const { data } = useProgramsQuery();
  const scrollRef = useDraggableScroll();

  return (
    <div className="mx-10 my-[60px]">
      <section className="flex justify-between items-center mb-20">
        <div>
          <Badge className="w-[43px] h-[20px] font-sans">D-3</Badge>
          <h1 className="text-5xl font-bold font-sans mb-3">Main headline</h1>
          <p className="text-lg mb-15">additional headline or text</p>
          <Button type="button" variant="purple" className="w-[152px] h-11">
            VIEW DETAIL
          </Button>
        </div>
        <img src={thumbnail} alt="main" className="rounded-lg" />
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold font-sans mb-3">Programs</h2>
          <Link to="/programs" className="flex items-center gap-2">
            View more
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto whitespace-nowrap pb-4 cursor-grab active:cursor-grabbing select-none"
        >
          {data?.programs?.data?.map((program) => (
            <div key={program.id} className="border min-w-[425px] p-6 rounded-lg">
              <div className="flex justify-between mb-5">
                <div className="flex gap-2 mb-1">
                  {program?.keywords?.map((k, i) => (
                    <Badge
                      key={k.id}
                      variant={
                        badgeVariants[i % badgeVariants.length] as
                          | 'default'
                          | 'secondary'
                          | 'purple'
                      }
                    >
                      {k.name}
                    </Badge>
                  ))}
                </div>
                {/* <span className="font-medium flex gap-2 items-center text-sm">Ongoing {isSponsor && <Link to={`/programs/${program?.id}/edit`}><Settings className="w-4 h-4" /></Link>}</span> */}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <Link
                  to={`/programs/${program.id}`}
                  className="text-lg font-bold truncate max-w-[310px]"
                >
                  {program?.name}
                </Link>
              </div>
              <div className="mb-4">
                <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
                  <span className="inline-block mr-2">
                    {program?.price} {program?.currency}
                  </span>
                  <span className="h-3 border-l border-[#B331FF] inline-block" />
                  <span className="inline-block ml-2">
                    DEADLINE{' '}
                    {format(
                      new Date(program?.deadline ?? new Date()),
                      'dd . MMM . yyyy',
                    ).toUpperCase()}
                  </span>
                </p>
              </div>

              <p className="text-sm line-clamp-2 mb-6">{program?.description}</p>

              <div className="space-x-3 mb-2">
                <Link
                  to={`/programs/${program.id}#applications`}
                  className="text-xs font-semibold bg-[#F4F4F5] rounded-full px-2.5 py-0.5 leading-4"
                >
                  Submitted Application{' '}
                  <span className="text-[#B331FF]">{program.applications?.length ?? 0}</span>
                </Link>
                <Link
                  to={`/programs/${program.id}#applications`}
                  className="text-xs font-semibold bg-[#18181B] text-white rounded-full px-2.5 py-0.5"
                >
                  Approved Application{' '}
                  <span className="text-[#FDE047]">
                    {program.applications?.filter((a) => a.status === ApplicationStatus.Approved)
                      .length ?? 0}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MainPage;
