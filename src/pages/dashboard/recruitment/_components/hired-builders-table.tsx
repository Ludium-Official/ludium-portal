import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { cn, commaNumber, getCurrencyIcon, getInitials } from '@/lib/utils';
import type { HiredBuilder } from '@/types/dashboard';
import { useParams, useSearchParams } from 'react-router';

// Mock data
const mockHiredBuilders: HiredBuilder[] = [
  {
    id: '1',
    name: 'William Taylor',
    role: 'Web developer',
    status: 'in_progress',
    milestones: 5,
    paidAmount: '20,000',
    totalAmount: '40,000',
    tokenId: '12',
  },
  {
    id: '2',
    name: 'Ethan Cole',
    role: 'UX Designer',
    status: 'in_progress',
    milestones: 2,
    paidAmount: '20,000',
    totalAmount: '30,000',
    tokenId: '12',
  },
  {
    id: '3',
    name: 'Liam Parker',
    role: 'Web developer',
    status: 'completed',
    milestones: 3,
    paidAmount: '30,000',
    totalAmount: '30,000',
    tokenId: '12',
  },
  {
    id: '4',
    name: 'Noah Bennett',
    role: 'UX Designer',
    status: 'completed',
    milestones: 3,
    paidAmount: '30,000',
    totalAmount: '30,000',
    tokenId: '12',
  },
  {
    id: '5',
    name: 'Ava Mitchell',
    role: 'Web developer',
    status: 'completed',
    milestones: 3,
    paidAmount: '30,000',
    totalAmount: '30,000',
    tokenId: '12',
  },
  {
    id: '6',
    name: 'Ava Mitchell',
    role: 'Web developer',
    status: 'completed',
    milestones: 3,
    paidAmount: '30,000',
    totalAmount: '30,000',
    tokenId: '12',
  },
];

const PageSize = 5;

export const HiredBuildersTable: React.FC = () => {
  const { id } = useParams();
  const { getTokenById } = useNetworks();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  // TODO: Replace with actual API call using id
  console.log('programId:', id);
  const builders = mockHiredBuilders;
  const totalCount = builders.length;

  const paginatedBuilders = builders.slice((currentPage - 1) * PageSize, currentPage * PageSize);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-base font-semibold mb-6">Hired Builders ({totalCount})</h2>

      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-muted-foreground font-medium">Name</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium">Milestones</TableHead>
            <TableHead className="text-muted-foreground font-medium">Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBuilders.map((builder) => {
            const token = getTokenById(Number(builder.tokenId));

            return (
              <TableRow key={builder.id} className="border-b border-gray-100 last:border-b-0">
                <TableCell className="py-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={builder.profileImage} />
                      <AvatarFallback className="text-xs bg-gray-100">
                        {getInitials(builder.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{builder.name}</div>
                      <div className="text-sm text-gray-500">{builder.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-fit bg-gray-100 rounded-full px-3 py-1">
                    <span
                      className={cn(
                        'w-3 h-3 rounded-full',
                        builder.status === 'in_progress' ? 'bg-blue-500' : 'bg-purple-500',
                      )}
                    />
                    <span className="text-sm font-medium">
                      {builder.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{builder.milestones}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>
                      {commaNumber(builder.paidAmount)} / {commaNumber(builder.totalAmount)}
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

export default HiredBuildersTable;
