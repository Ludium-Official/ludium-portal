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
import notify from '@/lib/notify';
import type { Investment } from '@/types/types.generated';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { useState } from 'react';

interface UserInvestmentsProps {
  projectId?: string;
}

export default function UserInvestments({ projectId }: UserInvestmentsProps) {
  const { userId } = useAuth();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [eligibilityStatus, setEligibilityStatus] = useState<{
    canReclaim: boolean;
    reason: string;
    amount: number;
  } | null>(null);

  const { data, loading } = useInvestmentsQuery({
    variables: {
      supporterId: userId,
      projectId,
      pagination: { limit: 20, offset: 0 },
    },
    skip: !userId,
  });

  const handleCheckEligibility = async () => {
    // For now, disable reclaim functionality until backend provides program data
    setEligibilityStatus({
      canReclaim: false,
      reason: 'Reclaim functionality is temporarily unavailable',
      amount: 0,
    });
    return;

    // TODO: Re-enable when backend includes program data in investments query
    // const network = investment.project?.program?.network || 'educhain-testnet';
    // const investmentContract = useInvestmentContract(network);
    // ...
  };

  const handleReclaim = async () => {
    if (!selectedInvestment || !eligibilityStatus?.canReclaim) return;

    // Temporarily disabled until backend provides program data
    notify('Reclaim functionality is temporarily unavailable', 'error');
    return;

    // TODO: Re-enable when backend includes program data in investments query
    // setIsReclaiming(true);
    // try { ... }
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
                      <span className="font-semibold text-foreground">{investment.amount} EDU</span>
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
                          handleCheckEligibility();
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
                            <p>Amount: {selectedInvestment?.amount} EDU</p>
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
                                Reclaim Amount: {eligibilityStatus.amount} EDU
                              </p>
                            )}
                          </div>
                        )}

                        {eligibilityStatus?.canReclaim && (
                          <Button onClick={handleReclaim} disabled={false} className="w-full">
                            Reclaim Funds
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
