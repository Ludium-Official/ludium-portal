import { useArticlesQuery } from '@/apollo/queries/articles.generated';
import recruitmentMainMobileImage from '@/assets/icons/main/banner/recruitment-main-mobile.png';
import recruitmentMainImage from '@/assets/icons/main/banner/recruitment-main.png';
import campaignMainImage from '@/assets/icons/main/campaign-main.png';
import rightArrowIcon from '@/assets/icons/right-arrow.svg';
import Container from '@/components/layout/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { GUIDES } from '@/constant/guides';
import { useBreakpoint } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ArticleFilter, ArticleType } from '@/types/types.generated';
import { format } from 'date-fns';
import Autoplay from 'embla-carousel-autoplay';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

const CAMPAIGN_DATA = {
  title: 'Road to Seoul',
  description: "Connecting the World's Builders to Seoul",
  image: campaignMainImage,
  link: '/community/articles/15076d0c-e7cd-42a7-81fa-1efa4380ef50',
};

const CATEGORIES = ['latest', 'trending', 'newsletter', 'campaign'] as const;
type CategoryType = (typeof CATEGORIES)[number];

const CATEGORY_FILTER_MAP: Record<CategoryType, ArticleFilter> = {
  latest: ArticleFilter.Latest,
  trending: ArticleFilter.Trending,
  newsletter: ArticleFilter.Newsletter,
  campaign: ArticleFilter.Campaign,
};

const CATEGORY_DISPLAY_MAP: Record<CategoryType, string> = {
  latest: 'Latest',
  trending: 'Trending',
  newsletter: 'Newsletter',
  campaign: 'Campaign',
};

function MainPage() {
  const { isMobile, isBelowLg } = useBreakpoint();

  const [searchParams, setSearchParams] = useSearchParams();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const BANNER = [
    {
      image: isBelowLg ? recruitmentMainMobileImage : recruitmentMainImage,
      link: '/programs/recruitment',
    },
  ];

  const categoryParam = searchParams.get('category') as CategoryType | null;
  const selectedCategory: CategoryType = CATEGORIES.includes(categoryParam as CategoryType)
    ? (categoryParam as CategoryType)
    : 'latest';

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

  const { data: articlesData, loading: articlesLoading } = useArticlesQuery({
    variables: {
      input: {
        filter: CATEGORY_FILTER_MAP[selectedCategory],
        pagination: {
          offset: 0,
          limit: 3,
        },
      },
    },
  });

  const articles = articlesData?.articles?.data || [];

  return (
    <div className="bg-white w-full rounded-2xl">
      <Container className={cn('px-5 pt-10', isBelowLg && 'pt-4')}>
        <Carousel
          setApi={setApi}
          plugins={[Autoplay({ delay: 10000 })]}
          opts={{ align: 'start', loop: true }}
          className="overflow-hidden"
        >
          <CarouselContent>
            {BANNER.map((banner, index) => (
              <CarouselItem key={index} className="basis-full">
                <Link
                  to={banner.link}
                  className={cn(
                    'w-full rounded-lg overflow-hidden block',
                    isBelowLg ? 'aspect-[16/9] min-h-[240px]' : 'h-[380px]',
                  )}
                >
                  <img
                    src={banner.image}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div
          className={cn(
            'flex items-center justify-end mt-4 space-x-2',
            isMobile && 'justify-center mt-2',
          )}
        >
          {snaps.map((_, i) => (
            <Button
              key={i}
              onClick={() => api?.scrollTo(i)}
              size="icon"
              className={`rounded-full hover:bg-primary-light ${
                current === i ? 'w-6 h-[5px] bg-foreground' : 'w-2 h-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </Container>

      <Container className={cn('px-5 py-16', isMobile && 'py-12')}>
        <div
          className={cn(
            'flex justify-between items-center mb-9',
            isMobile && 'flex-col items-start mb-4',
          )}
        >
          <div className="w-full">
            <h2
              className={cn(
                'text-3xl font-bold mb-2',
                isMobile && 'flex items-center justify-between mb-[6.85px] text-base',
              )}
            >
              Articles
              {isMobile && (
                <Link to="/community/articles" className="flex items-center gap-2 group">
                  <img
                    src={rightArrowIcon}
                    alt="right-arrow"
                    className="w-5 h-4 transition-transform duration-300 group-hover:translate-x-2"
                  />
                </Link>
              )}
            </h2>
            <p className={cn('text-xl', isMobile && 'text-xs')}>
              Insights, stories, and deep dives into the Web3 landscape.
            </p>
          </div>
          {!isMobile && (
            <Link to="/community/articles" className="flex items-center gap-2 group">
              <img
                src={rightArrowIcon}
                alt="right-arrow"
                className="w-10 h-10 transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          )}
        </div>

        <div className={cn('flex gap-3 mb-9', isMobile && 'gap-2 mb-4')}>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => {
                const newSP = new URLSearchParams(searchParams);
                newSP.set('category', category);
                setSearchParams(newSP);
              }}
              className={cn('rounded-full px-4 py-2 h-fit text-sm', isMobile && 'px-3 text-xs')}
            >
              {CATEGORY_DISPLAY_MAP[category]}
            </Button>
          ))}
        </div>

        <div
          className={cn(
            'min-h-[300px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
            isMobile &&
              'flex overflow-x-auto gap-4 pb-4 -mr-4 px-4 min-h-0 snap-x hidden-scrollbar',
            articles.length === 0 && 'justify-center h-[200px] mr-0',
          )}
        >
          {articlesLoading ? (
            <div className="flex items-center justify-center h-full col-span-3">
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            </div>
          ) : articles.length === 0 ? (
            <div className="flex items-center justify-center h-full col-span-3">
              <p className={cn('text-base', isMobile && 'text-sm')}>No articles found</p>
            </div>
          ) : (
            <>
              {articles.slice(0, 6).map((article) => (
                <Link
                  key={article.id}
                  to={`/community/articles/${article.id}`}
                  className={cn('group', isMobile && 'flex-shrink-0 w-[333px] snap-start')}
                >
                  <div
                    className={cn(
                      'overflow-hidden rounded-lg mb-3',
                      article.type === ArticleType.Campaign ? 'aspect-square' : 'aspect-[5/3]',
                    )}
                  >
                    <img
                      src={article.coverImage || ''}
                      alt={article.title || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={article.author?.profileImage || ''} />
                      <AvatarFallback className="text-xs">
                        {article.author?.nickname?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {article.author?.nickname || 'Anonymous'}
                    </span>
                  </div>
                  <h3
                    className={cn(
                      'font-semibold text-base line-clamp-2 mb-1',
                      isMobile && 'text-sm',
                    )}
                  >
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {article.createdAt ? format(new Date(article.createdAt), 'MMMM dd, yyyy') : ''}
                  </p>
                </Link>
              ))}
            </>
          )}
        </div>
      </Container>

      <div
        className={cn(
          'bg-gradient-to-b from-violet-100/20 to-blue-700/20 mt-20',
          isMobile && 'mt-0',
        )}
      >
        <Container className={cn('px-5 pt-17 pb-20 overflow-hidden', isMobile && 'py-5')}>
          <div className={cn('flex items-center justify-between mb-9', isMobile && 'mb-5')}>
            <div>
              <h2
                className={cn(
                  'mb-3 text-3xl font-bold',
                  isMobile && 'flex items-center justify-between mb-[6.85px] text-base',
                )}
              >
                Campaign
                {isMobile && (
                  <Link to={CAMPAIGN_DATA.link} className="h-fit group">
                    <img
                      src={rightArrowIcon}
                      alt="right-arrow"
                      className="w-5 h-4 transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </Link>
                )}
              </h2>
              <p className={cn('text-xl', isMobile && 'text-xs')}>
                Explore events, initiatives, and special programs from our ecosystem.
              </p>
            </div>
            {!isMobile && (
              <Link to={CAMPAIGN_DATA.link} className="h-fit group">
                <img
                  src={rightArrowIcon}
                  alt="right-arrow"
                  className="w-10 h-10 transition-transform duration-300 group-hover:translate-x-2"
                />
              </Link>
            )}
          </div>
          <div className={cn('flex items-end gap-9', isMobile && 'flex-col items-start gap-5')}>
            <img
              src={CAMPAIGN_DATA.image}
              alt={CAMPAIGN_DATA.title}
              className={cn('w-80 h-80 object-cover rounded-lg', isMobile && 'w-full h-full')}
            />
            <div className={cn('flex flex-col gap-4 mb-8', isMobile && 'gap-1 mb-0')}>
              <div className={cn('text-4xl font-bold', isMobile && 'text-base')}>
                {CAMPAIGN_DATA.title}
              </div>
              <div className={cn('text-3xl', isMobile && 'text-sm')}>
                {CAMPAIGN_DATA.description}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className={cn('px-5 pt-17 pb-20 overflow-hidden', isMobile && 'pb-15')}>
        <div className={cn('flex items-center justify-between mb-9', isMobile && 'mb-5')}>
          <div className="w-full">
            <h2
              className={cn(
                'mb-3 text-3xl font-bold',
                isMobile && 'flex items-center justify-between mb-[6.85px] text-base',
              )}
            >
              Guides
              {isMobile && (
                <Link to="/about/guides" className="h-fit group">
                  <img
                    src={rightArrowIcon}
                    alt="right-arrow"
                    className="w-5 h-4 transition-transform duration-300 group-hover:translate-x-2"
                  />
                </Link>
              )}
            </h2>
            <p className={cn('text-xl', isMobile && 'text-xs')}>
              Guiding you through the platform, step by step.
            </p>
          </div>
          {!isMobile && (
            <Link to="/about/guides" className="h-fit group">
              <img
                src={rightArrowIcon}
                alt="right-arrow"
                className="w-10 h-10 transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          )}
        </div>
        <div
          className={cn(
            'min-h-[300px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
            isMobile && 'gap-5 min-h-[237px]',
          )}
        >
          {GUIDES.map((guide) => (
            <Link
              key={guide.id}
              to={guide.link}
              className={cn(
                'group flex flex-col items-end justify-between p-5 rounded-lg aspect-square transition-all duration-300 hover:brightness-110',
                guide.bgColor,
                isMobile && 'aspect-auto px-6 py-9',
              )}
            >
              <img
                src={guide.icon}
                alt={String(guide.title)}
                className={cn(
                  'w-[40%] h-[40%] transition-transform duration-300 group-hover:animate-wiggle',
                  isMobile && 'w-auto h-auto',
                )}
              />
              <div
                className={cn(
                  'w-full text-white text-5xl leading-[56px]',
                  isMobile && 'text-3xl leading-9',
                )}
              >
                {guide.title}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default MainPage;
