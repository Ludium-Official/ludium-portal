import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import CommunityBanner from '@/assets/icons/community/articles/banners/CommunityBanner.svg';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { shuffleArray } from '@/lib/utils';
import { CirclePlus } from 'lucide-react';
import notify from '@/lib/notify';
import { useAuth } from '@/lib/hooks/use-auth';
import { Pagination } from '@/components/ui/pagination';

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

const MOCK_PINNED_ARTICLES = [
  {
    id: 1,
    title:
      'No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    date: 'February 3, 2022',
    category: 'Trending',
  },
  {
    id: 2,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    date: 'February 3, 2022',
    category: 'Trending',
  },
  {
    id: 3,
    title:
      'No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    date: 'February 3, 2022',
    category: 'Campaign',
  },
  {
    id: 4,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    date: 'February 3, 2022',
    category: 'Campaign',
  },
];

const MOCK_ARTICLES = [
  {
    id: 1,
    title:
      'No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    date: 'February 3, 2022',
    category: 'Trending',
  },
  {
    id: 2,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    date: 'February 3, 2022',
    category: 'Newsletter',
  },
  {
    id: 3,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    date: 'February 3, 2022',
    category: 'Campaign',
  },
  {
    id: 4,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    date: 'February 3, 2022',
    category: 'Trending',
  },
  {
    id: 5,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    date: 'February 3, 2022',
    category: 'Newsletter',
  },
  {
    id: 6,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    date: 'February 3, 2022',
    category: 'Campaign',
  },
  {
    id: 7,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    date: 'February 3, 2022',
    category: 'Trending',
  },
  {
    id: 8,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    date: 'February 3, 2022',
    category: 'Discover',
  },
  {
    id: 9,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    date: 'February 3, 2022',
    category: 'Lifestyle',
  },
  {
    id: 10,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    date: 'February 3, 2022',
    category: 'Trending',
  },
  {
    id: 11,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=11',
    },
    date: 'February 3, 2022',
    category: 'Newsletter',
  },
  {
    id: 12,
    title: 'No Fixed Address designs a world-first bio...',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&h=600&fit=crop',
    author: {
      name: 'Waldorf Hegmann',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    date: 'February 3, 2022',
    category: 'Campaign',
  },
];

const CATEGORIES = ['Latest', 'Trending', 'Newsletter', 'Campaign'];

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoggedIn, isAuthed } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('Latest');
  const [shuffledBanners, setShuffledBanners] = useState(BANNER_DATA);
  const itemsPerPage = 9;

  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setShuffledBanners(shuffleArray(BANNER_DATA));
  }, []);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  ]);

  const filteredArticles =
    selectedCategory === 'Latest'
      ? MOCK_ARTICLES
      : MOCK_ARTICLES.filter((article) => article.category === selectedCategory);

  const pinnedArticles = MOCK_PINNED_ARTICLES.filter(
    (article) => article.category === selectedCategory,
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white min-h-screen">
      <div className="relative overflow-hidden rounded-t-lg" ref={emblaRef}>
        <div className="flex">
          {shuffledBanners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0">
              <Link to={banner.link} className="block relative overflow-hidden cursor-pointer">
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

        <div className="flex gap-3 mb-9">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory(category);
                const newSP = new URLSearchParams(searchParams);
                newSP.set('page', '1');
                setSearchParams(newSP);
              }}
              className="rounded-full px-4 py-2 h-fit text-base"
            >
              {category}
            </Button>
          ))}
        </div>

        {pinnedArticles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 mb-12">
            {pinnedArticles.map((article) => (
              <div key={article.id} className="overflow-hidden">
                <div className="overflow-hidden rounded-md">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={article.author.avatar} />
                      <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{article.author.name}</span>
                  </div>
                  <Link to={`/community/articles/${article.id}`} className="text-2xl font-semibold">
                    {article.title}
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground">{article.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-7 mb-12">
          {paginatedArticles.map((article) => (
            <div key={article.id} className="overflow-hidden">
              <div className="overflow-hidden rounded-md">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{article.author.name}</span>
                </div>
                <Link to={`/community/articles/${article.id}`} className="text-lg font-semibold">
                  {article.title}
                </Link>
                <p className="mt-2 text-xs text-muted-foreground">{article.date}</p>
              </div>
            </div>
          ))}
        </div>

        <Pagination totalCount={filteredArticles.length} pageSize={itemsPerPage} />
      </div>
    </div>
  );
};

export default ArticlesPage;
