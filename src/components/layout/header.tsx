import Notifications from '@/components/notifications';

import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { tokenAddresses } from '@/constant/token-address';
import type ChainContract from '@/lib/contract';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { commaNumber, mainnetDefaultNetwork, reduceString } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
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
    // skip: !isLoggedIn
  });

  const [network, setNetwork] = useState(mainnetDefaultNetwork);
  const [balances, setBalances] = useState<
    { name: string; amount: bigint | null; decimal: number }[]
  >([]);

  // Scroll state management
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  const contract = useContract(network);

  const walletInfo = user?.wallet;
  const injectedWallet = user?.wallet?.connectorType !== 'embedded';

  // Scroll handler
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as Element;
      const currentScrollY = target.scrollTop || window.scrollY;

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    // Listen to scroll on the ScrollArea viewport element
    const scrollAreaViewport = document.getElementById('scroll-area-main-viewport');

    if (scrollAreaViewport) {
      scrollAreaViewport.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollAreaViewport.removeEventListener('scroll', handleScroll);
    }

    // Fallback to window scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity and blur based on scroll position
  const getHeaderStyles = () => {
    const maxScroll = 200;
    const opacity = Math.min(scrollY / maxScroll, 1);
    const blur = Math.min(scrollY / maxScroll, 1) * 20; // max blur of 12px

    return {
      backgroundColor: `rgba(255, 255, 255, ${1 - opacity * 0.9})`, // Начинаем с белого, становимся прозрачным
      backdropFilter: `blur(${blur}px)`,
      transform: isVisible ? 'translateY(0)' : 'translateY(-120%)',
      transition:
        'transform 0.3s ease-in-out, background-color 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
    };
  };

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
    <header
      className="fixed top-0 left-0 right-0 z-[1] bg-white rounded-2xl flex justify-between items-center px-10 py-[14px] ml-[240px] mr-4 mt-3"
      style={getHeaderStyles()}
    >
      <div />

      <div className="flex gap-2">
        {authenticated && <Notifications />}
        <div>
          {!authenticated && (
            <Button className="bg-primary hover:bg-primary/90 h-fit" onClick={login}>
              Login
            </Button>
          )}
          {authenticated && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 h-fit">
                  {profileData?.profile?.firstName && profileData?.profile?.lastName
                    ? `${profileData.profile.firstName} ${profileData.profile.lastName}`
                    : reduceString(walletInfo?.address || '', 6, 6)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-[20px] font-bold">Profile</DialogTitle>
                  <DialogDescription className="flex flex-col gap-4 mt-5">
                    <div className="border border-gray-border rounded-[10px] p-5">
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
                    <div className="border border-gray-border rounded-[10px] p-5">
                      <div className="mb-3 text-[16px] font-bold">Account</div>
                      {injectedWallet ? (
                        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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
