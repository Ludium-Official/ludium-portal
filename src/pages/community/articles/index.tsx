import CommunityBannerMobile from '@/assets/icons/community/articles/banners/community-banner-mobile.svg';
import CommunityBanner from '@/assets/icons/community/articles/banners/community-banner.svg';
import Container from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, shuffleArray } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import ArticlesContent from './_components/articles-content';

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isLoggedIn, isAuthed } = useAuth();

  const BANNER_DATA = [
    {
      id: 1,
      image: isMobile ? CommunityBannerMobile : CommunityBanner,
      link: '/community/articles',
    },
  ];

  const [shuffledBanners, setShuffledBanners] = useState(BANNER_DATA);

  useEffect(() => {
    setShuffledBanners(shuffleArray(BANNER_DATA));
  }, [isMobile]);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  ]);

  return (
    <div className="bg-white min-h-screen">
      <div
        className={cn('relative overflow-hidden rounded-t-lg', isMobile && 'rounded-none mt-4')}
        ref={emblaRef}
      >
        <div className="flex">
          {shuffledBanners.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 flex items-center justify-center"
            >
              <Link
                to={banner.link}
                className="block relative overflow-hidden cursor-pointer w-full h-[clamp(200px,26.4vw,380px)]"
              >
                <img
                  src={banner.image}
                  alt={`Banner ${banner.id}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Container className={cn('sm:max-w-[1250px] px-5 py-11', isMobile && 'py-7')}>
        <div className={cn('flex items-center justify-between mb-15', isMobile && 'mb-5')}>
          <h2 className={cn('text-3xl font-bold', isMobile && 'text-base')}>Articles</h2>
          {isLoggedIn && (
            <Button
              className={cn('gap-2 rounded-[6px] px-3', isMobile && 'p-2! h-fit')}
              onClick={() => {
                if (!isAuthed) {
                  notify('Please check your email and nickname', 'success');
                  navigate('/profile');
                  return;
                }

                navigate('/community/articles/create');
              }}
              variant="outline"
            >
              <CirclePlus />
              {`Create${!isMobile ? ' Article' : ''}`}
            </Button>
          )}
        </div>

        <ArticlesContent />
      </Container>
    </div>
  );
};

export default ArticlesPage;
