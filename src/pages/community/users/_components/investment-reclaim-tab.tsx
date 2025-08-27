import { useReclaimInvestmentMutation } from '@/apollo/mutation/reclaim-investment.generated';
import { useInvestmentsQuery } from '@/apollo/queries/investments.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import notify from '@/lib/notify';
import { getCurrencyIcon } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';

const programPageSize = 6;

export default function UserInvestmentReclaimTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const profileId = myProfile ? profileData?.profile?.id ?? '' : id ?? '';

  const { data: investmentData, refetch } = useInvestmentsQuery({
    variables: {
      supporterId: profileId,
      pagination: {
        limit: programPageSize,
        offset: (currentPage - 1) * programPageSize,
      },
    },
  });

  const [reclaimInvestment] = useReclaimInvestmentMutation();

  const handleReclaimInvestment = async (investmentId: string, txHash: string) => {

    await reclaimInvestment({
      variables: {
        input: { investmentId, txHash: txHash ?? '' },
      },
      onCompleted: () => {
        notify('Investment reclaimed successfully', 'success');
        refetch();
      },
      onError: (error) => {
        notify(`Failed to reclaim investment: ${error.message}`, 'error');
      },
    });
  };

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
          {investmentData?.investments?.data?.map((investment) => (
            <div className='p-5 border rounded-lg w-full' key={investment?.id}>
              <div className='bg-[#18181B0A] rounded-full px-[10px] inline-flex items-center gap-2 mb-4'>
                <span className='w-[14px] h-[14px] rounded-full bg-red-500 block' />
                <p className='text-secondary-foreground text-sm font-semibold'>
                  Refund
                </p>
              </div>

              <div className='flex items-center gap-2 mb-3'>
                <div className='w-8 h-8 rounded-full bg-gray-200' />
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-semibold'>
                    {investment?.project?.name}
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between px-2 py-1.5 bg-[#18181B0A] rounded-lg mb-2'>
                <p className='text-sm font-medium text-neutral-400'>PAYED</p>
                <div className='flex items-center gap-2'>
                  <p className='text-sm text-muted-foreground font-bold'>{investment?.amount}</p>
                  {getCurrencyIcon(investment?.project?.program?.currency ?? '')}
                  <p className='text-sm text-muted-foreground font-medium'>{investment?.project?.program?.currency}</p>
                </div>
              </div>

              <div className='flex items-center justify-between px-2 py-2.5 bg-[#18181B0A] rounded-lg mb-4'>
                <p className='text-sm font-bold text-foreground'>RECLAIM</p>
                <div className='flex items-center gap-2'>
                  <p className='text-xl text-primary font-bold'>{investment?.amount}</p>
                  {getCurrencyIcon(investment?.project?.program?.currency ?? '')}
                  <p className='text-sm text-muted-foreground font-medium'>{investment?.project?.program?.currency}</p>
                </div>
              </div>

              <div className='flex items-center justify-end'>
                <Button size='sm' className='px-6' onClick={() => handleReclaimInvestment(investment?.id ?? '', investment?.txHash ?? '')}>Reclaim now</Button>
              </div>
            </div>
          ))}





        </div>
      </div>
      <Pagination totalCount={investmentData?.investments?.count ?? 0} pageSize={programPageSize} />
    </div>
  );
}
