import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import PostCard from '@/pages/community/_components/post-card';
import { SortEnum } from '@/types/types.generated';
import type { Post } from '@/types/types.generated';
import { CirclePlus, ListFilter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

// Interface for our community post data
interface CommunityPost {
  id: string;
  title?: string | null;
  content?: string | null;
  image?: string | null;
  createdAt?: string | null;
  keywords?: Array<{ id: string; name: string }> | null;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
  } | null;
}

const CommunityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
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
      const apiPosts: CommunityPost[] = data.posts.data.map(post => ({
        id: post.id || '',
        title: post.title,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        keywords: post.keywords?.map(k => ({ 
          id: k.id || '', 
          name: k.name || '' 
        })) || [],
        author: {
          id: post.author?.id || '',
          firstName: post.author?.firstName || '',
          lastName: post.author?.lastName || '',
          image: post.author?.image || ''
        }
      }));
      setPosts(apiPosts);
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
            <Button className="rounded-md bg-purple-500 hover:bg-purple-600 flex items-center gap-2" 
                   onClick={() => navigate('create')}>
              <CirclePlus className="h-4 w-4" /> Create Community
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post as Post} size="large" />
          ))}
        </div>
        
        <div className="space-y-6">
          {posts.slice(3, 5).map((post) => (
            <PostCard key={post.id} post={post as Post} size="regular" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
