import { useProfileQuery } from '@/apollo/queries/profile.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import NetworkSelector from '@/components/network-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from '@/components/ui/share-button';
import SocialIcon from '@/components/ui/social-icon';
import { tokenAddresses } from '@/constant/token-address';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { cn, commaNumber, mainnetDefaultNetwork, reduceString } from '@/lib/utils';
import type { BalanceProps } from '@/types/asset';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { ArrowUpRight, Building2, CircleCheck, Settings, Sparkle, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { SidebarLinks, sidebarLinks } from '../_components/sidebar-links';
import { useNetworks } from '@/contexts/networks-context';
import RecruitmentContract from '@/lib/contract/recruitment-contract';

const adminLinks = [
  { label: 'Banner', path: 'admin/banner' },
  { label: 'Hidden programs', path: 'admin/hidden-programs' },
  { label: 'Hidden communities', path: 'admin/hidden-communities' },
  { label: 'User management', path: 'admin/user-management' },
];

function MyProfilePage() {
  const { isAdmin, isLoggedIn, isSuperadmin } = useAuth();
  const { user: privyUser, exportWallet, authenticated } = usePrivy();
  const walletInfo = privyUser?.wallet;
  const injectedWallet = privyUser?.wallet?.connectorType !== 'embedded';

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  const [balances, setBalances] = useState<BalanceProps[]>([]);
  const [networkId, setNetworkId] = useState<string | null>(null);

  const { networks: networksWithTokens } = useNetworks();

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
  });

  const user = profileData?.profile;

  const isProfileIncomplete =
    !user?.firstName?.trim() ||
    !user?.lastName?.trim() ||
    !user?.email?.trim() ||
    !user?.organizationName?.trim() ||
    !user?.summary?.trim() ||
    !user?.about?.trim();

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

  useEffect(() => {
    const fetchBalances = async () => {
      if (!authenticated || !walletInfo?.address) return;

      try {
        const tokens = tokenAddresses[network as keyof typeof tokenAddresses] || [];

        // Filter out native token (0x0000...0000) as it's not an ERC20 contract
        const erc20Tokens = tokens.filter(
          (token: { address: string }) => token.address !== ethers.constants.AddressZero,
        );

        const balancesPromises = erc20Tokens.map(
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
    <div className="bg-white rounded-2xl">
      <div className="max-w-full md:max-w-1440 mx-auto p-10">
        <div className="flex gap-6">
          <section className="max-w-[360px] flex flex-col gap-5">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-[22px]">
                <div className="p-[7.5px]">
                  <img
                    src={user?.image ?? avatarPlaceholder}
                    alt="avatar"
                    className="w-[121px] h-[121px] rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xl text-gray-dark">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />{' '}
                    {user?.organizationName?.length ? user?.organizationName : '-'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-sm text-muted-foreground">SUMMARY</p>
                <p className="text-sm text-slate-600 line-clamp-4 font-inter">
                  {user?.summary?.length ? user.summary : 'There is no summary written.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={cn(
                    'h-11 flex-1',
                    isProfileIncomplete &&
                      'bg-primary text-white hover:bg-primary/90 border-0 hover:text-white',
                  )}
                  asChild
                >
                  <Link to="/my-profile/edit">
                    Edit Profile <Settings />
                  </Link>
                </Button>
                <ShareButton
                  variant="outline"
                  className="h-11 flex-1"
                  linkToCopy={`${window.location.origin}/users/${profileData?.profile?.id}/overview`}
                />
              </div>

              {isProfileIncomplete && (
                <p className="text-sm text-primary font-medium text-center mb-2">
                  Complete Your Profile
                </p>
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-2 px-6">
              {sidebarLinks.map((item) => (
                <SidebarLinks key={item.label} item={item} myProfile />
              ))}
            </div>

            {isAdmin && (
              <div className="flex flex-col gap-2 px-6">
                <p className="text-sm px-2 gap-2 text-primary h-8 flex items-center select-none">
                  <UserCog className="w-4 h-4" /> Admin
                </p>
                <div className={'ml-4 pl-2 border-l border-gray-200 space-y-1'}>
                  {adminLinks.map((item) => (
                    <SidebarLinks key={item.label} item={item} myProfile />
                  ))}
                </div>
              </div>
            )}
            {isSuperadmin && (
              <div className="flex flex-col gap-2 px-6">
                <Link
                  to="/my-profile/admin/master-admin"
                  className={cn(
                    'text-sm px-2 gap-2 text-primary h-8 flex items-center select-none hover:bg-sidebar-accent',
                    location.pathname === '/my-profile/admin/master-admin' &&
                      'bg-sidebar-accent rounded-md',
                  )}
                >
                  <Sparkle className="w-4 h-4" /> Master
                </Link>
              </div>
            )}
            <Separator />
            <div className="flex flex-col gap-6">
              <div className="border border-[#E4B7FF] rounded-[10px] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-bold mb-1">My Wallet</p>
                    <p className="flex gap-1 line-clamp-1 items-center text-xs text-muted-foreground">
                      <CircleCheck className="text-green-500 w-4 h-4" />
                      Successfully connected
                    </p>
                  </div>
                  <div>
                    <NetworkSelector
                      value={networkId || undefined}
                      onValueChange={(value: string) => {
                        setNetworkId(value);
                      }}
                      networks={networksWithTokens}
                      className="w-[150px] h-9"
                    />
                  </div>
                </div>
                <div className="bg-accent p-2 rounded-md mb-4">
                  {balances.map((balance) => {
                    return (
                      <div
                        key={balance.name}
                        className="mb-1.5 last:mb-0 flex items-center justify-between"
                      >
                        <p className="text-muted-foreground text-xs font-bold">{balance.name}</p>
                        <p className="text-sm font-bold text-foreground">
                          {balance.amount !== null
                            ? commaNumber(ethers.utils.formatUnits(balance.amount, balance.decimal))
                            : 'Fetching...'}
                        </p>
                      </div>
                    );
                  })}
                </div>
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
                  <Button className="h-10 w-full" onClick={exportWallet}>
                    See Wallet Detail
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-muted-foreground">ROLES</p>
                <div className="flex gap-[6px] flex-wrap">
                  {(!profileData?.profile?.roleKeywords ||
                    profileData.profile.roleKeywords.length === 0) && (
                    <span className="text-xs text-muted-foreground font-normal">
                      There are no roles added yet.
                    </span>
                  )}
                  {profileData?.profile?.roleKeywords?.map((k) => (
                    <Badge
                      key={k.id}
                      className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs"
                    >
                      {k.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-sm text-muted-foreground">SKILLS</p>
                <div className="flex gap-[6px] flex-wrap">
                  {(!profileData?.profile?.skillKeywords ||
                    profileData.profile.skillKeywords.length === 0) && (
                    <span className="text-xs text-muted-foreground font-normal">
                      There are no skills added yet.
                    </span>
                  )}
                  {profileData?.profile?.skillKeywords?.map((k) => (
                    <Badge
                      key={k.id}
                      className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs"
                    >
                      {k.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-sm text-muted-foreground">LINKS</p>
                <div className="space-y-2">
                  <div className="space-y-2">
                    {user?.links?.length ? (
                      user.links.map((link, index) => {
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="bg-[#F4F4F5] rounded-md min-w-10 w-10 h-10 flex items-center justify-center">
                              <SocialIcon
                                value={link.url ?? ''}
                                className="w-4 h-4 text-secondary-foreground"
                              />
                            </div>
                            <a
                              target="_blank"
                              href={link.url || '#'}
                              className="text-sm text-slate-600 break-all"
                              rel="noreferrer"
                            >
                              {link.url || 'No link'}
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No links available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flex-1 space-y-1">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
