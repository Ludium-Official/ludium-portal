import { useReclaimInvestmentMutation } from '@/apollo/mutation/reclaim-investment.generated';
import { type InvestmentsQuery, useInvestmentsQuery } from '@/apollo/queries/investments.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { getInvestmentContract } from '@/lib/hooks/use-investment-contract';
import notify from '@/lib/notify';
import { getCurrencyIcon } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { http, type PublicClient, createPublicClient } from 'viem';
import { arbitrumSepolia, baseSepolia, eduChainTestnet } from 'viem/chains';
import { AgentBreadcrumbs } from './agent-breadcrumbs';

const programPageSize = 6;

export default function UserInvestmentReclaimTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;
  const { sendTransaction } = usePrivy();

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const profileId = myProfile ? (profileData?.profile?.id ?? '') : (id ?? '');

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
  const [reclaimingId, setReclaimingId] = useState<string | null>(null);

  type Investment = NonNullable<NonNullable<InvestmentsQuery['investments']>['data']>[0];

  const handleReclaimInvestment = async (investment: Investment) => {
    const investmentId = investment?.id;
    const onChainProjectId = investment?.project?.onChainProjectId;
    const network = investment?.project?.program?.network || 'educhain-testnet';

    if (!investmentId || onChainProjectId === null || onChainProjectId === undefined) {
      notify('Cannot reclaim: Missing project information', 'error');
      return;
    }

    // Create public client for the network
    const chainMap = {
      'educhain-testnet': eduChainTestnet,
      'base-sepolia': baseSepolia,
      'arbitrum-sepolia': arbitrumSepolia,
    };

    const chain = chainMap[network as keyof typeof chainMap] || eduChainTestnet;
    const client = createPublicClient({
      chain,
      transport: http(),
    }) as PublicClient;

    // Get the investment contract for the correct network
    const investmentContract = getInvestmentContract(network, sendTransaction, client);

    setReclaimingId(investmentId);
    try {
      // Step 1: Call blockchain reclaimFund function
      notify('Please approve the reclaim transaction in your wallet', 'loading');

      const result = await investmentContract.reclaimFund(Number(onChainProjectId));

      if (!result.txHash) {
        throw new Error('No transaction hash received from blockchain');
      }

      notify('Blockchain transaction confirmed! Updating database...', 'success');

      // Step 2: Update backend with the new reclaim transaction hash
      await reclaimInvestment({
        variables: {
          input: {
            investmentId,
            txHash: result.txHash,
          },
        },
        onCompleted: () => {
          notify('Investment reclaimed successfully!', 'success');
          refetch();
        },
        onError: (error) => {
          notify(`Failed to update reclaim status: ${error.message}`, 'error');
        },
      });
    } catch (error) {
      // Check if user rejected the transaction
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as { code?: number })?.code;

      if (
        errorCode === 4001 ||
        errorMessage?.includes('User rejected') ||
        errorMessage?.includes('User denied')
      ) {
        notify('Transaction cancelled by user', 'error');
      } else {
        notify(`Failed to reclaim investment: ${errorMessage || 'Unknown error'}`, 'error');
      }
    } finally {
      setReclaimingId(null);
    }
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
          {investmentData?.investments?.data
            ?.filter((investment) => investment?.canReclaim || investment?.reclaimed)
            ?.map((investment) => (
              <div className="p-5 border rounded-lg w-full" key={investment?.id}>
                <div className="bg-[#18181B0A] rounded-full px-[10px] inline-flex items-center gap-2 mb-4">
                  <span className="w-[14px] h-[14px] rounded-full bg-red-500 block" />
                  <p className="text-secondary-foreground text-sm font-semibold">Refund</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{investment?.project?.name}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-1.5 bg-[#18181B0A] rounded-lg mb-2">
                  <p className="text-sm font-medium text-neutral-400">PAYED</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground font-bold">{investment?.amount}</p>
                    {getCurrencyIcon(investment?.project?.program?.currency ?? '')}
                    <p className="text-sm text-muted-foreground font-medium">
                      {investment?.project?.program?.currency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-2.5 bg-[#18181B0A] rounded-lg mb-4">
                  <p className="text-sm font-bold text-foreground">RECLAIM</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl text-primary font-bold">{investment?.amount}</p>
                    {getCurrencyIcon(investment?.project?.program?.currency ?? '')}
                    <p className="text-sm text-muted-foreground font-medium">
                      {investment?.project?.program?.currency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {investment?.canReclaim && !investment?.reclaimed ? (
                    <Button
                      size="sm"
                      className="px-6"
                      disabled={reclaimingId === investment?.id}
                      onClick={() => handleReclaimInvestment(investment)}
                    >
                      {reclaimingId === investment?.id ? 'Processing...' : 'Reclaim now'}
                    </Button>
                  ) : investment?.reclaimed ? (
                    <span className="text-sm text-muted-foreground">Already reclaimed</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not eligible for reclaim</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      <Pagination totalCount={investmentData?.investments?.count ?? 0} pageSize={programPageSize} />
    </div>
  );
}
