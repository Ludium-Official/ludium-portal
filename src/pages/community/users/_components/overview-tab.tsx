import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  hostStatuses,
  investmentStatuses,
  statusColorMap,
  statuses,
  statusHostColorMap,
  statusInvestmentColorMap,
} from '../agent-utils';

export default function UserOverviewTab() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 px-4">
        <h1 className="font-bold text-xl text-gray-dark">Overview</h1>
      </div>
      <div className="space-y-10">
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
              {statuses.map((status) => (
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

        <div>
          <div className="flex items-center h-12">
            <p className="font-bold text-xl text-gray-600">Investment Program</p>
          </div>
          <div className="space-y-6">
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
