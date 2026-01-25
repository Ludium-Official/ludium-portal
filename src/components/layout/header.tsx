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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { aboutLink, getMenuItems } from '@/constant/menu-items';
import { tokenAddresses } from '@/constant/token-address';
import { useNetworks } from '@/contexts/networks-context';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, commaNumber, mainnetDefaultNetwork, reduceString } from '@/lib/utils';
import type { BalanceProps } from '@/types/asset';
import { LoginTypeEnum } from '@/types/types.generated';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { ChevronDown, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import NetworkSelector from '../network-selector';

function Header() {
  const navigate = useNavigate();

  const { user, authenticated, login: privyLogin, logout: privyLogout, exportWallet } = usePrivy();
  const { login: authLogin, logout: authLogout } = useAuth();

  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
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

  const menuItems = getMenuItems(authenticated);

  if (isMobile) {
    return (
      <header
        className={cn(
          'sticky top-0 z-[1] flex justify-between items-center bg-white px-4 pt-4 pb-5',
          isMobile && 'border-b border-gray-100',
        )}
        style={getHeaderStyles()}
      >
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button type="button" className={cn('p-2 -ml-2', isMobile && 'p-0 ml-0')}>
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-left">
                <img src={logo} alt="Ludium" className="h-6" />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col justify-between flex-1">
              <nav className="flex flex-col">
                {menuItems.map((item) =>
                  item.submenu ? (
                    <div key={item.path}>
                      <button
                        type="button"
                        className="w-full px-4 py-3 text-base font-medium hover:bg-gray-100 transition-colors flex items-center justify-between"
                        onClick={() =>
                          setOpenMenuPath(openMenuPath === item.path ? null : item.path)
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openMenuPath === item.path ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openMenuPath === item.path ? 'max-h-[200px]' : 'max-h-0'
                        }`}
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="px-4 py-3 text-base font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <a
                  href={aboutLink.path}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 text-base font-medium hover:bg-gray-100 transition-colors block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {aboutLink.label}
                </a>
              </nav>
              <div className="border-t">
                {authenticated ? (
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-base font-medium text-left text-destructive hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-base font-medium text-left text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      login();
                    }}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <img src={logo} alt="Ludium" className="h-6" />
        </button>

        <div className="flex items-center">
          {authenticated ? <Notifications /> : <div className="w-6" />}
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-[1] flex justify-between items-center bg-white rounded-2xl px-4 md:px-10 py-[10px]"
      style={getHeaderStyles()}
    >
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
                    {profileData?.profileV2?.nickname
                      ? profileData.profileV2.nickname
                      : reduceString(walletInfo?.address || '', 6, 6)}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[425px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">Profile</DialogTitle>
                    <DialogDescription className="flex flex-col gap-4 mt-5">
                      <div className="border border-gray-border rounded-[10px] p-5">
                        <div className="flex items-center justify-between mb-3 text-base font-bold">
                          <span>Balance</span>
                          <NetworkSelector
                            value={networkId || undefined}
                            onValueChange={(value: string) => {
                              setNetworkId(value);
                            }}
                            networks={networksWithTokens}
                            className="min-w-[120px] h-10"
                          />
                        </div>
                        <div className="text-base">
                          {balances.map((balance) => (
                            <div key={balance.name} className="mb-2 flex justify-between">
                              <span className="font-medium">{balance.name}:</span>
                              <span className="break-all">
                                {balance.amount !== null
                                  ? commaNumber(
                                      ethers.utils.formatUnits(balance.amount, balance.decimal),
                                    )
                                  : 'Fetching...'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border border-gray-border rounded-[10px] p-5">
                        <div className="mb-3 text-base font-bold">Account</div>
                        {injectedWallet ? (
                          <div
                            className="cursor-pointer hover:underline text-base break-all"
                            onClick={() => {
                              navigator.clipboard.writeText(walletInfo?.address || '');
                              notify('Copied address!', 'success');
                            }}
                          >
                            {reduceString(walletInfo?.address || '', 8, 8)}
                          </div>
                        ) : (
                          <Button className="h-10 w-full text-base" onClick={exportWallet}>
                            See Wallet Detail
                          </Button>
                        )}
                      </div>
                      <Button className="w-full text-base" onClick={logout}>
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
