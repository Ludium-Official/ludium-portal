import {
  type ProfileOverviewQuery,
  type UserOverviewQuery,
  useProfileOverviewQuery,
  useUserOverviewQuery,
} from '@/apollo/queries/user-overview.generated';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusColorMap: Record<string, string> = {
  'Not confirmed': 'bg-gray-400',
  Confirmed: 'bg-green-400',
  Published: 'bg-cyan-400',
  'Payment required': 'bg-blue-400',
  Completed: 'bg-purple-500',
  Refund: 'bg-red-500',
};

const statusHostColorMap: Record<string, string> = {
  Ready: 'bg-gray-400',
  'Application ongoing': 'bg-green-400',
  'Funding ongoing': 'bg-cyan-400',
  'Project ongoing': 'bg-blue-400',
  'Program completed': 'bg-purple-500',
  Refund: 'bg-red-500',
};

const statusInvestmentColorMap: Record<string, string> = {
  Ready: 'bg-gray-400',
  'Funding ongoing': 'bg-cyan-400',
  'Project ongoing': 'bg-blue-400',
  'Project completed': 'bg-purple-500',
  'Project failed': 'bg-red-500',
};

interface OverviewTabProps {
  userId?: string; // If provided, shows other user's data. Otherwise shows current user's profile
}

export default function UserOverviewTab({ userId }: OverviewTabProps) {
  // Use different queries based on whether we're viewing another user or the current user
  const userQuery = useUserOverviewQuery({
    variables: { userId: userId || '' },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  const profileQuery = useProfileOverviewQuery({
    skip: !!userId,
    fetchPolicy: 'network-only',
  });

  const loading = userId ? userQuery.loading : profileQuery.loading;
  const data = userId ? userQuery.data : profileQuery.data;
  const userData = userId
    ? (data as UserOverviewQuery | undefined)?.user
    : (data as ProfileOverviewQuery | undefined)?.profile;
  const programStats = userData?.programStatistics;
  const investmentStats = userData?.investmentStatistics;

  // Map the data to the format expected by the UI
  const recruitmentStatuses = [
    {
      label: 'Not confirmed',
      sponsor: programStats?.asSponsor?.notConfirmed ?? 0,
      validator: programStats?.asValidator?.notConfirmed ?? 0,
      builder: programStats?.asBuilder?.notConfirmed ?? 0,
    },
    {
      label: 'Confirmed',
      sponsor: programStats?.asSponsor?.confirmed ?? 0,
      validator: programStats?.asValidator?.confirmed ?? 0,
      builder: programStats?.asBuilder?.confirmed ?? 0,
    },
    {
      label: 'Published',
      sponsor: programStats?.asSponsor?.published ?? 0,
      validator: programStats?.asValidator?.published ?? 0,
      builder: programStats?.asBuilder?.published ?? 0,
    },
    {
      label: 'Payment required',
      sponsor: programStats?.asSponsor?.paymentRequired ?? 0,
      validator: programStats?.asValidator?.paymentRequired ?? 0,
      builder: programStats?.asBuilder?.paymentRequired ?? 0,
    },
    {
      label: 'Completed',
      sponsor: programStats?.asSponsor?.completed ?? 0,
      validator: programStats?.asValidator?.completed ?? 0,
      builder: programStats?.asBuilder?.completed ?? 0,
    },
    {
      label: 'Refund',
      sponsor: programStats?.asSponsor?.refund ?? 0,
      validator: programStats?.asValidator?.refund ?? null,
      builder: programStats?.asBuilder?.refund ?? 0,
    },
  ];

  const hostStatuses = [
    { label: 'Ready', host: investmentStats?.asHost?.ready ?? 0 },
    { label: 'Application ongoing', host: investmentStats?.asHost?.applicationOngoing ?? 0 },
    { label: 'Funding ongoing', host: investmentStats?.asHost?.fundingOngoing ?? 0 },
    { label: 'Project ongoing', host: investmentStats?.asHost?.projectOngoing ?? 0 },
    { label: 'Program completed', host: investmentStats?.asHost?.programCompleted ?? 0 },
    { label: 'Refund', host: investmentStats?.asHost?.refund ?? 0 },
  ];

  const investmentStatuses = [
    {
      label: 'Ready',
      project: investmentStats?.asProject?.ready ?? 0,
      supporter: investmentStats?.asSupporter?.ready ?? 0,
    },
    {
      label: 'Funding ongoing',
      project: investmentStats?.asProject?.fundingOngoing ?? 0,
      supporter: investmentStats?.asSupporter?.fundingOngoing ?? 0,
    },
    {
      label: 'Project ongoing',
      project: investmentStats?.asProject?.projectOngoing ?? 0,
      supporter: investmentStats?.asSupporter?.projectOngoing ?? 0,
    },
    {
      label: 'Project completed',
      project: investmentStats?.asProject?.programCompleted ?? 0,
      supporter: investmentStats?.asSupporter?.programCompleted ?? 0,
    },
    {
      label: 'Project failed',
      project: investmentStats?.asProject?.refund ?? 0,
      supporter: investmentStats?.asSupporter?.refund ?? 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex h-12 px-4">
          <h1 className="font-bold text-xl text-gray-dark">Overview</h1>
        </div>
        <div className="space-y-10">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 px-4">
        <h1 className="font-bold text-xl text-gray-dark">Overview</h1>
      </div>
      <div className="space-y-10">
        {/* Recruitment Program Statistics */}
        <div>
          <Table className="border-b border-b-gray-dark">
            <TableHeader>
              <TableRow className="border-b-gray-dark h-12">
                <TableHead className="w-[200px] font-bold text-sm text-gray-600">State</TableHead>
                <TableHead className="text-right w-[200px] font-bold text-sm text-gray-600">
                  As Sponsor
                </TableHead>
                <TableHead className="text-right w-[200px] font-bold text-sm text-gray-600">
                  As Validator
                </TableHead>
                <TableHead className="text-right w-[200px] font-bold text-sm text-gray-600">
                  As Builder
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recruitmentStatuses.map((status) => (
                <TableRow key={status.label} className="h-14">
                  <TableCell className="font-medium">
                    <div className="flex items-center px-2.5 gap-2 h-6 bg-[rgba(24,24,27,0.04)] rounded-full w-fit">
                      <div
                        className={`w-[14px] h-[14px] rounded-full ${
                          statusColorMap[status.label] ?? 'bg-gray-200'
                        }`}
                      />
                      <p className="font-semibold text-sm text-gray-dark">{status.label}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-sm text-zinc-500 text-right">
                    {status.sponsor !== null ? status.sponsor : '-'}
                  </TableCell>
                  <TableCell className="font-bold text-sm text-zinc-500 text-right">
                    {status.validator !== null ? status.validator : '-'}
                  </TableCell>
                  <TableCell className="font-bold text-sm text-zinc-500 text-right">
                    {status.builder !== null ? status.builder : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Investment Program Statistics */}
        <div>
          <div className="flex items-center h-12">
            <p className="font-bold text-xl text-gray-600">Investment Program</p>
          </div>
          <div className="space-y-6">
            {/* Host Statistics */}
            <Table className="border-b border-b-gray-dark">
              <TableHeader>
                <TableRow className="border-b-gray-dark h-12">
                  <TableHead className="w-[200px] font-bold text-sm text-gray-600">State</TableHead>
                  <TableHead className="text-right w-[200px] font-bold text-sm text-gray-600">
                    As Host
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostStatuses.map((status) => (
                  <TableRow key={status.label} className="h-14">
                    <TableCell className="font-medium">
                      <div className="flex items-center px-2.5 gap-2 h-6 bg-[rgba(24,24,27,0.04)] rounded-full w-fit">
                        <div
                          className={`w-[14px] h-[14px] rounded-full ${
                            statusHostColorMap[status.label] ?? 'bg-gray-200'
                          }`}
                        />
                        <p className="font-semibold text-sm text-gray-dark">{status.label}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-sm text-zinc-500 text-right">
                      {status.host !== null ? status.host : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Project and Supporter Statistics */}
            <Table className="border-b border-b-gray-dark">
              <TableHeader>
                <TableRow className="border-b-gray-dark h-12">
                  <TableHead className="w-[200px] font-bold text-sm text-gray-600">State</TableHead>
                  <TableHead className="text-right w-[200px] font-bold text-sm text-gray-600">
                    As Project
                  </TableHead>
                  <TableHead className="text-right w-[200px] font-bold text-sm text-gray-600">
                    As Supporter
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentStatuses.map((status) => (
                  <TableRow key={status.label} className="h-14">
                    <TableCell className="font-medium">
                      <div className="flex items-center px-2.5 gap-2 h-6 bg-[rgba(24,24,27,0.04)] rounded-full w-fit">
                        <div
                          className={`w-[14px] h-[14px] rounded-full ${
                            statusInvestmentColorMap[status.label] ?? 'bg-gray-200'
                          }`}
                        />
                        <p className="font-semibold text-sm text-gray-dark">{status.label}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-sm text-zinc-500 text-right">
                      {status.project !== null ? status.project : '-'}
                    </TableCell>
                    <TableCell className="font-bold text-sm text-zinc-500 text-right">
                      {status.supporter !== null ? status.supporter : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
