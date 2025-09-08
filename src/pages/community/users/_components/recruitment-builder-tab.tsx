import { useApplicationsQuery } from '@/apollo/queries/applications.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import ApplicationBuilderCard from '@/pages/community/users/_components/application-builder-card';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';

const programPageSize = 6;

export default function UserRecruitmentBuilderTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const profileId = myProfile ? (profileData?.profile?.id ?? '') : (id ?? '');

  const { data: applicationData } = useApplicationsQuery({
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
          {!applicationData?.applications?.data?.length && (
            <p className="text-sm text-muted-foreground">No programs found</p>
          )}
          {applicationData?.applications?.data?.map((application) => (
            <ApplicationBuilderCard key={application.id} application={application} />
          ))}
        </div>
      </div>
      <Pagination
        totalCount={applicationData?.applications?.count ?? 0}
        pageSize={programPageSize}
      />
    </div>
  );
}
