import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageSize } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { type Post, SortEnum } from '@/types/types.generated';
import { CirclePlus, SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import PostCard from './_components/post-card';

const CommunityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('newest');
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const { isAuthed, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // useEffect(() => {
  //   if (searchParams.get('new-created') === 'true') {
  //     console.log("NEW CREATED")
  //     setPosts([])
  //     // Clear the 'new-created' search param from the URL when it is present
  //     const newParams = new URLSearchParams(searchParams);
  //     newParams.delete('new-created');
  //     setSearchParams(newParams, { replace: true });
  //   }
  // }, [searchParams.get('new-created')])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchParams.get('search') ?? '');
    }, 300);

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
    fetchPolicy: 'network-only',
    variables: {
      pagination: {
        limit: PageSize,
        offset: 0,
        filter: filter,
        sort: selectedTab === 'by-oldest' ? SortEnum.Asc : SortEnum.Desc,
      },
    },
  });

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const { data: moreData } = await fetchMore({
        variables: {
          pagination: {
            limit: PageSize,
            offset: posts.length,
            filter,
            sort: selectedTab === 'by-oldest' ? SortEnum.Asc : SortEnum.Desc,
          },
        },
      });

      const newPosts = moreData?.posts?.data?.filter(
        (post) => !posts.some((p) => p.id === post?.id),
      );

      if (Array.isArray(newPosts) && newPosts.length > 0) {
        setPosts((prev) => {
          // Remove duplicates by ID before setting posts
          const allPosts = [...prev, ...newPosts];
          const uniquePosts = allPosts.filter(
            (post, index, self) => index === self.findIndex((p) => p.id === post.id),
          );
          return uniquePosts;
        });
        setHasMore(newPosts.length === PageSize);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, fetchMore, posts.length, filter, selectedTab]);

  // Throttled version of loadMore to prevent race conditions
  const throttledLoadMore = useCallback(async () => {
    if (isThrottled || isLoading || !hasMore) return;

    setIsThrottled(true);
    await loadMore();

    // Throttle for 500ms
    setTimeout(() => {
      setIsThrottled(false);
    }, 500);
  }, [isThrottled, isLoading, hasMore, loadMore]);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setIsLoading(false);
  }, [debouncedSearch, selectedTab]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById('scroll-area-main-viewport');
      if (!scrollArea) return;

      const scrollTop = scrollArea.scrollTop;
      const viewportHeight = scrollArea.clientHeight;
      const fullHeight = scrollArea.scrollHeight;
      const distanceFromBottom = fullHeight - (scrollTop + viewportHeight);

      if (distanceFromBottom < 310 && hasMore && !isLoading) {
        throttledLoadMore();
      }
    };

    const scrollArea = document.getElementById('scroll-area-main-viewport');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, debouncedSearch, selectedTab, throttledLoadMore]);

  useEffect(() => {
    if (data?.posts?.data) {
      // Remove duplicates by ID before setting posts
      const uniquePosts = data.posts.data.filter(
        (post, index, self) => index === self.findIndex((p) => p.id === post.id),
      );
      setPosts(uniquePosts);
      // setHasMore(posts.length >= (data.posts.count ?? 0));
    }
  }, [data]);

  // Split posts into first 5 and remaining
  const firstFivePosts = posts.slice(0, 5);
  const remainingPosts = posts.slice(5);

  // Split first 5 posts into columns
  const numberOfColumns = 2;
  let firstColumn: Post[] = [];
  let secondColumn: Post[] = [];

  // Split the firstFivePosts so that:
  // - index 0 and index 3 go to firstColumn
  // - all other indices (1, 2, 4) go to secondColumn
  // - handle cases where firstFivePosts has less than 5 elements
  firstColumn = [];
  secondColumn = [];
  firstFivePosts.forEach((post, idx) => {
    if (idx === 0 || idx === 3) {
      firstColumn.push(post);
    } else {
      secondColumn.push(post);
    }
  });
  // firstColumn = firstFivePosts.slice(0, 2);
  // secondColumn = firstFivePosts.slice(2, 5);

  // if (firstFivePosts.length < 5) {
  //   firstColumn = firstFivePosts.filter((_, index) => index % numberOfColumns === 0);
  //   secondColumn = firstFivePosts.filter((_, index) => index % numberOfColumns === 1);
  // } else {
  //   firstColumn = firstFivePosts.filter((_, index) => index % numberOfColumns === 1);
  //   secondColumn = firstFivePosts.filter((_, index) => index % numberOfColumns === 0);
  // }

  // Split remaining posts into columns
  const remainingFirstColumn = remainingPosts.filter((_, index) => index % numberOfColumns === 0);
  const remainingSecondColumn = remainingPosts.filter((_, index) => index % numberOfColumns === 1);

  return (
    <div className="bg-white rounded-2xl pb-[60px] px-10" id="scrollableDiv">
      <div className="max-w-full md:max-w-1440 mx-auto">
        <div className="flex justify-between items-center pt-9 pb-4">
          <h1 className="text-3xl font-bold">Community</h1>
        </div>

        <div className="flex justify-between items-center py-[14px]">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="rounded-md">
              <TabsTrigger value="newest" className="rounded-xs px-4">
                Newest
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
            {/* First 5 posts */}
            {firstColumn.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                variant={index === 0 ? 'large' : 'small'}
                maxComments={index === 0 ? 3 : 1}
              />
            ))}

            {/* Remaining posts with variant='small' */}
            {remainingFirstColumn.map((post) => (
              <PostCard key={post.id} post={post} variant="small" maxComments={1} />
            ))}
          </div>

          <div className="flex flex-col gap-5">
            {/* First 5 posts */}
            {secondColumn.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Remaining posts with variant='small' */}
            {remainingSecondColumn.map((post) => (
              <PostCard key={post.id} post={post} variant="small" maxComments={1} />
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="text-gray-500">Loading more posts...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
