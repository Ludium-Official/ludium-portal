import { useApplicationsQuery } from '@/apollo/queries/applications.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon, ListFilter, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';
import ProgramHostCard from './program-host-card';
import ProgramProjectCard from './program-project-card';

const filterBasedOnRole = {
  sponsor: 'creatorId',
  validator: 'validatorId',
  builder: 'applicantId',
};

export default function UserInvestmentTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const profileId = myProfile ? (profileData?.profile?.id ?? '') : (id ?? '');

  const { data: programData } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 2,
        offset: 0,
        filter: [
          {
            value: profileId,
            field: filterBasedOnRole.sponsor,
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
    skip: !profileId,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const { data: applicationsData } = useApplicationsQuery({
    variables: {
      pagination: {
        limit: 2,
        offset: 0,
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
  return (
    <div className="flex flex-col gap-5">
      <div className="flex h-12 items-center justify-between pl-4">
        <AgentBreadcrumbs myProfile={myProfile} />
        <div className="flex items-center gap-3 h-10">
          <div className="relative w-[258px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
            />
          </div>
          <Button variant="outline" className="h-full rounded-[6px] ">
            <ListFilter /> Filter
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-between py-2 px-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-xl text-muted-foreground">As Host</p>
              {!!programData?.programs?.count && programData.programs.count > 2 && (
                <Link to={'host'} className="px-3 flex items-center gap-2">
                  <p className="font-medium text-sm text-gray-dark">View more</p>
                  <ArrowRightIcon width={16} height={16} />
                </Link>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Please select what to show</p>
          </div>
          <div className="flex flex-col gap-3">
            {programData?.programs?.data?.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4">No programs found</p>
            ) : (
              programData?.programs?.data?.map((program) => (
                <ProgramHostCard key={program.id} program={program} />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-between py-2 px-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-xl text-muted-foreground">As Project</p>
              {!!programData?.programs?.count && programData.programs.count > 2 && (
                <Link to={'project'} className="px-3 flex items-center gap-2">
                  <p className="font-medium text-sm text-gray-dark">View more</p>
                  <ArrowRightIcon width={16} height={16} />
                </Link>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Please select what to show</p>
          </div>
          <div className="flex flex-col gap-3">
            {applicationsData?.applications?.data?.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4">No programs found</p>
            ) : (
              applicationsData?.applications?.data?.map((application) => (
                <ProgramProjectCard key={application.id} application={application} isProject />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-between py-2 px-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-xl text-muted-foreground">As Supporter</p>
              {!!programData?.programs?.count && programData.programs.count > 2 && (
                <Link to={'supporter'} className="px-3 flex items-center gap-2">
                  <p className="font-medium text-sm text-gray-dark">View more</p>
                  <ArrowRightIcon width={16} height={16} />
                </Link>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Please select what to show</p>
          </div>
          <div className="flex flex-col gap-3">
            {applicationsData?.applications?.data?.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4">No programs found</p>
            ) : (
              applicationsData?.applications?.data?.map((application) => (
                <ProgramProjectCard key={application.id} application={application} isSupporter />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
