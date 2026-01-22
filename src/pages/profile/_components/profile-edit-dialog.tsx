import client from '@/apollo/client';
import { useRequestEmailVerificationV2Mutation } from '@/apollo/mutation/request-email-verification-v2.generated';
import { useUpdateProfileSectionV2Mutation } from '@/apollo/mutation/update-profile-section-v2.generated';
import { useVerifyEmailV2Mutation } from '@/apollo/mutation/verify-email-v2.generated';
import { ProfileV2Document } from '@/apollo/queries/profile-v2.generated';
import avatarDefault from '@/assets/avatar-default.svg';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MobileFullScreenDialog } from '@/components/ui/mobile-full-screen-dialog';
import { SearchSelect } from '@/components/ui/search-select';
import { type Timezone, fetchTimezones } from '@/lib/api/timezones';
import notify from '@/lib/notify';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn, getBrowserTimezone } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pen, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const profileFormSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  email: z.string().email('Invalid email address'),
  timezone: z.string().min(1, 'Location is required'),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileEditDialogProps {
  profileImage?: string | null;
  email?: string | null;
  walletAddress?: string | null;
  nickname?: string | null;
  savedTimezone?: string | null;
}

export const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  profileImage,
  email,
  walletAddress,
  nickname,
  savedTimezone,
}) => {
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [timezoneOptions, setTimezoneOptions] = useState<Timezone[]>([]);
  const [timezonesLoading, setTimezonesLoading] = useState(false);
  const [timezoneInput, setTimezoneInput] = useState<string>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | undefined>(undefined);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resolvedTimezone, setResolvedTimezone] = useState<string>(savedTimezone || '');

  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [updateProfileSectionV2, { loading: updatingProfile }] =
    useUpdateProfileSectionV2Mutation();
  const [requestEmailVerification, { loading: sendingCode }] =
    useRequestEmailVerificationV2Mutation();
  const [verifyEmail, { loading: verifyingEmail }] = useVerifyEmailV2Mutation();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    values: {
      nickname: nickname || '',
      email: email || '',
      timezone: resolvedTimezone,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = form;

  const formTimezone = watch('timezone');
  const formEmail = watch('email');

  useEffect(() => {
    const loadTimezones = async () => {
      setTimezonesLoading(true);
      try {
        const data = await fetchTimezones();
        setTimezoneOptions(data);

        if (savedTimezone) {
          setResolvedTimezone(savedTimezone);
        } else if (data.length > 0) {
          const matchedTz = getBrowserTimezone(data);
          if (matchedTz) {
            setResolvedTimezone(matchedTz.value);
          }
        }
      } catch (error) {
        console.error('Failed to fetch timezones:', error);
      } finally {
        setTimezonesLoading(false);
      }
    };
    loadTimezones();
  }, [savedTimezone]);

  useEffect(() => {
    setImagePreview(profileImage || null);
  }, [profileImage]);

  useEffect(() => {
    if (countdown <= 0) {
      if (isCodeSent) {
        setIsCodeSent(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isCodeSent]);

  useEffect(() => {
    setIsCodeSent(false);
    setVerificationCode('');
    setCountdown(0);
    setIsEmailVerified(false);
  }, [formEmail]);

  const handleSendCode = async () => {
    if (!formEmail || errors.email) return;

    try {
      await requestEmailVerification({
        variables: {
          input: {
            email: formEmail,
          },
        },
      });

      setIsCodeSent(true);
      setCountdown(120);
      setVerificationCode('');
      setIsEmailVerified(false);
      notify('Verification code sent to your email', 'success');
    } catch (error) {
      console.error('Failed to send verification code:', error);
      notify('Failed to send verification code', 'error');
    }
  };

  const handleVerifyEmail = async () => {
    if (!formEmail || !verificationCode) return;

    try {
      const result = await verifyEmail({
        variables: {
          email: formEmail,
          verificationCode: verificationCode,
        },
      });

      if (result.data?.verifyEmailV2) {
        setIsEmailVerified(true);
        setCountdown(0);
        notify('Email verified successfully', 'success');
      } else {
        notify('Invalid verification code', 'error');
      }
    } catch (error) {
      console.error('Failed to verify email:', error);
      notify('Failed to verify email', 'error');
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setImageError('Only PNG, JPG, or JPEG files are allowed.');
      setSelectedAvatar(undefined);
      setImagePreview(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be under 2MB.');
      setSelectedAvatar(undefined);
      setImagePreview(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      if (img.width !== img.height) {
        setImageError('Image must be square (1:1).');
        setSelectedAvatar(undefined);
        setImagePreview(null);
      } else {
        setSelectedAvatar(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    img.onerror = () => {
      setImageError('Invalid image file.');
      setSelectedAvatar(undefined);
      setImagePreview(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileSectionV2({
      variables: {
        input: {
          email: data.email,
          location: data.timezone,
          nickname: data.nickname,
          profileImage: selectedAvatar,
          verificationCode,
        },
      },
      onCompleted: async () => {
        notify('Profile updated successfully!', 'success');
        client.refetchQueries({ include: [ProfileV2Document] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error('Failed to update profile:', error);
        notify('Failed to update profile', 'error');
      },
    });
  };

  const handleCancel = () => {
    const matchedTz = savedTimezone || getBrowserTimezone(timezoneOptions)?.value || '';
    setResolvedTimezone(matchedTz);
    setImagePreview(profileImage || null);
    setSelectedAvatar(undefined);
    setImageError(null);
    setIsCodeSent(false);
    setVerificationCode('');
    setCountdown(0);
    setIsEmailVerified(false);
    setIsOpen(false);
  };

  const formContent = (
    <div className={cn('space-y-6', isMobile && 'space-y-10')}>
      <div className="flex items-center gap-6">
        <Avatar className="w-26 h-26">
          <AvatarImage className="bg-neutral-100" src={imagePreview || avatarDefault} />
        </Avatar>
        <div className="space-y-2">
          <p className="font-medium text-sm">Profile image</p>
          <p className="text-xs text-gray-500">
            Profile image must be under 2MB, and in PNG, JPG, or JPEG format.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleImageChange}
          />
          {imageError && <p className="text-sm text-red-500">{imageError}</p>}
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
        <Input placeholder="Enter Nickname" {...register('nickname')} />
        {errors.nickname && <p className="text-sm text-red-500 mt-1">{errors.nickname.message}</p>}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">
          Email <span className="text-red-500">*</span>
        </p>
        <div className="flex gap-6">
          <Input
            placeholder="Enter Email"
            {...register('email')}
            className="flex-1"
            disabled={isCodeSent && countdown > 0}
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={
              formEmail === email || !!errors.email || sendingCode || (isCodeSent && countdown > 0)
            }
            onClick={handleSendCode}
          >
            {sendingCode ? 'Sending...' : 'Send code'}
          </Button>
        </div>
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}

        {isCodeSent && !isEmailVerified && (
          <div className="mt-4">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Enter Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-48"
              />
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={countdown === 0 || !verificationCode || verifyingEmail}
                onClick={handleVerifyEmail}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {verifyingEmail ? 'Verifying...' : 'Verify email'}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Expires in {formatCountdown(countdown)}</p>
          </div>
        )}

        {isEmailVerified && <p className="text-sm text-green-600 mt-2">✓ Email verified</p>}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">Wallet</p>
        <Input value={walletAddress || ''} disabled className="bg-gray-50 text-gray-500" />
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
            if (typeof value === 'function') {
              const newValue = value(formTimezone) || '';
              setResolvedTimezone(newValue);
            } else {
              setResolvedTimezone(value || '');
            }
          }}
          inputValue={timezoneInput}
          setInputValue={setTimezoneInput}
          emptyText="Search timezone"
          loading={timezonesLoading}
          showValue
        />
        {errors.timezone && <p className="text-sm text-red-500 mt-1">{errors.timezone.message}</p>}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button variant="outline" size="icon" className="h-9 w-10" onClick={() => setIsOpen(true)}>
          <Pen className="h-4 w-4" />
        </Button>

        <MobileFullScreenDialog
          open={isOpen}
          onClose={handleCancel}
          title="Edit Profile"
          onAction={handleSubmit(onSubmit)}
          actionDisabled={!isValid}
          actionLoading={updatingProfile}
        >
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>{formContent}</form>
          </Form>
        </MobileFullScreenDialog>
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-10">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[782px] px-10 py-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-800">Profile</DialogTitle>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={!isValid || updatingProfile}
                >
                  {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </DialogHeader>

            <div className="my-4">{formContent}</div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
