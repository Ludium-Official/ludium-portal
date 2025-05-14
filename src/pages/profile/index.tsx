import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { cn } from '@/lib/utils';
import { wepinSdk } from '@/lib/wepin';
import type { WepinLifeCycle } from '@wepin/sdk-js';
import { ArrowRight, Settings, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

function ProfilePage() {
  const roles = JSON.parse(localStorage.getItem('roles') ?? '[]') as string[];

  const [selectedTab, setSelectedTab] = useState(roles?.[0] ?? 'sponsor');

  const filterBasedOnRole = {
    sponsor: 'creatorId',
    validator: 'validatorId',
    builder: 'applicantId',
  };

  const navigate = useNavigate();

  const { login } = useAuth();
  const [wepinStatus, setWepinStatus] = useState<WepinLifeCycle>();

  useEffect(() => {
    const checkWepinStatus = async () => {
      const status = await wepinSdk.getStatus();
      setWepinStatus(status);
    };

    checkWepinStatus();
    setInterval(checkWepinStatus, 5000);
  }, []);

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
  });

  const { data } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 10,
        offset: 0,
        filter: [
          {
            value: profileData?.profile?.id ?? '',
            field: filterBasedOnRole[selectedTab as 'sponsor' | 'validator' | 'builder'],
          },
        ],
      },
    },
    skip: !profileData?.profile?.id,
  });

  return (
    <div className="bg-[#F7F7F7]">
      <div className="flex px-10 py-5 justify-between bg-white rounded-b-2xl mb-3">
        <section className="">
          <h1 className="text-xl font-bold mb-6">Profile</h1>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Profile image</h3>

          <div className="px-6 py-2 mb-9">
            <img
              src={profileData?.profile?.image ?? avatarPlaceholder}
              alt="avatar"
              className="w-[121px] h-[121px] rounded-full object-cover"
            />
          </div>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Organization / Person name</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">
            {profileData?.profile?.organizationName}
          </p>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Description</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">{profileData?.profile?.about}</p>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Wallet</h3>
          <div className="p-6 mb-10 border min-w-[282px] bg-muted rounded-lg shadow-sm relative">
            <label htmlFor="description" className="block text-foreground font-medium mb-2 text-sm">
              My Wallet
            </label>
            <span
              className={cn(
                'block text-sm text-[#71717A] mb-5',
                !!profileData?.profile?.wallet?.address && 'mb-2',
              )}
            >
              {wepinStatus === 'login' ? 'Your wallet is connected' : 'Connect your wallet'}
            </span>
            {profileData?.profile?.wallet?.address && (
              <p className="text-xs text-[#71717A] mb-5">{profileData?.profile?.wallet?.address}</p>
            )}

            <Button
              onClick={async () => {
                const user = await wepinSdk.loginWithUI();

                if (user.status === 'success') {
                  const accounts = await wepinSdk.getAccounts();

                  await login({
                    email: user.userInfo?.email ?? '',
                    userId: user.userInfo?.userId ?? '',
                    walletId: user.walletId ?? '',
                    address: accounts?.[0]?.address ?? '',
                    network: accounts?.[0]?.network ?? '',
                  });

                  notify('Successfully logged in', 'success');
                  navigate('/profile');
                }
              }}
              disabled={wepinStatus === 'login'}
              className="bg-[#B331FF] hover:bg-[#B331FF]/90 h-9 w-[133px] ml-auto flex text-xs"
            >
              {wepinStatus === 'login' ? 'Connected' : 'Connect wallet'} <Wallet />
            </Button>
          </div>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Roles</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">
            {roles.map((r, idx) =>
              r.length
                ? `${r[0].toUpperCase()}${r.slice(1)}${idx === roles.length - 1 ? '' : ', '}`
                : r,
            )}
          </p>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Links</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">
            {profileData?.profile?.links?.map((l) => (
              <p key={l.url}>{l.url}</p>
            ))}
          </p>
        </section>

        <section>
          <Link to="./edit" className="text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" /> Edit
          </Link>
        </section>
      </div>

      <div className="bg-white p-5 rounded-t-2xl">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full">
            {/* {roles.map(r => (
              <TabsTrigger key={r} value={r}>Programs as {r}</TabsTrigger>
            ))} */}
            <TabsTrigger value={'sponsor'}>Programs as sponsor</TabsTrigger>
            <TabsTrigger value={'validator'}>Programs as validator</TabsTrigger>
            <TabsTrigger value={'builder'}>Programs as builder</TabsTrigger>
          </TabsList>
        </Tabs>

        <h2 className="text-xl font-bold mt-10 mb-6">Programs as {selectedTab}</h2>

        {!data?.programs?.data?.length && (
          <p className="text-sm text-muted-foreground">No programs found</p>
        )}

        {data?.programs?.data?.map((p) => (
          <div key={p.id} className="border rounded-xl p-6 mb-6">
            <div className="flex justify-between mb-4">
              <Badge>{p.status}</Badge>
              <Link to={`/programs/${p.id}`} className="flex gap-2 text-sm items-center">
                See more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <h2 className="text-lg font-semibold mb-[6px]">{p.name}</h2>
            <span className="inline-block py-1 px-2 mb-4 rounded-[6px] text-xs font-bold text-[#B331FF] bg-[#F8ECFF]">
              {p.price} {p.currency}
            </span>

            <p className="text-sm font-medium">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
