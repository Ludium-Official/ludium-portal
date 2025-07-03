
import { useCarouselItemsQuery } from '@/apollo/queries/carousel-items.generated';
import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import thumbnail from '@/assets/thumbnail.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrency } from '@/lib/utils';
import { ApplicationStatus, type Post, type Program } from '@/types/types.generated';
import { format } from 'date-fns';
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';

function MainPage() {

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);


  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect) };
  }, [api, onSelect]);

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

  const { data: carouselItemsData, loading: carouselLoading } = useCarouselItemsQuery()

  return (
    <div className="mx-10 my-[60px]">
      {carouselLoading && (
        <section className="flex justify-between items-center mb-20">
          <div>
            <Skeleton className="w-[43px] h-[20px] rounded-full mb-3" />
            <Skeleton className="w-[320px] h-[48px] mb-3" />
            <Skeleton className="w-[320px] h-[20px]" />
          </div>
          <Skeleton className="w-[544px] h-[306px] rounded-lg" />
        </section>
      )}

      {!!carouselItemsData?.carouselItems?.length && <Carousel
        setApi={setApi}
        plugins={[Autoplay({
          delay: 4000,
        })]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {carouselItemsData?.carouselItems?.map(item => (
            <CarouselItem key={item.id}>
              <section className="flex justify-between items-center mb-20">
                <div className="max-w-[50%]">
                  <div className="flex gap-3">
                    {(item.data as Post)?.keywords?.slice(0, 3)?.map((k) => (
                      <Badge className="h-[20px] font-sans" key={k.id}>
                        {k.name}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-5xl font-bold font-sans mb-3">{item?.data?.__typename === 'Post' ? (item.data as Post)?.title : (item.data as Program)?.name}</h1>
                  <p className="text-lg mb-15">{item.data?.summary}</p>
                  <Button type="button" variant="purple" className="w-[152px] h-11" asChild>
                    <Link to={`${item.data?.__typename === 'Post' ? '/community/posts/' : '/programs/'}${item.itemId}`}>VIEW DETAIL</Link>
                  </Button>
                </div>
                <div className="flex w-[544px] h-[306px]">
                  {(item.data as Post)?.image ? (
                    <img
                      src={(item.data as Post)?.image ?? ''}
                      alt="main"
                      className="rounded-lg w-full h-full object-cover"
                    />
                  ) : (
                    // <div className="rounded-lg w-full h-full" />
                    <img src={thumbnail} alt="main" className="rounded-lg" />

                  )}
                </div>
              </section>
            </CarouselItem>
          ))}
          {/* <CarouselItem>...</CarouselItem>
          <CarouselItem>...</CarouselItem>
          <CarouselItem>...</CarouselItem> */}
        </CarouselContent>
      </Carousel>}

      <div className="flex justify-center mt-4 space-x-2">
        {snaps.map((_, i) => (
          <Button
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
            onClick={() => api?.scrollTo(i)}
            size="icon"
            className={`w-2 h-2 rounded-full hover:bg-primary-light ${current === i ? "bg-primary" : "bg-gray-300"
              }`}
          />
        ))}
      </div>

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
                  <p className="flex flex-col w-fit font-sans font-bold bg-primary-light text-primary leading-4 text-xs py-1 px-2 rounded-[6px]">
                    <div className="mb-1">{getCurrency(program.network)?.display}</div>
                    <div>
                      <span className="inline-block mr-2">
                        {program?.price} {program?.currency}
                      </span>
                      <span className="h-3 border-l border-primary inline-block" />
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
                  <div className="text-xs font-semibold bg-gray-light rounded-full px-2.5 py-0.5 leading-4">
                    Submitted Application{' '}
                    <span className="text-primary">{program.applications?.length ?? 0}</span>
                  </div>
                  <div className="text-xs font-semibold bg-gray-dark text-white rounded-full px-2.5 py-0.5">
                    Approved Application{' '}
                    <span className="text-yellow-warning">
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
