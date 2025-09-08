import { useApplicationsQuery } from '@/apollo/queries/applications.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';
import ProgramProjectCard from './program-project-card';

const programPageSize = 6;

export default function UserInvestmentProjectTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const profileId = myProfile ? (profileData?.profile?.id ?? '') : (id ?? '');

  const { data: applicationsData } = useApplicationsQuery({
    variables: {
      pagination: {
        limit: programPageSize,
        offset: (currentPage - 1) * programPageSize,
        filter: [
          {
            value: profileId,
            field: 'applicantId',
          },
          {
            value: 'regular',
            field: 'programType',
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
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex h-12 items-center justify-between pl-4">
          <AgentBreadcrumbs myProfile={myProfile} />
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
          {!applicationsData?.applications?.data?.length && (
            <p className="text-sm text-muted-foreground">No programs found</p>
          )}
          {applicationsData?.applications?.data?.map((application) => (
            <ProgramProjectCard key={application.id} application={application} isProject />
          ))}
        </div>
      </div>
      <Pagination
        totalCount={applicationsData?.applications?.count ?? 0}
        pageSize={programPageSize}
      />
    </div>
  );
}
