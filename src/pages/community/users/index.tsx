import { useUsersQuery } from '@/apollo/queries/users.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getInitials } from '@/lib/utils';
import { SortEnum } from '@/types/types.generated';
import { BriefcaseBusinessIcon, Building2Icon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

const userPageSize = 12;

function UsersPage() {
  const [selectedTab, setSelectedTab] = useState('all');

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [debouncedUserSearch, setDebouncedUserSearch] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUserSearch(searchParams.get('search') ?? '');
    }, 300); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchParams.get('search')]);

  const { data: usersData } = useUsersQuery({
    variables: {
      input: {
        limit: userPageSize,
        offset: (currentPage - 1) * userPageSize,
        sort: selectedTab === 'by-newest' ? SortEnum.Desc : SortEnum.Asc,
        filter: [
          {
            field: 'search',
            value: debouncedUserSearch,
          },
          ...(selectedTab === 'by-projects'
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

  return (
    <div className="bg-white rounded-[16px] pb-[60px] flex flex-col gap-10">
      <div className="px-10">
        <div className="max-w-1440 mx-auto">
          <div className="flex justify-between items-center pt-9 pb-4">
            <h3 className="text-gray-dark font-bold text-3xl">Agent</h3>
          </div>

          <div className="flex justify-between items-center py-[14px]">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-10 rounded-md">
              <TabsList className="rounded-md">
                <TabsTrigger value="all" className="rounded-xs px-4">
                  All
                </TabsTrigger>
                <TabsTrigger value="by-newest" className="rounded-xs px-4">
                  By Newest
                </TabsTrigger>
                <TabsTrigger value="by-projects" className="rounded-xs px-4">
                  By number of projects
                </TabsTrigger>
              </TabsList>
            </Tabs>

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
          </div>

          <div className="grid grid-cols-2 gap-3 py-6">
            {usersData?.users?.data?.map((user) => (
              <Link
                to={`/users/${user.id}`}
                key={user.id}
                className="flex flex-col gap-3 border rounded-lg p-5"
              >
                <div className="flex gap-4 items-center">
                  <Avatar className="w-[60px] h-[60px]">
                    <AvatarImage
                      src={user?.image || ''}
                      alt={`${user?.firstName} ${user?.lastName}`}
                    />
                    <AvatarFallback>
                      {getInitials(`${user?.firstName || ''} ${user?.lastName || ''}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    {user?.firstName && user?.lastName ? (
                      <p className="font-bold text-lg text-gray-dark">{`${user.firstName} ${user.lastName}`}</p>
                    ) : (
                      <p className="font-bold text-lg text-gray-dark">{user.email}</p>
                    )}
                    <div className="flex gap-[3.33px] items-center justify-start">
                      <Building2Icon width={16} height={16} color="#71717A" />
                      <p className="text-sm text-zinc-500">{user.organizationName}</p>
                    </div>
                    <div className="flex gap-[3.33px] items-center justify-start">
                      <BriefcaseBusinessIcon width={16} height={16} color="#71717A" />
                      <div className="flex gap-[6px]">
                        <Badge className="bg-gray-dark px-2.5 py-0.5">BD</Badge>
                        <Badge className="bg-gray-dark px-2.5 py-0.5">Developer</Badge>
                        <Badge className="bg-gray-dark px-2.5 py-0.5">Solidity</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-start justify-between">
                  <p className="line-clamp-6 text-sm text-gray-dark font-inter">{user.summary}</p>
                  <div className="flex gap-3">
                    <div className="p-3 flex flex-col gap-1 min-w-[132px]">
                      <p className="font-bold text-xs text-gray-dark">Recruitment</p>
                      <Separator />
                      <div className="flex justify-between">
                        <p className="font-bold text-xs text-zinc-500">Sponsor</p>
                        <p className="font-bold text-xs text-gray-dark">
                          {[
                            user.programStatistics?.asSponsor?.completed ?? 0,
                            user.programStatistics?.asSponsor?.confirmed ?? 0,
                            user.programStatistics?.asSponsor?.notConfirmed ?? 0,
                            user.programStatistics?.asSponsor?.paymentRequired ?? 0,
                            user.programStatistics?.asSponsor?.published ?? 0,
                            user.programStatistics?.asSponsor?.refund ?? 0,
                          ].reduce((sum, val) => sum + val, 0)}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <p className="font-bold text-xs text-zinc-500">Validator</p>
                        <p className="font-bold text-xs text-gray-dark">
                          {[
                            user.programStatistics?.asValidator?.completed ?? 0,
                            user.programStatistics?.asValidator?.confirmed ?? 0,
                            user.programStatistics?.asValidator?.notConfirmed ?? 0,
                            user.programStatistics?.asValidator?.paymentRequired ?? 0,
                            user.programStatistics?.asValidator?.published ?? 0,
                            user.programStatistics?.asValidator?.refund ?? 0,
                          ].reduce((sum, val) => sum + val, 0)}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <p className="font-bold text-xs text-zinc-500">Builder</p>
                        <p className="font-bold text-xs text-gray-dark">
                          {[
                            user.programStatistics?.asBuilder?.completed ?? 0,
                            user.programStatistics?.asBuilder?.confirmed ?? 0,
                            user.programStatistics?.asBuilder?.notConfirmed ?? 0,
                            user.programStatistics?.asBuilder?.paymentRequired ?? 0,
                            user.programStatistics?.asBuilder?.published ?? 0,
                            user.programStatistics?.asBuilder?.refund ?? 0,
                          ].reduce((sum, val) => sum + val, 0)}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 flex flex-col gap-1 min-w-[132px]">
                      <p className="font-bold text-xs text-gray-dark">Investment</p>
                      <Separator />
                      <div className="flex justify-between">
                        <p className="font-bold text-xs text-zinc-500">Host</p>
                        <p className="font-bold text-xs text-gray-dark">3</p>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <p className="font-bold text-xs text-zinc-500">Project</p>
                        <p className="font-bold text-xs text-gray-dark">4</p>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <p className="font-bold text-xs text-zinc-500">Suppoter</p>
                        <p className="font-bold text-xs text-gray-dark">2</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-[6px]">
                  <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5">Crypto</Badge>
                  <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5">BD</Badge>
                  <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5">Develope</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Pagination totalCount={usersData?.users?.count ?? 0} pageSize={userPageSize} />
    </div>
  );
}

export default UsersPage;
