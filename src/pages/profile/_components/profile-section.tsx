import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/search-select";
import { fetchTimezones, type Timezone } from "@/lib/api/timezones";
import { getBrowserTimezone } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Upload } from "lucide-react";
import avatarDefault from "@/assets/avatar-default.svg";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const profileFormSchema = z.object({
  nickname: z.string().min(1, "Nickname is required"),
  email: z.string().email("Invalid email address"),
  timezone: z.string().min(1, "Location is required"),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

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
  const [displayTimezone, setDisplayTimezone] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [timezoneOptions, setTimezoneOptions] = useState<Timezone[]>([]);
  const [timezonesLoading, setTimezonesLoading] = useState(false);
  const [timezoneInput, setTimezoneInput] = useState<string>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | undefined>(
    undefined
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track the resolved timezone value for form sync
  const [resolvedTimezone, setResolvedTimezone] = useState<string>(
    savedTimezone || ""
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    values: {
      nickname: nickname || "",
      email: email || "",
      timezone: resolvedTimezone,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const formTimezone = watch("timezone");

  useEffect(() => {
    if (savedTimezone) {
      setDisplayTimezone(savedTimezone);
    }
  }, [savedTimezone]);

  useEffect(() => {
    const loadTimezones = async () => {
      setTimezonesLoading(true);
      try {
        const data = await fetchTimezones();
        setTimezoneOptions(data);

        if (savedTimezone) {
          setResolvedTimezone(savedTimezone);
          setDisplayTimezone(savedTimezone);
        } else if (data.length > 0) {
          const matchedTz = getBrowserTimezone(data);
          if (matchedTz) {
            setResolvedTimezone(matchedTz.value);
            setDisplayTimezone(matchedTz.value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch timezones:", error);
      } finally {
        setTimezonesLoading(false);
      }
    };
    loadTimezones();
  }, [savedTimezone]);

  useEffect(() => {
    setImagePreview(profileImage || null);
  }, [profileImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImageError("Only PNG, JPG, or JPEG files are allowed.");
      setSelectedAvatar(undefined);
      setImagePreview(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image must be under 2MB.");
      setSelectedAvatar(undefined);
      setImagePreview(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      if (img.width !== img.height) {
        setImageError("Image must be square (1:1).");
        setSelectedAvatar(undefined);
        setImagePreview(null);
      } else {
        setSelectedAvatar(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    img.onerror = () => {
      setImageError("Invalid image file.");
      setSelectedAvatar(undefined);
      setImagePreview(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const onSubmit = (data: ProfileFormData) => {
    // TODO: Implement API call to save profile
    console.log({
      ...data,
      avatar: selectedAvatar,
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    const matchedTz =
      savedTimezone || getBrowserTimezone(timezoneOptions)?.value || "";
    setResolvedTimezone(matchedTz);
    setImagePreview(profileImage || null);
    setSelectedAvatar(undefined);
    setImageError(null);
    setIsOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-10 py-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold">Profile</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-10">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[782px] px-10 py-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="text-base font-semibold text-slate-800">
                    Profile
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="default" size="sm">
                      Save
                    </Button>
                  </div>
                </DialogHeader>

                <div className="space-y-6 my-4">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        className="bg-neutral-300"
                        src={imagePreview || avatarDefault}
                      />
                    </Avatar>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Profile image</p>
                      <p className="text-xs text-gray-500">
                        Profile image must be under 2MB, and in PNG, JPG, or
                        JPEG format.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {imageError && (
                        <p className="text-sm text-red-500">{imageError}</p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Nickname <span className="text-red-500">*</span>
                    </p>
                    <Input
                      placeholder="Enter Nickname"
                      {...register("nickname")}
                    />
                    {errors.nickname && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.nickname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Email <span className="text-red-500">*</span>
                    </p>
                    <div className="flex gap-6">
                      <Input
                        placeholder="Enter Email"
                        {...register("email")}
                        className="flex-1"
                      />
                      <Button type="button" variant="default" size="sm">
                        Send code
                      </Button>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Wallet
                    </p>
                    <Input
                      value={walletAddress || ""}
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Location <span className="text-red-500">*</span>
                    </p>
                    <SearchSelect
                      options={timezoneOptions}
                      placeholder="Select timezone"
                      value={formTimezone}
                      setValue={(value) => {
                        if (typeof value === "function") {
                          const newValue = value(formTimezone) || "";
                          setResolvedTimezone(newValue);
                        } else {
                          setResolvedTimezone(value || "");
                        }
                      }}
                      inputValue={timezoneInput}
                      setInputValue={setTimezoneInput}
                      emptyText="Search timezone"
                      loading={timezonesLoading}
                      showValue
                    />
                    {errors.timezone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.timezone.message}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <Avatar className="w-20 h-20">
          <AvatarImage
            className="bg-neutral-300"
            src={profileImage || avatarDefault}
          />
        </Avatar>
        <div className="space-y-2">
          <p className="font-medium">Profile image</p>
          <p className="text-sm text-gray-500">
            Profile image must be under 2MB, and in PNG, JPG, or JPEG format.
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-900 mb-4">Nickname</p>
        <p className="text-sm text-slate-600">
          {nickname || "Ludium.user_1101"}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-900 mb-4">Email</p>
        <p className="text-sm text-slate-600">{email || "-"}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-900 mb-4">Wallet</p>
        <p className="text-sm text-slate-600">{walletAddress || "-"}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 mb-4">Location</p>
        <p className="text-sm text-slate-600">{displayTimezone || "-"}</p>
      </div>
    </div>
  );
};
