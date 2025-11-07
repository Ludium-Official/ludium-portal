import { useCarouselItemsQuery } from '@/apollo/queries/carousel-items.generated';
import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { useGetProgramsV2Query } from '@/apollo/queries/programs-v2.generated';
import thumbnail from '@/assets/thumbnail.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import MainCommunityCard from '@/pages/main/_components/main-community-card';
import ProgramCard from '@/pages/programs/_components/program-card';
import { type Post, type Program } from '@/types/types.generated';
import Autoplay from 'embla-carousel-autoplay';
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
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  const { data: programsData, loading: programsLoading } = useGetProgramsV2Query({
    variables: {
      pagination: {
        limit: 5,
      },
    },
  });
  // const { data: programsData, loading: programsLoading } = useProgramsQuery({
  //   variables: {
  //     pagination: {
  //       filter: [
  //         {
  //           field: 'status',
  //           value: 'published',
  //         },
  //         {
  //           field: 'visibility',
  //           value: 'public',
  //         },
  //       ],
  //     },
  //   },
  // });

  const { data: postsData, loading: postsLoading } = usePostsQuery({
    variables: {
      pagination: {
        limit: 3,
        offset: 0,
      },
    },
  });

  const { data: carouselItemsData, loading: carouselLoading } = useCarouselItemsQuery();

  return (
    <div className="bg-white rounded-2xl p-4 md:px-10 md:py-[60px]">
      <div className="max-w-1440 mx-auto">
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

        {!!carouselItemsData?.carouselItems?.length && (
          <Carousel
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent>
              {carouselItemsData?.carouselItems?.map((item) => (
                <CarouselItem key={item.id}>
                  <section className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-20 gap-8">
                    <div className="max-w-full md:max-w-[50%] text-center md:text-left">
                      <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                        {(item.data as Post)?.keywords?.slice(0, 3)?.map((k) => (
                          <Badge className="h-[20px] font-sans" key={k.id}>
                            {k.name}
                          </Badge>
                        ))}
                      </div>
                      <h1 className="text-3xl md:text-5xl font-bold font-sans mb-3">
                        {item?.data?.__typename === 'Post'
                          ? (item.data as Post)?.title
                          : (item.data as Program)?.name}
                      </h1>
                      <p className="text-base md:text-lg mb-6 md:mb-15">{item.data?.summary}</p>
                      <Button type="button" variant="purple" className="w-[152px] h-11" asChild>
                        <Link
                          to={`${
                            item.data?.__typename === 'Post' ? '/community/posts/' : '/programs/'
                          }${item.itemId}`}
                        >
                          VIEW DETAIL
                        </Link>
                      </Button>
                    </div>
                    <div className="flex w-full md:w-[544px] h-[200px] md:h-[306px]">
                      {(item.data as Post)?.image ? (
                        <img
                          src={(item.data as Post)?.image ?? ''}
                          alt="main"
                          className="rounded-lg w-full h-full object-cover"
                        />
                      ) : (
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
          </Carousel>
        )}

        <div className="flex justify-center mt-4 space-x-2">
          {snaps.map((_, i) => (
            <Button
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              onClick={() => api?.scrollTo(i)}
              size="icon"
              className={`w-2 h-2 rounded-full hover:bg-primary-light ${
                current === i ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Programs Section */}
        {programsLoading ? (
          <section className="mb-12">
            <Skeleton className="w-[108px] h-[32px] mb-3" />
            <div className="flex gap-3">
              <Skeleton className="w-[624px] h-[272px] rounded-lg" />
              <Skeleton className="w-[624px] h-[272px] rounded-lg" />
              <Skeleton className="w-[624px] h-[272px] rounded-lg" />
            </div>
          </section>
        ) : (
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-sans mb-0">Programs</h2>
              <Link to="/programs" className="flex items-center gap-2">
                View more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-4 select-none -mx-4 md:mx-0 px-4 md:px-0">
              {programsData?.programsV2?.data?.map((program) => {
                return (
                  <Link
                    to={`/programs/${program.id}`}
                    className="min-w-[280px] md:min-w-[624px] hover:shadow-md transition-shadow"
                    key={program.id}
                  >
                    <ProgramCard key={program.id} program={program} />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Community Section */}
        {postsLoading ? (
          <section className="mb-12">
            <Skeleton className="w-[108px] h-[32px] mb-3" />
            <div className="flex gap-3">
              <Skeleton className="w-[320px] h-[400px] rounded-lg" />
              <Skeleton className="w-[320px] h-[400px] rounded-lg" />
              <Skeleton className="w-[320px] h-[400px] rounded-lg" />
            </div>
          </section>
        ) : (
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-sans mb-0">Community</h2>
              <Link to="/community" className="flex items-center gap-2">
                View more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-4 select-none -mx-4 md:mx-0 px-4 md:px-0">
              {postsData?.posts?.data?.map((post) => (
                <MainCommunityCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Users Section */}
        {/* {usersLoading ? (
          <section className="mb-12">
            <Skeleton className="w-[108px] h-[32px] mb-3" />
            <div className="flex gap-3">
              <Skeleton className="w-[320px] h-[400px] rounded-lg" />
              <Skeleton className="w-[320px] h-[400px] rounded-lg" />
              <Skeleton className="w-[320px] h-[400px] rounded-lg" />
            </div>
          </section>
        ) : (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-bold font-sans mb-3">User</h2>
              <Link to="/community/users" className="flex items-center gap-2">
                View more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-4 select-none">
              {usersData?.users?.data?.map((user) => (
                <MainUserCard key={user.id} user={user} />
              ))}
            </div>
          </section>
        )} */}
      </div>
    </div>
  );
}

export default MainPage;
