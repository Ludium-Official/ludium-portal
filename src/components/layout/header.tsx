import logo from '@/assets/logo.svg';
import Notifications from '@/components/notifications';

import { useProfileV2Query } from '@/apollo/queries/profile-v2.generated';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { tokenAddresses } from '@/constant/token-address';
import { useNetworks } from '@/contexts/networks-context';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { commaNumber, isMobileDevice, mainnetDefaultNetwork, reduceString } from '@/lib/utils';
import type { BalanceProps } from '@/types/asset';
import { LoginTypeEnum } from '@/types/types.generated';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import NetworkSelector from '../network-selector';

function Header() {
  const navigate = useNavigate();

  const { user, authenticated, login: privyLogin, logout: privyLogout, exportWallet } = usePrivy();
  const { login: authLogin, logout: authLogout } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [balances, setBalances] = useState<BalanceProps[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  const { networks: networksWithTokens } = useNetworks();

  useEffect(() => {
    if (networksWithTokens.length > 0 && !networkId) {
      const isMainnet = import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet';
      const defaultNetwork = networksWithTokens.find((network) =>
        isMainnet
          ? network.chainName.toLowerCase().includes('educhain') && network.mainnet
          : network.chainName.toLowerCase().includes('educhain') && !network.mainnet,
      );
      if (defaultNetwork) {
        setNetworkId(defaultNetwork.id);
      }
    }
  }, [networksWithTokens, networkId]);

  const currentNetwork = networksWithTokens.find(
    (n) => n.id === networkId || (!networkId && n.chainName === mainnetDefaultNetwork),
  );
  const network = currentNetwork?.chainName || mainnetDefaultNetwork;
  const contract = useContract(network);
  const walletInfo = user?.wallet;

  const prevNetworkRef = useRef<string>(network);
  const prevWalletRef = useRef<string | undefined>(walletInfo?.address);
  const injectedWallet = user?.wallet?.connectorType !== 'embedded';

  const { data: profileData } = useProfileV2Query({
    fetchPolicy: 'cache-first',
    skip: !authenticated,
  });

  const fetchTokenBalance = async (
    contract: {
      getAmount: (tokenAddress: string, walletAddress: string) => Promise<bigint>;
    },
    tokenAddress: string,
    walletAddress: string,
  ): Promise<bigint | null> => {
    try {
      return (await contract.getAmount(tokenAddress, walletAddress)) as bigint;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return null;
    }
  };

  const login = async () => {
    try {
      const loginType = user?.google
        ? LoginTypeEnum.Google
        : user?.farcaster
          ? LoginTypeEnum.Farcaster
          : LoginTypeEnum.Wallet;

      privyLogin({ disableSignup: false });

      if (user && walletInfo) {
        await authLogin({
          email: user?.google?.email || null,
          walletAddress: walletInfo.address,
          loginType,
        });
      }
    } catch (error) {
      notify((error as Error).message, 'error');
      console.error('Failed to login:', error);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      await privyLogout();

      notify('Successfully logged out', 'success');
      await navigate('/');

      window.location.reload();
    } catch (error) {
      notify((error as Error).message, 'error');
      console.error('Error logging out:', error);
    }
  };

  const MAX_SCROLL = 200;
  const MAX_BLUR = 20;
  const BACKGROUND_OPACITY_FACTOR = 0.9;

  const getHeaderStyles = () => {
    const opacity = Math.min(scrollY / MAX_SCROLL, 1);
    const blur = Math.min(scrollY / MAX_SCROLL, 1) * MAX_BLUR;

    return {
      backgroundColor: `rgba(255, 255, 255, ${1 - opacity * BACKGROUND_OPACITY_FACTOR})`,
      backdropFilter: `blur(${blur}px)`,
      transform: isVisible ? 'translateY(0)' : 'translateY(-120%)',
      transition:
        'transform 0.3s ease-in-out, background-color 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
    };
  };

  useEffect(() => {
    setIsMobile(isMobileDevice);
  }, []);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as Element;
      const currentScrollY = target.scrollTop || window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    const scrollAreaViewport = document.getElementById('scroll-area-main-viewport');

    if (scrollAreaViewport) {
      scrollAreaViewport.addEventListener('scroll', handleScroll, {
        passive: true,
      });
      return () => scrollAreaViewport.removeEventListener('scroll', handleScroll);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (authenticated && user) {
      login();
    }
  }, [user]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!authenticated || !walletInfo?.address || !network) return;

      if (prevNetworkRef.current === network && prevWalletRef.current === walletInfo.address) {
        return;
      }

      prevNetworkRef.current = network;
      prevWalletRef.current = walletInfo.address;

      try {
        const tokens = tokenAddresses[network as keyof typeof tokenAddresses] || [];

        const erc20Tokens = tokens.filter(
          (token: { address: string }) => token.address !== ethers.constants.AddressZero,
        );

        const balancesPromises = erc20Tokens.map(
          (token: { address: string; decimal: number; name: string }) =>
            fetchTokenBalance(contract, token.address, walletInfo.address).then((balance) => ({
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
  }, [authenticated, walletInfo?.address, network]);

  return (
    <header
      className="sticky top-0 z-[1] flex justify-between items-center bg-white rounded-2xl px-4 md:px-10 py-4"
      style={getHeaderStyles()}
    >
      {isMobile && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center w-[50px]"
          >
            <img src={logo} alt="Logo" className="h-8 w-auto" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/investments')}
            className="hover:bg-gray-50 transition-colors px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
          >
            Funding
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center ml-auto">
        <div>
          {!authenticated && (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 px-3 md:px-4 text-sm"
              onClick={login}
            >
              Login
            </Button>
          )}
          {authenticated && (
            <div className="flex items-center gap-3">
              <Notifications />
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <span className="hidden sm:inline">
                      {profileData?.profileV2?.nickname
                        ? profileData.profileV2.nickname
                        : reduceString(walletInfo?.address || '', 6, 6)}
                    </span>
                    <span className="sm:hidden">
                      {profileData?.profileV2?.nickname
                        ? profileData.profileV2.nickname.charAt(0).toUpperCase()
                        : reduceString(walletInfo?.address || '', 4, 4)}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-[425px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-lg md:text-xl font-bold">
                      Profile
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-4 mt-5">
                      <div className="border border-gray-border rounded-[10px] p-3 md:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 text-sm md:text-base font-bold gap-2">
                          <span>Balance</span>
                          <div>
                            <NetworkSelector
                              value={networkId || undefined}
                              onValueChange={(value: string) => {
                                setNetworkId(value);
                              }}
                              networks={networksWithTokens}
                              className="min-w-[120px] h-10 w-full sm:w-auto"
                            />
                          </div>
                        </div>
                        <div className="text-sm md:text-base">
                          {balances.map((balance) => {
                            return (
                              <div
                                key={balance.name}
                                className="mb-2 flex flex-col sm:flex-row sm:justify-between"
                              >
                                <span className="font-medium">{balance.name}:</span>
                                <span className="break-all">
                                  {balance.amount !== null
                                    ? commaNumber(
                                        ethers.utils.formatUnits(balance.amount, balance.decimal),
                                      )
                                    : 'Fetching...'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="border border-gray-border rounded-[10px] p-3 md:p-5">
                        <div className="mb-3 text-sm md:text-base font-bold">Account</div>
                        {injectedWallet ? (
                          <div
                            className="cursor-pointer hover:underline text-sm md:text-base break-all"
                            onClick={() => {
                              navigator.clipboard.writeText(walletInfo?.address || '');
                              notify('Copied address!', 'success');
                            }}
                          >
                            <span className="hidden sm:inline">
                              {reduceString(walletInfo?.address || '', 8, 8)}
                            </span>
                            <span className="sm:hidden">
                              {reduceString(walletInfo?.address || '', 6, 6)}
                            </span>
                          </div>
                        ) : (
                          <Button
                            className="h-10 w-full text-sm md:text-base"
                            onClick={exportWallet}
                          >
                            See Wallet Detail
                          </Button>
                        )}
                      </div>
                      <Button className="w-full text-sm md:text-base" onClick={logout}>
                        Logout
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
