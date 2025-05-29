import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageSize, Pagination } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { type Post, SortEnum } from '@/types/types.generated';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import PostCard from './_components/post-card';

PageSize;

const CommunityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthed, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const filter = [
    {
      field: 'title',
      value: debouncedSearch,
    },
  ];

  const { data } = usePostsQuery({
    variables: {
      pagination: {
        limit: PageSize,
        offset: (currentPage - 1) * PageSize,
        filter: filter,
        sort: selectedTab === 'by-oldest' ? SortEnum.Asc : SortEnum.Desc,
      },
    },
  });

  useEffect(() => {
    if (data?.posts?.data && data.posts.data.length > 0) {
      setPosts(data.posts.data);
    }
  }, [data]);

  return (
    <div className="bg-[#F7F7F7] space-y-3">
      <div className="p-10 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Community</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="by-oldest">By oldest</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <Input
              className="w-[432px] rounded-md h-10"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isLoggedIn && (
              <Button
                className="rounded-md bg-purple-500 hover:bg-purple-600 flex items-center gap-2 h-10"
                onClick={() => {
                  if (!isAuthed) {
                    notify('Please add your email', 'success');
                    navigate('/profile/edit');
                    return;
                  }
                  navigate('create');
                }}
              >
                <CirclePlus className="h-4 w-4" /> Create Community
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          {posts.length > 0 && (
            <div className="grid grid-cols-2 grid-rows-3 gap-4">
              <div className="row-span-2">
                <PostCard post={posts[0]} variant="large" maxComments={3} />
              </div>
              {posts[1] && (
                <div className="col-start-2 row-start-1">
                  <PostCard post={posts[1]} variant="small" maxComments={1} />
                </div>
              )}
              {posts[2] && (
                <div className="col-start-2 row-start-2">
                  <PostCard post={posts[2]} variant="small" maxComments={1} />
                </div>
              )}
              {posts[3] && (
                <div className="col-start-1 row-start-3">
                  <PostCard post={posts[3]} variant="small" maxComments={1} />
                </div>
              )}
              {posts[4] && (
                <div className="row-start-3">
                  <PostCard post={posts[4]} variant="small" maxComments={1} />
                </div>
              )}
            </div>
          )}
        </div>

        <Pagination totalCount={data?.posts?.count ?? 0} pageSize={PageSize} />
      </div>
    </div>
  );
};

export default CommunityPage;
