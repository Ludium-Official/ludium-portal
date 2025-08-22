import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';
import ProgramCard from './program-card';

const programPageSize = 6;

export default function UserRecruitmentRoleTab() {
  const { id, role } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: programData } = useProgramsQuery({
    variables: {
      pagination: {
        limit: programPageSize,
        offset: (currentPage - 1) * programPageSize,

        filter: [
          {
            value: id ?? '',
            field: role ?? '',
          },
          ...(searchQuery
            ? [
                {
                  field: 'name',
                  value: searchQuery,
                },
              ]
            : []),
        ],
      },
    },
    skip: !id,
  });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex h-12 items-center justify-between pl-4">
          <AgentBreadcrumbs />
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
          {!programData?.programs?.data?.length && (
            <p className="text-sm text-muted-foreground">No programs found</p>
          )}
          {programData?.programs?.data?.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
      <Pagination totalCount={programData?.programs?.count ?? 0} pageSize={programPageSize} />
    </div>
  );
}
