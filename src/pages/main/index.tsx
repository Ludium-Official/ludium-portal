import { useBannerQuery } from '@/apollo/queries/banner.generated';
import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import thumbnail from '@/assets/thumbnail.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrency } from '@/lib/utils';
import { ApplicationStatus } from '@/types/types.generated';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

function MainPage() {
  const badgeVariants = ['teal', 'orange', 'pink'];
  const { data, loading } = useProgramsQuery({
    variables: {
      pagination: {
        filter: [
          {
            field: 'status',
            value: 'published',
          },
        ],
      },
    },
  });

  const { data: bannerData, loading: bannerLoading } = useBannerQuery();

  return (
    <div className="mx-10 my-[60px]">
      {bannerLoading && (
        <section className="flex justify-between items-center mb-20">
          <div>
            <Skeleton className="w-[43px] h-[20px] rounded-full mb-3" />
            <Skeleton className="w-[320px] h-[48px] mb-3" />
            <Skeleton className="w-[320px] h-[20px]" />
          </div>
          <Skeleton className="w-[544px] h-[306px] rounded-lg" />
        </section>
      )}

      {!bannerLoading && !bannerData?.banner && (
        <section className="flex justify-between items-center mb-20">
          <div>
            <Badge className="w-[43px] h-[20px] font-sans">D-3</Badge>
            <h1 className="text-5xl font-bold font-sans mb-3">Main headline</h1>
            <p className="text-lg mb-15">additional headline or text</p>
          </div>
          <img src={thumbnail} alt="main" className="rounded-lg" />
        </section>
      )}

      {!bannerLoading && bannerData?.banner && (
        <section className="flex justify-between items-center mb-20">
          <div className="max-w-[50%]">
            <div className="flex gap-3">
              {bannerData.banner.keywords?.slice(0, 3)?.map((k) => (
                <Badge className="h-[20px] font-sans" key={k.id}>
                  {k.name}
                </Badge>
              ))}
            </div>
            <h1 className="text-5xl font-bold font-sans mb-3">{bannerData.banner.title}</h1>
            <p className="text-lg mb-15">{bannerData.banner.summary}</p>
            <Button type="button" variant="purple" className="w-[152px] h-11" asChild>
              <Link to={`/community/posts/${bannerData.banner.id}`}>VIEW DETAIL</Link>
            </Button>
          </div>
          <div className="flex w-[544px] h-[306px]">
            {bannerData.banner.image ? (
              <img
                src={bannerData.banner.image}
                alt="main"
                className="rounded-lg w-full h-full object-cover"
              />
            ) : (
              <div className="rounded-lg w-full h-full" />
            )}
          </div>
        </section>
      )}

      {loading ? (
        <section>
          <Skeleton className="w-[108px] h-[32px] mb-3" />
          <div className="flex gap-3">
            <Skeleton className="w-[425px] h-[270px] rounded-lg" />
            <Skeleton className="w-[425px] h-[270px] rounded-lg" />
            <Skeleton className="w-[425px] h-[270px] rounded-lg" />
          </div>
        </section>
      ) : (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold font-sans mb-3">Programs</h2>
            <Link to="/programs" className="flex items-center gap-2">
              View more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-4 select-none">
            {data?.programs?.data?.map((program) => (
              <Link
                to={`/programs/${program.id}`}
                key={program.id}
                className="border min-w-[425px] p-6 rounded-lg hover:border-gray-400"
              >
                <div className="flex justify-between mb-5">
                  <div className="flex gap-2 mb-1">
                    {program?.keywords?.slice(0, 3)?.map((k, i) => (
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
                    {(program?.keywords?.length ?? 0) > 3 && (
                      <Badge variant="purple">+{(program?.keywords?.length ?? 0) - 3} more</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="text-lg font-bold truncate max-w-[310px]">{program?.name}</div>
                </div>
                <div className="mb-4">
                  <p className="flex flex-col w-fit font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs py-1 px-2 rounded-[6px]">
                    <div className="mb-1">{getCurrency(program.network)?.display}</div>
                    <div>
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
                    </div>
                  </p>
                </div>

                <p className="text-sm line-clamp-2 mb-6">{program?.summary}</p>

                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-xs font-semibold bg-[#F4F4F5] rounded-full px-2.5 py-0.5 leading-4">
                    Submitted Application{' '}
                    <span className="text-[#B331FF]">{program.applications?.length ?? 0}</span>
                  </div>
                  <div className="text-xs font-semibold bg-[#18181B] text-white rounded-full px-2.5 py-0.5">
                    Approved Application{' '}
                    <span className="text-[#FDE047]">
                      {program.applications?.filter((a) => a.status === ApplicationStatus.Accepted)
                        .length ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MainPage;
