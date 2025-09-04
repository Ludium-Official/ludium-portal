import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import { Link, useParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';

import { useApplicationsQuery } from '@/apollo/queries/applications.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRightIcon, ListFilter, Search } from 'lucide-react';
import { useState } from 'react';
import ApplicationBuilderCard from './application-builder-card';
import ProgramCard from './program-card';

const filterBasedOnRole = {
  sponsor: 'creatorId',
  validator: 'validatorId',
  builder: 'applicantId',
};

const roles = ['sponsor', 'validator', /*'builder'*/] as const;

export default function UserRecruitmentTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const profileId = myProfile ? (profileData?.profile?.id ?? '') : (id ?? '');

  const { data: applicationData } = useApplicationsQuery({
    variables: {
      pagination: {
        limit: 2,
        offset: 0,
        filter: [
          {
            value: "regular",
            field: "programType",
          },
          {
            value: profileId,
            field: "applicantId",
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
  console.log("🚀 ~ UserRecruitmentTab ~ applicationData:", applicationData)

  const queries = {
    sponsor: useProgramsQuery({
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
    }),
    validator: useProgramsQuery({
      variables: {
        pagination: {
          limit: 2,
          offset: 0,
          filter: [
            {
              value: profileId,
              field: filterBasedOnRole.validator,
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
    }),
    // builder: useProgramsQuery({
    //   variables: {
    //     pagination: {
    //       limit: 2,
    //       offset: 0,
    //       filter: [
    //         {
    //           value: profileId,
    //           field: filterBasedOnRole.builder,
    //         },
    //         ...(searchQuery
    //           ? [
    //               {
    //                 field: 'name',
    //                 value: searchQuery,
    //               },
    //             ]
    //           : []),
    //       ],
    //     },
    //   },
    //   skip: !profileId,
    // }),
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 items-center justify-between pl-4">
        <AgentBreadcrumbs />
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
        {roles.map((role, index) => {
          const { data } = queries[role];
          const programs = data?.programs?.data ?? [];
          const count = data?.programs?.count ?? 0;

          return (
            <div key={role} className="flex flex-col gap-3">
              {index > 0 && <Separator className="mt-3" />}
              <div className="flex items-center justify-between h-12 px-4">
                <p className="font-bold text-lg text-gray-dark">
                  As {role.charAt(0).toUpperCase() + role.slice(1)}
                </p>
                {count > 2 && (
                  <Link to={role} className="px-3 flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-dark">View more</p>
                    <ArrowRightIcon width={16} height={16} />
                  </Link>
                )}
              </div>
              <div className="flex flex-col gap-3 px-4">
                {programs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No programs found</p>
                ) : (
                  programs.map((program) => <ProgramCard key={program.id} program={program} />)
                )}
              </div>
            </div>
          );
        })}
        <div className="flex flex-col gap-3">
          <Separator className="mt-3" />
          <div className="flex items-center justify-between h-12 px-4">
            <p className="font-bold text-lg text-gray-dark">
              As Builder
            </p>
            {!!applicationData?.applications?.count && applicationData?.applications?.count > 2 && (
              <Link to={'builder'} className="px-3 flex items-center gap-2">
                <p className="font-medium text-sm text-gray-dark">View more</p>
                <ArrowRightIcon width={16} height={16} />
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-3 px-4">
            {applicationData?.applications?.data?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications found</p>
            ) : (
              applicationData?.applications?.data?.map((application) => <ApplicationBuilderCard key={application.id} application={application} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
