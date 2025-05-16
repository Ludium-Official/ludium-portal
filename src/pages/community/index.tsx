import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import { getInitials } from '@/lib/utils';
import { type Post, SortEnum } from '@/types/types.generated';
import { ArrowRight, CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import PostCard from './_components/post-card';

const CommunityPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTabUsers, setSelectedTabUsers] = useState('all');

  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [userSearch, setUserSearch] = useState<string>('');
  const [debouncedUserSearch, setDebouncedUserSearch] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [search]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUserSearch(userSearch);
    }, 300); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [userSearch]);

  const { data: usersData } = useUsersQuery({
    variables: {
      input: {
        limit: 6,
        offset: 0,
        filter: [
          {
            field: 'search',
            value: debouncedUserSearch,
          },
          ...(selectedTabUsers === 'by-projects'
            ? [
                {
                  field: 'byNumberOfProjects',
                  value: 'asc',
                },
              ]
            : []),
        ],
      },
    },
  });

  const filter = [
    {
      field: 'title',
      value: debouncedSearch,
    },
  ];

  const { data } = usePostsQuery({
    variables: {
      pagination: {
        limit: 5,
        offset: (currentPage - 1) * 10,
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
      <div className="p-10 bg-white rounded-b-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Community</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="by-oldest">By oldest</TabsTrigger>
              {/* <TabsTrigger value="by-number-of-projects">By number of projects</TabsTrigger> */}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <Input
              className="w-[432px] rounded-md h-10"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <Button variant="outline" className="rounded-md flex items-center gap-2 h-10">
              <ListFilter className="h-4 w-4" /> Filter
            </Button> */}
            {isAuthed && (
              <Button
                className="rounded-md bg-purple-500 hover:bg-purple-600 flex items-center gap-2 h-10"
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

      <div className="rounded-t-xl bg-white p-10">
        <div className="flex justify-between items-center mb-9">
          <h3 className="text-[#18181B] font-bold text-xl">Users</h3>
          <Button className="h-9 text-sm py-2 px-3" asChild>
            <Link to="/community/users">
              View more <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Tabs value={selectedTabUsers} onValueChange={setSelectedTabUsers}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="by-projects">By number of projects</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <Input
              className="w-[432px] rounded-md h-10"
              placeholder="Search..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {usersData?.users?.data?.slice(0, 6)?.map((user) => (
            <div key={user.id} className="border rounded-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <Badge className="bg-red-500 px-2.5 py-0.5">BD</Badge>
                  <Badge className="bg-[#B331FF] px-2.5 py-0.5">Developer</Badge>
                  <Badge className="bg-pink-300 px-2.5 py-0.5">Solidity</Badge>
                </div>

                <Link
                  to={`/community/users/${user.id}`}
                  className="flex gap-2 text-sm items-center font-medium"
                >
                  See details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="gap-4 flex items-center mb-6">
                <Avatar className="w-[64px] h-[64px]">
                  <AvatarImage
                    src={user?.image || ''}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback>
                    {getInitials(`${user?.firstName || ''} ${user?.lastName || ''}`)}
                  </AvatarFallback>
                </Avatar>

                <p className="text-lg font-bold">
                  {user.firstName} {user?.lastName}
                </p>
              </div>

              <h4 className="text-sm font-bold text-foreground">Summary</h4>
              <p className="text-sm">{user.about}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
