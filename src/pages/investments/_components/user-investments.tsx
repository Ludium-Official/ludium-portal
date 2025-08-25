import { useReclaimInvestmentMutation } from '@/apollo/mutation/reclaim-investment.generated';
import { useInvestmentsQuery } from '@/apollo/queries/investments.generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/hooks/use-auth';
import { useInvestmentContract } from '@/lib/hooks/use-investment-contract';
import notify from '@/lib/notify';
import type { Investment } from '@/types/types.generated';
import { usePrivy } from '@privy-io/react-auth';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { useState } from 'react';

interface UserInvestmentsProps {
  projectId?: string;
}

export default function UserInvestments({ projectId }: UserInvestmentsProps) {
  const { userId } = useAuth();
  const { user } = usePrivy();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isReclaiming, setIsReclaiming] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState<{
    canReclaim: boolean;
    reason: string;
    amount: number;
  } | null>(null);

  const { data, loading, refetch } = useInvestmentsQuery({
    variables: {
      supporterId: userId,
      projectId,
      pagination: { limit: 20, offset: 0 },
    },
    skip: !userId,
  });

  const [reclaimInvestment] = useReclaimInvestmentMutation();

  const handleCheckEligibility = async (investment: Investment) => {
    if (!investment.project?.program) {
      setEligibilityStatus({
        canReclaim: false,
        reason: 'Program data not available',
        amount: 0,
      });
      return;
    }

    const network = investment.project.program.network || 'educhain-testnet';
    const investmentContract = useInvestmentContract(network);

    if (!investment.project?.onChainProjectId || !investment.project?.program?.educhainProgramId) {
      setEligibilityStatus({
        canReclaim: false,
        reason: 'Project not registered on blockchain',
        amount: 0,
      });
      return;
    }

    try {
      const eligibility = await investmentContract.checkReclaimEligibility(
        Number(investment.project.onChainProjectId),
        user?.wallet?.address || '',
      );

      setEligibilityStatus({
        canReclaim: eligibility.canReclaim,
        reason: eligibility.reason || 'No reason provided',
        amount: eligibility.canReclaim ? Number(investment.amount) : 0,
      });
    } catch (error) {
      console.error('Failed to check eligibility:', error);
      setEligibilityStatus({
        canReclaim: false,
        reason: 'Failed to check eligibility',
        amount: 0,
      });
    }
  };

  const handleReclaim = async () => {
    if (!selectedInvestment || !eligibilityStatus?.canReclaim) return;
    if (!selectedInvestment.project?.program) {
      notify('Program data not available', 'error');
      return;
    }
    if (!selectedInvestment.id) {
      notify('Investment ID not available', 'error');
      return;
    }

    setIsReclaiming(true);
    try {
      const network = selectedInvestment.project.program.network || 'educhain-testnet';
      const investmentContract = useInvestmentContract(network);

      // Execute blockchain reclaim
      const { txHash } = await investmentContract.reclaimFunds(
        Number(selectedInvestment.project.onChainProjectId),
      );

      // Update database
      await reclaimInvestment({
        variables: {
          input: {
            investmentId: selectedInvestment.id,
            txHash,
          },
        },
        onCompleted: () => {
          notify('Investment successfully reclaimed!', 'success');
          refetch();
          setSelectedInvestment(null);
          setEligibilityStatus(null);
        },
        onError: (error) => {
          notify(`Failed to update reclaim status: ${error.message}`, 'error');
        },
      });
    } catch (error) {
      notify(`Failed to reclaim investment: ${(error as Error).message}`, 'error');
    } finally {
      setIsReclaiming(false);
    }
  };

  const getStatusBadge = (investment: Investment) => {
    if (investment.reclaimed) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Refunded
        </Badge>
      );
    }

    switch (investment.status) {
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{investment.status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.investments?.data?.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No investments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.investments.data.map((investment) => (
              <div
                key={investment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold">{investment.project?.name}</h4>
                    {getStatusBadge(investment)}
                    {investment.tier && <Badge variant="secondary">{investment.tier}</Badge>}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>
                      Amount:{' '}
                      <span className="font-semibold text-foreground">
                        {investment.amount} {investment.project?.program?.currency || 'EDU'}
                      </span>
                    </span>
                    {investment.txHash && (
                      <span className="text-xs">Tx: {investment.txHash.substring(0, 10)}...</span>
                    )}
                  </div>
                </div>

                {investment.status === 'confirmed' && !investment.reclaimed && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInvestment(investment);
                          handleCheckEligibility(investment);
                        }}
                      >
                        Check Reclaim
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reclaim Investment</DialogTitle>
                        <DialogDescription>
                          Check if your investment is eligible for reclaim
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Investment Details</p>
                          <div className="space-y-1 text-sm">
                            <p>Project: {selectedInvestment?.project?.name}</p>
                            <p>
                              Amount: {selectedInvestment?.amount}{' '}
                              {selectedInvestment?.project?.program?.currency || 'EDU'}
                            </p>
                            {/* Date field temporarily removed until backend provides createdAt */}
                          </div>
                        </div>

                        {eligibilityStatus && (
                          <div
                            className={`p-4 rounded-lg ${
                              eligibilityStatus.canReclaim ? 'bg-green-50' : 'bg-red-50'
                            }`}
                          >
                            <p
                              className={`text-sm font-semibold mb-2 ${
                                eligibilityStatus.canReclaim ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {eligibilityStatus.canReclaim
                                ? 'Eligible for Reclaim'
                                : 'Not Eligible'}
                            </p>
                            <p className="text-sm text-gray-600">{eligibilityStatus.reason}</p>
                            {eligibilityStatus.canReclaim && (
                              <p className="text-sm font-semibold mt-2">
                                Reclaim Amount: {eligibilityStatus.amount}{' '}
                                {selectedInvestment?.project?.program?.currency || 'EDU'}
                              </p>
                            )}
                          </div>
                        )}

                        {eligibilityStatus?.canReclaim && (
                          <Button
                            onClick={handleReclaim}
                            disabled={isReclaiming}
                            className="w-full"
                          >
                            {isReclaiming ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Reclaim Funds'
                            )}
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {investment.reclaimed && investment.reclaimedAt && (
                  <div className="text-sm text-green-600">
                    Refunded on {format(new Date(investment.reclaimedAt), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
