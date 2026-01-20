import avatarDefault from "@/assets/avatar-default.svg";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ProfileEditDialog } from "./profile-edit-dialog";

interface ProfileSectionProps {
  profileImage?: string | null;
  email?: string | null;
  walletAddress?: string | null;
  nickname?: string | null;
  timezone?: string | null;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profileImage,
  email,
  walletAddress,
  nickname,
  timezone: savedTimezone,
}) => {
  const isMobile = useIsMobile();
  const [displayTimezone, setDisplayTimezone] = useState<string>("");

  useEffect(() => {
    if (savedTimezone) {
      setDisplayTimezone(savedTimezone);
    }
  }, [savedTimezone]);

  return (
    <div
      className={cn(
        "flex flex-col gap-6 bg-white border border-gray-200 rounded-lg px-10 py-5",
        isMobile && "gap-[18px] px-[14px] py-4"
      )}
    >
      {!isMobile && (
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Profile</h2>
          <ProfileEditDialog
            profileImage={profileImage}
            email={email}
            walletAddress={walletAddress}
            nickname={nickname}
            savedTimezone={savedTimezone}
          />
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="w-26 h-26">
            <AvatarImage
              className="bg-neutral-100"
              src={profileImage || avatarDefault}
            />
          </Avatar>
          <div>
            <p
              className={cn(
                "text-sm font-medium text-gray-900 mb-4",
                isMobile && "mb-[10px]"
              )}
            >
              Nickname
            </p>
            <p className="text-lg text-slate-600">{nickname || "-"}</p>
          </div>
        </div>
        {isMobile && (
          <ProfileEditDialog
            profileImage={profileImage}
            email={email}
            walletAddress={walletAddress}
            nickname={nickname}
            savedTimezone={savedTimezone}
          />
        )}
      </div>

      <div>
        <p
          className={cn(
            "text-sm font-medium text-gray-900 mb-4",
            isMobile && "mb-[10px]"
          )}
        >
          Email
        </p>
        <p className="text-sm text-slate-600">{email || "-"}</p>
      </div>

      <div>
        <p
          className={cn(
            "text-sm font-medium text-gray-900 mb-4",
            isMobile && "mb-[10px]"
          )}
        >
          Wallet
        </p>
        <p className="text-sm text-slate-600">{walletAddress || "-"}</p>
      </div>

      <div className="mb-4">
        <p
          className={cn(
            "text-sm font-medium text-gray-900 mb-4",
            isMobile && "mb-[10px]"
          )}
        >
          Location
        </p>
        <p className="text-sm text-slate-600">{displayTimezone || "-"}</p>
      </div>
    </div>
  );
};
