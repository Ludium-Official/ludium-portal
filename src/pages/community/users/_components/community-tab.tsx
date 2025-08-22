import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { SortEnum } from '@/types/types.generated';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import CommunityCard from './community-card';

const programPageSize = 6;

export default function UserCommunityTab() {
  const { id } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;

  const filter = [
    ...(id
      ? [
          { field: 'authorId', value: id },
          ...(searchQuery ? [{ field: 'name', value: searchQuery }] : []),
        ]
      : []),
  ];

  const { data: postsData } = usePostsQuery({
    variables: {
      pagination: {
        limit: programPageSize,
        offset: (currentPage - 1) * programPageSize,
        sort: SortEnum.Desc,
        filter,
      },
    },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex h-12 items-center justify-between pl-4">
          <h1 className="font-bold text-xl text-gray-dark">Community</h1>
          <div className="relative w-[360px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {!postsData?.posts?.data?.length && (
            <p className="text-sm text-muted-foreground">No programs found</p>
          )}
          {postsData?.posts?.data?.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      <Pagination totalCount={postsData?.posts?.count ?? 0} pageSize={programPageSize} />
    </div>
  );
}
