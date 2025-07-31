import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageSize } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { type Post, SortEnum } from '@/types/types.generated';
import { CirclePlus, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import PostCard from './_components/post-card';

const CommunityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthed, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchParams.get('search') ?? '');
    }, 300); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchParams.get('search')]);

  const filter = [
    {
      field: 'title',
      value: debouncedSearch,
    },
  ];

  const { data, fetchMore } = usePostsQuery({
    variables: {
      pagination: {
        limit: PageSize,
        offset: (page - 1) * PageSize,
        filter: filter,
        sort: selectedTab === 'by-oldest' ? SortEnum.Asc : SortEnum.Desc,
      },
    },
  });

  const loadMore = async () => {
    const nextPage = page + 1;

    const { data: moreData } = await fetchMore({
      variables: {
        pagination: {
          limit: PageSize,
          offset: (nextPage - 1) * PageSize,
          filter,
          sort: selectedTab === 'by-oldest' ? SortEnum.Asc : SortEnum.Desc,
        },
      },
    });

    const newPosts = moreData?.posts?.data;

    if (Array.isArray(newPosts) && newPosts.length > 0) {
      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === PageSize);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
  }, [debouncedSearch, selectedTab]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = fullHeight - (scrollTop + viewportHeight);

      if (distanceFromBottom < 310 && hasMore) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, debouncedSearch, selectedTab]);

  useEffect(() => {
    if (data?.posts?.data && page === 1) {
      setPosts(data.posts.data);
      setHasMore(data.posts.data.length === PageSize);
    }
  }, [data, page]);

  const numberOfColumns = 2;
  let firstColumn: Post[] = [];
  let secondColumn: Post[] = [];

  if (posts.length < 5) {
    firstColumn = posts.filter((_, index) => index % numberOfColumns === 0);
    secondColumn = posts.filter((_, index) => index % numberOfColumns === 1);
  } else {
    firstColumn = posts.filter((_, index) => index % numberOfColumns === 1);
    secondColumn = posts.filter((_, index) => index % numberOfColumns === 0);
  }

  return (
    <div className="bg-white rounded-2xl pb-[60px] px-10" id="scrollableDiv">
      <div className="max-w-1440 mx-auto">
        <div className="flex justify-between items-center pt-9 pb-4">
          <h1 className="text-3xl font-bold">Community</h1>
        </div>

        <div className="flex justify-between items-center py-[14px]">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="rounded-md">
              <TabsTrigger value="all" className="rounded-xs px-4">
                All
              </TabsTrigger>
              <TabsTrigger value="by-oldest" className="rounded-xs px-4">
                By oldest
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <div className="flex items-center relative px-0">
              <div className="absolute bottom-0 left-3 top-0 my-auto flex items-center justify-center">
                <SearchIcon color="#71717A" width={16} height={16} strokeWidth={2} />
              </div>
              <Input
                className="w-[360px] rounded-md h-10 bg-slate-50 pl-8"
                placeholder="Search..."
                value={searchParams.get('search') ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSP = new URLSearchParams();

                  newSP.set('search', value);
                  setSearchParams(newSP);
                }}
              />
            </div>

            {isLoggedIn && (
              <Button
                className="rounded-md bg-gray-dark hover:bg-purple-600 flex items-center gap-2 h-10"
                onClick={() => {
                  if (!isAuthed) {
                    notify('Please add your email', 'success');
                    navigate('/profile/edit');
                    return;
                  }
                  navigate('create');
                }}
              >
                <CirclePlus className="h-4 w-4" />
                <p className="text-sm">Create Content</p>
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 pt-[26px]">
          <div className="flex flex-col gap-5">
            {firstColumn.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                variant={index === 0 ? 'large' : 'small'}
                maxComments={index === 0 ? 3 : 1}
              />
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {secondColumn.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
