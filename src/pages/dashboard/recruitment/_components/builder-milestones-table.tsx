import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNetworks } from '@/contexts/networks-context';
import { cn, commaNumber, formatDate, getCurrencyIcon } from '@/lib/utils';
import { useParams, useSearchParams } from 'react-router';

type MilestoneStatus = 'draft' | 'under_review' | 'update' | 'completed' | 'urgent' | 'in_progress';

interface BuilderMilestone {
  id: string;
  title: string;
  dueDate: string;
  paidAmount: string;
  totalAmount: string;
  tokenId: string;
  status: MilestoneStatus;
}

const getMilestoneStyle = (status: MilestoneStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-[#F5F5F5] border-l-[#9CA3AF]';
    case 'under_review':
    case 'update':
      return 'bg-[#F0FFF5] border-l-[#4ADE80]';
    case 'completed':
      return 'bg-[#F0EDFF] border-l-[#9E71C9]';
    case 'urgent':
      return 'bg-[#FFF9FC] border-l-[#EC4899]';
    case 'in_progress':
    default:
      return 'bg-[#F5F8FF] border-l-[#60A5FA]';
  }
};

// Mock data
const mockMilestones: BuilderMilestone[] = [
  {
    id: '1',
    title:
      'TitleTitleTitleTitleTitle Title TitleTitleTitleTitleTitleTitleTitle Title Title TitleTitleTitleTitleTitle Title TitleTitleTitleTitleTitleTitleTitle Title Title TitleTitleTitleTitleTitle Title TitleTitleTitleTitleTitleTitleTitle Title Title',
    dueDate: '2025-10-23',
    paidAmount: '20000',
    totalAmount: '40000',
    tokenId: '12',
    status: 'in_progress',
  },
  {
    id: '2',
    title: 'TitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitle',
    dueDate: '2025-10-23',
    paidAmount: '20000',
    totalAmount: '30000',
    tokenId: '12',
    status: 'under_review',
  },
  {
    id: '3',
    title: 'TitleTitleTitleTitleTitleTitleTitleTitleTitle',
    dueDate: '2025-10-23',
    paidAmount: '30000',
    totalAmount: '30000',
    tokenId: '12',
    status: 'completed',
  },
  {
    id: '4',
    title: 'TitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitle',
    dueDate: '2025-10-23',
    paidAmount: '30000',
    totalAmount: '30000',
    tokenId: '12',
    status: 'urgent',
  },
  {
    id: '5',
    title: 'TitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitle',
    dueDate: '2025-10-23',
    paidAmount: '30000',
    totalAmount: '30000',
    tokenId: '12',
    status: 'draft',
  },
  {
    id: '6',
    title: 'TitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitle',
    dueDate: '2025-10-23',
    paidAmount: '30000',
    totalAmount: '30000',
    tokenId: '12',
    status: 'in_progress',
  },
];

const PageSize = 5;

export const BuilderMilestonesTable: React.FC = () => {
  const { id } = useParams();
  const { getTokenById } = useNetworks();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  // TODO: Replace with actual API call using id
  console.log('programId:', id);
  const milestones = mockMilestones;
  const totalCount = milestones.length;

  const paginatedMilestones = milestones.slice(
    (currentPage - 1) * PageSize,
    currentPage * PageSize,
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-base font-semibold mb-6">Milestones ({totalCount})</h2>

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-muted-foreground font-medium w-[50%]">Milestone</TableHead>
            <TableHead className="text-muted-foreground font-medium w-[25%]">Due Date</TableHead>
            <TableHead className="text-muted-foreground font-medium w-[25%]">Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMilestones.map((milestone) => {
            const token = getTokenById(Number(milestone.tokenId));

            return (
              <TableRow key={milestone.id} className="border-b border-gray-100 last:border-b-0">
                <TableCell className="py-3 whitespace-normal">
                  <div
                    className={cn(
                      'rounded border-l-5 p-3 min-h-[64px] flex items-center',
                      getMilestoneStyle(milestone.status),
                    )}
                  >
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 break-words">
                      {milestone.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{formatDate(milestone.dueDate)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {commaNumber(milestone.paidAmount)} / {commaNumber(milestone.totalAmount)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold [&_svg]:w-4 [&_svg]:h-4">
                      {getCurrencyIcon(token?.tokenName)}
                      {token?.tokenName}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-6">
        <Pagination totalCount={totalCount} pageSize={PageSize} />
      </div>
    </div>
  );
};

export default BuilderMilestonesTable;
