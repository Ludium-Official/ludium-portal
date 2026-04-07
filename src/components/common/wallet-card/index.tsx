import NetworkSelector from '@/components/network-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tokenAddresses } from '@/constant/token-address';
import { useNetworks } from '@/contexts/networks-context';
import type RecruitmentContract from '@/lib/contract/recruitment-contract';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { commaNumber, mainnetDefaultNetwork, reduceString } from '@/lib/utils';
import type { WalletBalance, WalletCardProps } from '@/types/wallet';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export const WalletCard: React.FC<WalletCardProps> = ({ className }) => {
  const { address, isConnected } = useAccount();
  const { networks: networksWithTokens } = useNetworks();

  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [networkId, setNetworkId] = useState<string | null>(null);

  const currentNetwork = networksWithTokens.find(
    (n) => n.id === networkId || (!networkId && n.chainName === mainnetDefaultNetwork),
  );
  const network = currentNetwork?.chainName || mainnetDefaultNetwork;
  const contract = useContract(network);

  const callTokenBalance = async (
    contract: RecruitmentContract,
    tokenAddress: string,
    walletAddress: string,
  ): Promise<bigint | null> => {
    try {
      const balance = await contract.getAmount(tokenAddress, walletAddress);
      return balance as bigint;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return null;
    }
  };

  // Initialize default network
  useEffect(() => {
    if (networksWithTokens.length > 0 && !networkId) {
      const isMainnet = import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet';
      const defaultNetwork = networksWithTokens.find((n) =>
        isMainnet
          ? n.chainName.toLowerCase().includes('educhain') && n.mainnet
          : n.chainName.toLowerCase().includes('educhain') && !n.mainnet,
      );
      if (defaultNetwork) {
        setNetworkId(defaultNetwork.id);
      }
    }
  }, [networksWithTokens, networkId]);

  // Fetch token balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!isConnected || !address) return;

      try {
        const tokens = tokenAddresses[network as keyof typeof tokenAddresses] || [];

        const erc20Tokens = tokens.filter(
          (token: { address: string }) => token.address !== ethers.constants.AddressZero,
        );

        const balancesPromises = erc20Tokens.map(
          (token: { address: string; decimal: number; name: string }) =>
            callTokenBalance(contract, token.address, address).then((balance) => ({
              name: token.name,
              amount: balance,
              decimal: token.decimal,
            })),
        );

        const ercBalances = await Promise.all(balancesPromises);
        const nativeBalance = await contract.getBalance(address);

        setBalances([{ name: 'Native', amount: nativeBalance, decimal: 18 }, ...ercBalances]);
      } catch (error) {
        console.error('Error fetching token balances:', error);
      }
    };

    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, network]);

  return (
    <Card className={`gap-3 border-2 border-purple-200 shadow-none ${className || ''}`}>
      <CardHeader className="gap-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold">My Wallet</CardTitle>
            <p className="flex gap-1 items-center text-xs text-muted-foreground mt-1">
              <CircleCheck className="text-green-500 w-4 h-4" />
              Successfully connected
            </p>
          </div>
          <NetworkSelector
            value={networkId || undefined}
            onValueChange={(value: string) => setNetworkId(value)}
            networks={networksWithTokens}
            className="h-8"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="bg-accent p-2 rounded-md mb-4">
          {balances.length === 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Native</span>
                <span className="text-sm font-bold">0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">USDT</span>
                <span className="text-sm font-bold">0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">USDC</span>
                <span className="text-sm font-bold">0.0</span>
              </div>
            </div>
          ) : (
            balances.map((balance) => (
              <div key={balance.name} className="flex items-center justify-between mb-2 last:mb-0">
                <span className="text-xs font-bold text-muted-foreground">{balance.name}</span>
                <span className="text-sm font-bold">
                  {balance.amount !== null
                    ? commaNumber(ethers.utils.formatUnits(balance.amount, balance.decimal))
                    : 'Fetching...'}
                </span>
              </div>
            ))
          )}
        </div>
        <Button
          variant="outline"
          className="w-full h-10"
          onClick={() => {
            navigator.clipboard.writeText(address || '');
            notify('Copied address!', 'success');
          }}
        >
          {reduceString(address || '', 8, 8)}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
