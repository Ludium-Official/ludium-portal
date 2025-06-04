import Notifications from '@/components/notifications';

import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { tokenAddresses } from '@/constant/token-address';
import ChainContract from '@/lib/contract';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { commaNumber, mainnetDefaultNetwork, reduceString } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NetworkSelector from '../network-selector';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function Header() {
  const { user, authenticated, login: privyLogin, logout: privyLogout, exportWallet } = usePrivy();
  const { login: authLogin, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'cache-first',
  });

  const [network, setNetwork] = useState(mainnetDefaultNetwork);
  const [balances, setBalances] = useState<
    { name: string; amount: bigint | null; decimal: number }[]
  >([]);

  const contract = useContract(network);

  const walletInfo = user?.wallet;
  const injectedWallet = user?.wallet?.connectorType === 'injected';

  const login = async () => {
    try {
      const googleInfo = user?.google;
      const farcasterInfo = user?.farcaster;

      const loginType = (() => {
        const types = {
          google: googleInfo,
          farcaster: farcasterInfo,
        };

        return (
          (Object.keys(types) as Array<keyof typeof types>).find((key) => types[key]) || 'wallet'
        );
      })();

      privyLogin({ disableSignup: false });

      if (user && walletInfo) {
        await authLogin({
          email: googleInfo?.email || null,
          walletAddress: walletInfo.address,
          loginType,
        });
      }
    } catch (error) {
      notify('Failed to login', 'error');
      console.error('Failed to login:', error);
    }
  };

  const logout = async () => {
    try {
      authLogout();
      privyLogout();

      notify('Successfully logged out', 'success');
      navigate('/');
    } catch (error) {
      notify('Error logging out', 'error');
      console.error('Error logging out:', error);
    }
  };

  const callTokenBalance = async (
    contract: ChainContract,
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

  useEffect(() => {
    if (authenticated && user) {
      login();
    }
  }, [user]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!authenticated || !walletInfo?.address) return;

      try {
        // @ts-ignore
        const tokens = tokenAddresses[network] || [];

        const balancesPromises = tokens.map(
          (token: { address: string; decimal: number; name: string }) =>
            callTokenBalance(contract, token.address, walletInfo.address).then((balance) => ({
              name: token.name,
              amount: balance,
              decimal: token.decimal,
            })),
        );

        const ercBalances = await Promise.all(balancesPromises);
        const nativeBalance = await contract.getBalance(walletInfo.address);

        setBalances([{ name: 'Native', amount: nativeBalance, decimal: 18 }, ...ercBalances]);
      } catch (error) {
        console.error('Error fetching token balances:', error);
      }
    };

    fetchBalances();
  }, [authenticated, walletInfo, network]);

  return (
    <header className="flex justify-between items-center px-10 py-[14px] border-b">
      <div />

      <div className="flex gap-2">
        {authenticated && <Notifications />}
        <div>
          {!authenticated && (
            <Button className="bg-[#B331FF] hover:bg-[#B331FF]/90 h-fit" onClick={login}>
              Login
            </Button>
          )}
          {authenticated && (
            <Dialog>
              <DialogTrigger>
                <Button className="bg-[#B331FF] hover:bg-[#B331FF]/90 h-fit">
                  {profileData?.profile?.firstName && profileData?.profile?.lastName
                    ? `${profileData.profile.firstName} ${profileData.profile.lastName}`
                    : reduceString(walletInfo?.address || '', 6, 6)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-[20px] font-bold">Profile</DialogTitle>
                  <DialogDescription className="flex flex-col gap-4 mt-5">
                    <div className="border border-[#E9E9E9] rounded-[10px] p-5">
                      <div className="flex items-center justify-between mb-3 text-[16px] font-bold">
                        Balance
                        <div>
                          <NetworkSelector
                            value={network}
                            onValueChange={setNetwork}
                            className="min-w-[120px] h-10"
                          />
                        </div>
                      </div>
                      <div>
                        {balances.map((balance) => {
                          return (
                            <div key={balance.name} className="mb-2">
                              {balance.name}:{' '}
                              {balance.amount !== null
                                ? commaNumber(
                                    ethers.utils.formatUnits(balance.amount, balance.decimal),
                                  )
                                : 'Fetching...'}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="border border-[#E9E9E9] rounded-[10px] p-5">
                      <div className="mb-3 text-[16px] font-bold">Account</div>
                      {injectedWallet ? (
                        <div
                          className="cursor-pointer hover:underline"
                          onClick={() => {
                            navigator.clipboard.writeText(walletInfo?.address || '');
                            notify('Copied address!', 'success');
                          }}
                        >
                          {reduceString(walletInfo?.address || '', 8, 8)}
                        </div>
                      ) : (
                        <Button className="h-10" onClick={exportWallet}>
                          See Wallet Detail
                        </Button>
                      )}
                    </div>
                    <Button onClick={logout}>Logout</Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
