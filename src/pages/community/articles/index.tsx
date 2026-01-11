import CommunityBanner from '@/assets/icons/community/articles/banners/CommunityBanner.svg';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { shuffleArray } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import ArticlesContent from './_components/articles-content';

const BANNER_DATA = [
  {
    id: 1,
    image: CommunityBanner,
    link: '/community/articles',
  },
  {
    id: 2,
    image: CommunityBanner,
    link: '/community/articles',
  },
];

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAuthed } = useAuth();
  const [shuffledBanners, setShuffledBanners] = useState(BANNER_DATA);

  useEffect(() => {
    setShuffledBanners(shuffleArray(BANNER_DATA));
  }, []);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  ]);

  return (
    <div className="bg-white min-h-screen">
      <div className="relative overflow-hidden rounded-t-lg" ref={emblaRef}>
        <div className="flex">
          {shuffledBanners.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 max-h-[380px] flex items-center justify-center"
            >
              <Link
                to={banner.link}
                className="block relative overflow-hidden cursor-pointer w-full"
              >
                <img
                  src={banner.image}
                  alt={`Banner ${banner.id}`}
                  className="w-full object-cover transition-transform duration-700 ease-in-out"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto px-25 py-11">
        <div className="flex items-center justify-between mb-15">
          <h2 className="text-3xl font-bold">Articles</h2>
          {isLoggedIn && (
            <Button
              className="gap-2 rounded-[6px] px-3"
              onClick={() => {
                if (!isAuthed) {
                  notify('Please add your email', 'success');
                  navigate('/profile');
                  return;
                }

                navigate('/community/articles/create');
              }}
              variant="outline"
            >
              <CirclePlus />
              Create Article
            </Button>
          )}
        </div>

        <ArticlesContent />
      </div>
    </div>
  );
};

export default ArticlesPage;
