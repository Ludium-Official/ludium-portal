import { useParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';
import { useProgramsQuery } from '@/apollo/queries/programs.generated';

import ProgramCard from './program-card';
import { Separator } from '@/components/ui/separator';
import { ArrowRightIcon } from 'lucide-react';

const filterBasedOnRole = {
  sponsor: 'sponsorId',
  validator: 'validatorId',
  builder: 'builderId',
} as const;

export default function UserRecruitmentTab() {
  const { id } = useParams();

  const { data: sponsorData } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 2,
        offset: 0,
        filter: [
          {
            value: id ?? '',
            field: filterBasedOnRole.sponsor,
          },
        ],
      },
    },
    skip: !id,
  });

  const { data: validatorData } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 2,
        offset: 0,
        filter: [
          {
            value: id ?? '',
            field: filterBasedOnRole.validator,
          },
        ],
      },
    },
    skip: !id,
  });

  const { data: builderData } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 2,
        offset: 0,
        filter: [
          {
            value: id ?? '',
            field: filterBasedOnRole.builder,
          },
        ],
      },
    },
    skip: !id,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 items-center px-4">
        <AgentBreadcrumbs />
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between h-12 px-4">
            <p className="font-bold text-lg text-gray-dark">As Sponsor</p>
            {sponsorData?.programs?.count && sponsorData?.programs?.count > 2 && (
              <div className="px-3 flex items-center gap-2">
                <p className="font-medium text-sm text-gray-dark">View more</p>
                <ArrowRightIcon width={16} height={16} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {!sponsorData?.programs?.data?.length && (
              <p className="text-sm text-muted-foreground">No programs found</p>
            )}
            {sponsorData?.programs?.data?.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
        <Separator className="mt-3" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between h-12 px-4">
            <p className="font-bold text-lg text-gray-dark">As Validator</p>
            {validatorData?.programs?.count && validatorData?.programs?.count > 2 && (
              <div className="px-3 flex items-center gap-2">
                <p className="font-medium text-sm text-gray-dark">View more</p>
                <ArrowRightIcon width={16} height={16} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {!validatorData?.programs?.data?.length && (
              <p className="text-sm text-muted-foreground">No programs found</p>
            )}
            {validatorData?.programs?.data?.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>

        <Separator className="mt-3" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between h-12 px-4">
            <p className="font-bold text-lg text-gray-dark">As Builder</p>
            {builderData?.programs?.count && builderData?.programs?.count > 2 && (
              <div className="px-3 flex items-center gap-2">
                <p className="font-medium text-sm text-gray-dark">View more</p>
                <ArrowRightIcon width={16} height={16} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {!builderData?.programs?.data?.length && (
              <p className="text-sm text-muted-foreground">No programs found</p>
            )}
            {builderData?.programs?.data?.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
