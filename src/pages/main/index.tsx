import { useArticlesQuery } from '@/apollo/queries/articles.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ArticleFilter, ArticleType } from '@/types/types.generated';
import Autoplay from 'embla-carousel-autoplay';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import recruitmentMainImage from '@/assets/icons/main/banner/recruitment-main.png';
import campaignMainImage from '@/assets/icons/main/campaign-main.png';
import rightArrowIcon from '@/assets/icons/right-arrow.svg';
import { GUIDES } from '@/constant/guides';

const BANNER = [
  {
    image: recruitmentMainImage,
    link: '/programs/recruitment',
  },
];

const CAMPAIGN_DATA = {
  title: 'Road to Seoul',
  description: "Connecting the World's Builders to Seoul",
  image: campaignMainImage,
  link: '/community/articles/5c48e4bd-c2ea-49e9-9c25-35b4a906bd1f',
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

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
      <div className="max-w-[1210px] mx-auto px-5 pt-10">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 10000,
            }),
          ]}
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent>
            {BANNER.map((banner, index) => (
              <CarouselItem key={index}>
                <Link to={banner.link} className="w-full h-[380px] rounded-lg overflow-hidden">
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

        <div className="flex justify-end mt-4 space-x-2">
          {snaps.map((_, i) => (
            <Button
              key={i}
              onClick={() => api?.scrollTo(i)}
              size="icon"
              className={`rounded-full hover:bg-primary-light ${
                current === i ? 'w-6 h-2 bg-foreground' : 'w-2 h-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-[1210px] mx-auto px-5 py-16">
        <div className="flex justify-between items-center mb-9">
          <div>
            <h2 className="text-3xl font-bold mb-2">Articles</h2>
            <p className="text-xl">Insights, stories, and deep dives into the Web3 landscape.</p>
          </div>
          <Link to="/community/articles" className="flex items-center gap-2 group">
            <img
              src={rightArrowIcon}
              alt="right-arrow"
              className="w-10 h-10 transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </div>

        <div className="flex gap-3 mb-9">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => {
                const newSP = new URLSearchParams(searchParams);
                newSP.set('category', category);
                setSearchParams(newSP);
              }}
              className="rounded-full px-4 py-2 h-fit text-sm"
            >
              {CATEGORY_DISPLAY_MAP[category]}
            </Button>
          ))}
        </div>

        <div className="min-h-[300px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesLoading ? (
            <div className="flex items-center justify-center h-full col-span-3">
              <p className="text-base">Loading...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex items-center justify-center h-full col-span-3">
              <p className="text-base">No articles found</p>
            </div>
          ) : (
            <>
              {articles.slice(0, 6).map((article) => (
                <Link key={article.id} to={`/community/articles/${article.id}`} className="group">
                  <div
                    className={`overflow-hidden rounded-lg mb-3 ${
                      article.type === ArticleType.Campaign ? 'aspect-square' : 'aspect-[5/3]'
                    }`}
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
                  <h3 className="font-semibold text-base line-clamp-2 mb-1">{article.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {article.createdAt ? format(new Date(article.createdAt), 'MMMM dd, yyyy') : ''}
                  </p>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-b from-violet-100/20 to-blue-700/20 mt-20">
        <div className="max-w-[1210px] mx-auto px-5 pt-17 pb-20 overflow-hidden">
          <div className="flex items-center justify-between mb-9">
            <div>
              <h2 className="mb-3 text-3xl font-bold">Campaign</h2>
              <p className="text-xl">
                Explore events, initiatives, and special programs from our ecosystem.
              </p>
            </div>
            <Link to={CAMPAIGN_DATA.link} className="h-fit group">
              <img
                src={rightArrowIcon}
                alt="right-arrow"
                className="w-10 h-10 transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          </div>
          <div className="flex items-end gap-9">
            <img
              src={CAMPAIGN_DATA.image}
              alt={CAMPAIGN_DATA.title}
              className="w-80 h-80 object-cover"
            />
            <div className="flex flex-col gap-4 mb-8">
              <div className="text-4xl font-bold">{CAMPAIGN_DATA.title}</div>
              <div className="text-3xl">{CAMPAIGN_DATA.description}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1210px] mx-auto px-5 pt-17 pb-20 overflow-hidden">
        <div className="flex items-center justify-between mb-9">
          <div>
            <h2 className="mb-3 text-3xl font-bold">Guides</h2>
            <p className="text-xl">Guiding you through the platform, step by step.</p>
          </div>
          <Link to="/about/guides" className="h-fit group">
            <img
              src={rightArrowIcon}
              alt="right-arrow"
              className="w-10 h-10 transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </div>
        <div className="min-h-[300px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Link
              key={guide.id}
              to={guide.link}
              className={`group flex flex-col items-end justify-between ${guide.bgColor} p-5 rounded-lg aspect-square transition-all duration-300 hover:brightness-110`}
            >
              <img
                src={guide.icon}
                alt={String(guide.title)}
                className="w-[40%] h-[40%] transition-transform duration-300 group-hover:animate-wiggle"
              />
              <div className="w-full text-white text-5xl leading-[56px]">{guide.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
