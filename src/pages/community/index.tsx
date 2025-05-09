import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import { type Post, SortEnum } from '@/types/types.generated';
import { CirclePlus, ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import PostCard from './_components/post-card';

const CommunityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthed, userId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data } = usePostsQuery({
    variables: {
      pagination: {
        limit: 10,
        offset: (currentPage - 1) * 10,
        filter:
          selectedTab === 'my-posts'
            ? [
                {
                  field: 'userId',
                  value: userId,
                },
              ]
            : undefined,
        sort: selectedTab === 'by-newest' ? SortEnum.Desc : SortEnum.Asc,
      },
    },
  });

  useEffect(() => {
    if (data?.posts?.data && data.posts.data.length > 0) {
      setPosts(data.posts.data);
    }
  }, [data]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Community</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="by-newest">By newest</TabsTrigger>
            <TabsTrigger value="by-number-of-projects">By number of projects</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input className="w-[432px] rounded-md" placeholder="Search..." />
          </div>
          <Button variant="outline" className="rounded-md flex items-center gap-2">
            <ListFilter className="h-4 w-4" /> Filter
          </Button>
          {isAuthed && (
            <Button
              className="rounded-md bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
              onClick={() => navigate('create')}
            >
              <CirclePlus className="h-4 w-4" /> Create Community
            </Button>
          )}
        </div>
      </div>

      {posts.length > 0 && (
        <div className="grid grid-cols-2 grid-rows-3 gap-4">
          <div className="row-span-2">
            <PostCard post={posts[0]} variant="large" maxComments={3} />
          </div>
          <div className="col-start-1 row-start-3">
            <PostCard post={posts[1]} variant="small" maxComments={1} />
          </div>
          <div className="col-start-2 row-start-1">
            <PostCard post={posts[2]} variant="small" maxComments={1} />
          </div>
          <div className="col-start-2 row-start-2">
            <PostCard post={posts[3]} variant="small" maxComments={1} />
          </div>
          <div className="row-start-3">
            <PostCard post={posts[4]} variant="small" maxComments={1} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
