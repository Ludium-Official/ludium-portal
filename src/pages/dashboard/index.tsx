import { useProfileV2Query } from "@/apollo/queries/profile-v2.generated";
import avatarDefault from "@/assets/avatar-default.svg";
import { WalletCard } from "@/components/common/wallet-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PaymentOverview } from "./_components/payment-overview";
import { Link } from "react-router";
import { cn, commaNumber } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const mockHiringActivity = {
  openProgram: 1000,
  ongoingProgram: 1000,
};

const mockJobActivity = {
  applied: 1000,
  ongoingProgram: 1000,
};

const DashboardPage: React.FC = () => {
  const { data: profileData } = useProfileV2Query({
    fetchPolicy: "network-only",
  });

  const user = profileData?.profileV2;

  return (
    <div className="mx-auto p-10 space-y-5">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user?.profileImage ? user?.profileImage : avatarDefault}
          />
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-bold text-lg text-gray-900">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="font-semibold text-sm text-muted-foreground">
            {user?.organizationName || "-"}
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />-
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <WalletCard />

        <Card className="border-none shadow-none">
          <CardHeader className="pb-3! border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Hiring Activity
              </CardTitle>
              <Link to="/dashboard/recruitment/sponsor">
                <ArrowUpRight className="w-6 h-6" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="py-2 space-y-6">
            <div>
              <p className="font-light text-sm text-slate-500 mb-1">
                Open Program
              </p>
              <p className="text-xl font-semibold">
                {commaNumber(mockHiringActivity.openProgram)}
              </p>
            </div>
            <div>
              <p className="font-light text-sm text-slate-500 mb-1">
                Ongoing Program
              </p>
              <p className="text-xl font-semibold">
                {commaNumber(mockHiringActivity.ongoingProgram)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none">
          <CardHeader className="pb-3! border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Job Activity
              </CardTitle>
              <Link to="/dashboard/recruitment/builder">
                <ArrowUpRight className="w-6 h-6" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="py-2 space-y-6">
            <div>
              <p className="font-light text-sm text-slate-500 mb-1">Applied</p>
              <p className="text-xl font-semibold">
                {commaNumber(mockJobActivity.applied)}
              </p>
            </div>
            <div>
              <p className="font-light text-sm text-slate-500 mb-1">
                Ongoing Program
              </p>
              <p className="text-xl font-semibold">
                {commaNumber(mockJobActivity.ongoingProgram)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <PaymentOverview />
        <div className="lg:col-span-2">
          {/* TODO: Implement the empty space - not implemented */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
