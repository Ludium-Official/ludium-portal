import { useProfileQuery } from '@/apollo/queries/profile.generated';
// import { useUserQuery } from '@/apollo/queries/user.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import NetworkSelector from '@/components/network-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from '@/components/ui/share-button';
import { tokenAddresses } from '@/constant/token-address';
import type ChainContract from '@/lib/contract';
import { useAuth } from '@/lib/hooks/use-auth';
import { useContract } from '@/lib/hooks/use-contract';
import notify from '@/lib/notify';
import { cn, commaNumber, mainnetDefaultNetwork, reduceString } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
// import { Separator } from '@radix-ui/react-dropdown-menu';
import { ArrowUpRight, Building2, CircleCheck, Settings, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router';
import { SidebarLinks, sidebarLinks } from '../_components/sidebar-links';
import { platformIcons } from '../agent-utils';

const adminLinks = [
  { label: 'Banner', path: 'admin/banner' },
  { label: 'Hidden programs', path: 'admin/hidden-programs' },
  { label: 'Hidden communities', path: 'admin/hidden-communities' },
  { label: 'User management', path: 'admin/user-management' },
];

function MyProfilePage() {
  // const { id } = useParams();
  const { isAdmin, isSuperadmin } = useAuth();
  const { user: privyUser, exportWallet, authenticated } = usePrivy();
  const walletInfo = privyUser?.wallet;
  const injectedWallet = privyUser?.wallet?.connectorType !== 'embedded';

  const [network, setNetwork] = useState(mainnetDefaultNetwork);
  console.log("🚀 ~ MyProfilePage ~ network:", network)
  const [balances, setBalances] = useState<
    { name: string; amount: bigint | null; decimal: number }[]
  >([]);

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
  });

  // const { data: userData } = useUserQuery({
  //   variables: {
  //     id: id ?? '',
  //   },
  // });

  const user = profileData?.profile;

  // Pseudocode:
  // 1. Identify required fields for profile from edit-profile.tsx.
  //    - Typically: firstName, lastName, email, organizationName, summary, image (avatar).
  //    - For this context, let's assume these are required: firstName, lastName, email, organizationName, summary.
  // 2. Create a boolean variable `isProfileIncomplete` that is true if any required field is missing or empty.
  // 3. Use early return logic for readability.
  // 4. Use nullish coalescing and trim for string fields to ensure no whitespace-only values.

  const isProfileIncomplete =
    !user?.firstName?.trim() ||
    !user?.lastName?.trim() ||
    !user?.email?.trim() ||
    !user?.organizationName?.trim() ||
    !user?.summary?.trim() ||
    !user?.about?.trim();


  const contract = useContract(network);

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
    <div className="bg-white rounded-2xl">
      <div className="max-w-1440 mx-auto p-10">
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
                    <Building2 className="w-4 h-4 text-muted-foreground" /> {user?.organizationName?.length ? user?.organizationName : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-sm text-muted-foreground">SUMMARY</p>
                <p className="text-sm text-slate-600 line-clamp-4 font-inter">
                  {user?.summary?.length ? user.summary : "There is no summary written."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className={cn("h-11 flex-1", isProfileIncomplete && "bg-primary text-white hover:bg-primary/90 border-0 hover:text-white")} asChild>
                  <Link to="/my-profile/edit">
                    Edit Profile <Settings />
                  </Link>
                </Button>
                <ShareButton variant="outline" className="h-11 flex-1" />
              </div>

              {isProfileIncomplete && <p className="text-sm text-primary font-medium text-center mb-2">Complete Your Profile</p>}
              {/* <Button variant={'outline'} className="h-11">
                <p className="font-medium text-sm text-gray-dark">Share</p>
                <Share2Icon />
              </Button> */}
            </div>
            <Separator />
            <div className="flex flex-col gap-2 px-6">
              {sidebarLinks.map((item) => (
                <SidebarLinks key={item.label} item={item} myProfile />
              ))}
            </div>

            {isAdmin && (
              <div className="flex flex-col gap-2 px-6">
                <p className='text-sm px-2 gap-2 text-primary h-8 flex items-center select-none'>
                  <UserCog className='w-4 h-4' /> Admin

                </p>
                <div className={'ml-4 pl-2 border-l border-gray-200 space-y-1'}>
                  {adminLinks.map((item) => (
                    <SidebarLinks key={item.label} item={item} myProfile />
                  ))}
                </div>
              </div>
            )}
            <Separator />
            <div className="flex flex-col gap-6">
              <div className="border border-[#E4B7FF] rounded-[10px] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className='text-sm font-bold mb-1'>
                      My Wallet
                    </p>
                    <p className='flex gap-1 line-clamp-1 items-center text-xs text-muted-foreground'>
                      <CircleCheck className='text-green-500 w-4 h-4' />
                      Successfully connected
                    </p>
                  </div>
                  <div>
                    <NetworkSelector
                      value={network}
                      onValueChange={setNetwork}
                      className="min-w-[120px] h-9"
                    />
                  </div>
                </div>
                <div className='bg-accent p-2 rounded-md mb-4'>
                  {balances.map((balance) => {
                    return (
                      <div key={balance.name} className="mb-1.5 last:mb-0 flex items-center justify-between">
                        <p className='text-muted-foreground text-xs font-bold'>
                          {balance.name}
                        </p>
                        <p className='text-sm font-bold text-foreground'>
                          {balance.amount !== null
                            ? commaNumber(
                              ethers.utils.formatUnits(balance.amount, balance.decimal),
                            )
                            : 'Fetching...'}
                        </p>
                        {/* {balance.name}:{' '}
                        {balance.amount !== null
                          ? commaNumber(
                            ethers.utils.formatUnits(balance.amount, balance.decimal),
                          )
                          : 'Fetching...'} */}
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
                    <ArrowUpRight className='w-4 h-4' />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-bold text-sm text-muted-foreground">ROLES</p>
                <div className="flex gap-[6px]">
                  {(!profileData?.profile?.keywords || profileData.profile.keywords.length === 0) && (
                    <span className="text-xs text-muted-foreground font-normal">
                      There are no roles added yet.
                    </span>
                  )}
                  {profileData?.profile?.keywords?.map((k) => (
                    <Badge key={k.id} className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                      {k.name}
                    </Badge>
                  ))}
                  {/* <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                    BD
                  </Badge>
                  <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                    Develope
                  </Badge> */}
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-sm text-muted-foreground">SKILLS</p>
                <div className="flex gap-[6px]">
                  <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                    Crypto
                  </Badge>
                  <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                    BD
                  </Badge>
                  <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                    Develope
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-sm text-muted-foreground">LINKS</p>
                <div className="space-y-2">
                  <div className="space-y-2">
                    {user?.links?.length ? (
                      user.links.map((link, index) => {
                        const url = link.url?.toLowerCase() || '';
                        const matchedKey = Object.keys(platformIcons).find((key) =>
                          url.includes(key),
                        );
                        const platform = matchedKey ? platformIcons[matchedKey] : null;

                        return (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <div key={index} className="flex items-center gap-2">
                            {platform && (
                              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-secondary">
                                <img
                                  src={platform.icon}
                                  width={16}
                                  height={16}
                                  alt={platform.alt}
                                />
                              </div>
                            )}
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
