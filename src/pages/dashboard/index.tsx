import {
  useBuilderPaymentOverviewQuery,
  useHiringActivityQuery,
  useJobActivityQuery,
  useSponsorPaymentOverviewQuery,
} from '@/apollo/queries/dashboard-v2.generated';
import { useProfileV2Query } from '@/apollo/queries/profile-v2.generated';
import avatarDefault from '@/assets/avatar-default.svg';
import { WalletCard } from '@/components/common/wallet-card';
import Container from '@/components/layout/container';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Timezone, fetchTimezones } from '@/lib/api/timezones';
import { cn, commaNumber } from '@/lib/utils';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { AvatarImage } from '@radix-ui/react-avatar';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PaymentOverview } from './_components/payment-overview';

const DashboardPage: React.FC = () => {
  const isMobile = useIsMobile();

  const [location, setLocation] = useState<Timezone | null>(null);

  const { data: profileData } = useProfileV2Query({
    fetchPolicy: 'network-only',
  });

  const user = profileData?.profileV2;

  const { data: hiringActivityData } = useHiringActivityQuery({
    skip: !profileData?.profileV2?.id,
    fetchPolicy: 'network-only',
  });

  const { data: jobActivityData } = useJobActivityQuery({
    skip: !profileData?.profileV2?.id,
    fetchPolicy: 'network-only',
  });

  const { data: sponsorPaymentData } = useSponsorPaymentOverviewQuery({
    skip: !profileData?.profileV2?.id,
    fetchPolicy: 'network-only',
  });

  const { data: builderPaymentData } = useBuilderPaymentOverviewQuery({
    skip: !profileData?.profileV2?.id,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const loadTimezones = async () => {
      try {
        const data = await fetchTimezones();

        setLocation(data.find((tz) => tz.value === user?.location) || null);
      } catch (error) {
        console.error('Failed to fetch timezones:', error);
      }
    };
    loadTimezones();
  }, [user?.location]);

  return (
    <Container className="py-10 space-y-5 max-w-[1500px]">
      <div className="flex items-center gap-3">
        <Avatar className="h-17 w-17">
          <AvatarImage src={user?.profileImage ? user?.profileImage : avatarDefault} />
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-bold text-lg text-gray-900">
            {user?.nickname || user?.email || user?.walletAddress || 'Unknown'}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.userRole}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {user?.location ? location?.label : '-'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
        <WalletCard />

        <div className={cn('grid grid-cols-2 gap-5', isMobile && 'gap-[10px]')}>
          <Card className={cn('border-none shadow-none', isMobile && 'gap-5')}>
            <CardHeader className="pb-3! border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Hiring Activity</CardTitle>
                <Link to="/dashboard/recruitment/sponsor">
                  <ArrowUpRight className="w-6 h-6" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className={cn('py-2 space-y-6', isMobile && 'space-y-4')}>
              <div>
                <p className="font-light text-sm text-slate-500 mb-1">Open Program</p>
                <p className="text-xl font-semibold">
                  {commaNumber(hiringActivityData?.hiringActivity?.openPrograms ?? 0)}
                </p>
              </div>
              <div>
                <p className="font-light text-sm text-slate-500 mb-1">Ongoing Program</p>
                <p className="text-xl font-semibold">
                  {commaNumber(hiringActivityData?.hiringActivity?.ongoingPrograms ?? 0)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn('border-none shadow-none', isMobile && 'gap-5')}>
            <CardHeader className="pb-3! border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Job Activity</CardTitle>
                <Link to="/dashboard/recruitment/builder">
                  <ArrowUpRight className="w-6 h-6" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className={cn('py-2 space-y-6', isMobile && 'space-y-4')}>
              <div>
                <p className="font-light text-sm text-slate-500 mb-1">Applied</p>
                <p className="text-xl font-semibold">
                  {commaNumber(jobActivityData?.jobActivity?.appliedPrograms ?? 0)}
                </p>
              </div>
              <div>
                <p className="font-light text-sm text-slate-500 mb-1">Ongoing Program</p>
                <p className="text-xl font-semibold">
                  {commaNumber(jobActivityData?.jobActivity?.ongoingPrograms ?? 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <PaymentOverview
          sponsorPaymentOverview={sponsorPaymentData?.sponsorPaymentOverview ?? []}
          builderPaymentOverview={builderPaymentData?.builderPaymentOverview ?? []}
        />
        <div className="lg:col-span-2">
          {/* TODO: Implement the empty space - not implemented */}
        </div>
      </div>
    </Container>
  );
};

export default DashboardPage;
