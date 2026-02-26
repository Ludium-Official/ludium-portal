import { useCreateHackathonBuidlMutation } from '@/apollo/mutation/create-hackathon-buidl.generated';
import Container from '@/components/layout/container';
import { useHackathonQuery } from '@/apollo/queries/hackathon.generated';
import { useHackathonSponsorsQuery } from '@/apollo/queries/hackathon-sponsors.generated';
import { useUsersV2LazyQuery } from '@/apollo/queries/users-v2.generated';
import InputLabel from '@/components/common/label/inputLabel';
import MarkdownEditor from '@/components/markdown/markdown-editor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import notify from '@/lib/notify';
import { cn, getInitials, getUserDisplayName } from '@/lib/utils';
import { ImageIcon, Loader2, Plus, Upload, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

const STEPS = ['Profile', 'Detail', 'Submissions'] as const;

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

interface BuidlFormValues {
  title: string;
  description: string;
  buidlDescription: string;
  githubLink: string;
  websiteLink: string;
  demoVideoLink: string;
}

interface MemberUser {
  id: string;
  displayName: string;
  email: string | null;
  profileImage: string | null;
}

function HackathonBuidlSubmitPage() {
  const { id: hackathonId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);

  // Complex fields managed with local state
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<string[]>(['']);
  const [socialLinkErrors, setSocialLinkErrors] = useState<(string | undefined)[]>([undefined]);
  const [memberUsers, setMemberUsers] = useState<MemberUser[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberPopoverOpen, setMemberPopoverOpen] = useState(false);
  const [sponsorIds, setSponsorIds] = useState<string[]>([]);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<BuidlFormValues>({
    defaultValues: {
      title: '',
      description: '',
      buidlDescription: '',
      githubLink: '',
      websiteLink: '',
      demoVideoLink: '',
    },
  });

  const description = watch('description') ?? '';
  const buidlDescription = watch('buidlDescription') ?? '';

  const { data: hackathonData, loading: hackathonLoading } = useHackathonQuery({
    variables: { id: hackathonId ?? '' },
    skip: !hackathonId,
  });

  useEffect(() => {
    if (hackathonLoading || !hackathonData?.hackathon) return;
    const now = Date.now();
    const submissionAt = hackathonData.hackathon.submissionAt
      ? new Date(hackathonData.hackathon.submissionAt).getTime()
      : null;
    const deadlineAt = hackathonData.hackathon.deadlineAt
      ? new Date(hackathonData.hackathon.deadlineAt).getTime()
      : null;
    if (submissionAt && now < submissionAt) {
      notify('Submission period has not started yet.', 'error');
      navigate(`/programs/hackathon/${hackathonId}`);
    } else if (deadlineAt && now > deadlineAt) {
      notify('Submission deadline has passed.', 'error');
      navigate(`/programs/hackathon/${hackathonId}`);
    }
  }, [hackathonData, hackathonLoading, hackathonId, navigate]);

  const { data: sponsorsData } = useHackathonSponsorsQuery({
    variables: { hackathonId: hackathonId ?? '' },
    skip: !hackathonId,
  });
  const sponsors = sponsorsData?.hackathonSponsors ?? [];

  const sponsorOptions = useMemo(
    () =>
      sponsors.map((s) => ({
        label: s.name ?? '',
        value: s.id ?? '',
        icon: s.sponsorImage
          ? function SponsorImage({ className }: { className?: string }) {
              return (
                <img
                  src={s.sponsorImage!}
                  alt={s.name || ''}
                  className={cn('rounded-sm object-cover', className)}
                />
              );
            }
          : undefined,
      })),
    [sponsors],
  );

  const [searchUsers, { data: usersData, loading: usersLoading }] = useUsersV2LazyQuery();

  useEffect(() => {
    if (!memberSearch.trim()) return;
    const timer = setTimeout(() => {
      searchUsers({ variables: { query: { search: memberSearch, limit: 10 } } });
    }, 300);
    return () => clearTimeout(timer);
  }, [memberSearch, searchUsers]);

  const searchResults = (usersData?.usersV2?.users ?? []).filter(
    (u) => u.nickname && !memberUsers.some((m) => m.id === (u.id ?? '')),
  );

  const addMember = (user: MemberUser) => {
    setMemberUsers((prev) => [...prev, user]);
    setMemberSearch('');
    setMemberPopoverOpen(false);
  };

  const removeMember = (id: string) => {
    setMemberUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const [createBuidl, { loading }] = useCreateHackathonBuidlMutation();

  const handleCoverImage = (file: File) => {
    setCoverImageError(null);
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setCoverImageError('Only PNG, JPG, or JPEG files are allowed.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setCoverImageError('Image must be under 4MB.');
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.width < 333 || img.height < 333) {
        setCoverImageError('Cover image must be at least 333×333 px.');
        return;
      }
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    };
    img.onerror = () => setCoverImageError('Invalid image file.');
    img.src = URL.createObjectURL(file);
  };

  const updateSocialLink = (index: number, value: string) => {
    setSocialLinks((prev) => prev.map((v, i) => (i === index ? value : v)));
    if (!value.trim()) {
      setSocialLinkErrors((prev) => prev.map((e, i) => (i === index ? undefined : e)));
    }
  };

  const validateSocialLink = (index: number, value: string) => {
    if (value.trim() && !isValidUrl(value)) {
      setSocialLinkErrors((prev) =>
        prev.map((e, i) => (i === index ? 'Please enter a valid URL (https://...)' : e)),
      );
    } else {
      setSocialLinkErrors((prev) => prev.map((e, i) => (i === index ? undefined : e)));
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    setSocialLinkErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (step === 0) {
      const hasValidSocialLink = socialLinks.some((s) => s.trim());
      const hasInvalidSocialLink = socialLinks.some((s) => s.trim() && !isValidUrl(s));
      return (
        watch('title').trim() &&
        description.trim() &&
        coverImage &&
        hasValidSocialLink &&
        !hasInvalidSocialLink
      );
    }
    if (step === 1) return buidlDescription.trim();
    if (step === 2) return sponsorIds.length > 0;
    return true;
  };

  const onSubmit = async (values: BuidlFormValues) => {
    if (!hackathonId || !coverImage) return;
    if (!values.title.trim() || !values.description.trim() || !values.buidlDescription.trim())
      return;
    if (socialLinks.filter((s) => s.trim()).some((s) => !isValidUrl(s))) return;
    if (!sponsorIds.length) return;
    try {
      await createBuidl({
        variables: {
          input: {
            hackathonId,
            title: values.title,
            description: values.description,
            buidlDescription: values.buidlDescription,
            coverImage,
            socialLinks: socialLinks.filter((s) => s.trim()),
            memberUserIds: memberUsers.length
              ? memberUsers.map((u) => parseInt(u.id, 10)).filter(Boolean)
              : undefined,
            sponsorIds: sponsorIds.length ? sponsorIds : undefined,
            githubLink: values.githubLink || undefined,
            websiteLink: values.websiteLink || undefined,
            demoVideoLink: values.demoVideoLink || undefined,
          },
        },
      });
      navigate(`/programs/hackathon/${hackathonId}?tab=buidls`);
    } catch {
      // errors are handled by Apollo error state
    }
  };

  if (hackathonLoading) {
    return (
      <div className="bg-white w-full rounded-2xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-white w-full rounded-2xl">
      <Container className="max-w-[856px] mx-auto py-10 px-4">
        <h1 className="text-xl font-bold mb-6">Submit BUIDL</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white border border-gray-200 rounded-xl px-10 py-9 mb-6">
            <div className="flex gap-[10px] mb-15">
              {STEPS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className="flex-1 flex flex-col gap-[12px] text-left"
                  onClick={() => i < step && setStep(i)}
                  disabled={i >= step}
                >
                  <div className="text-xs font-medium">{label}</div>
                  <div
                    className={cn(
                      'h-[10px] rounded-full transition-colors',
                      i < step ? 'bg-primary' : i === step ? 'bg-primary-300' : 'bg-gray-200',
                    )}
                  />
                </button>
              ))}
            </div>

            {step === 0 && (
              <div className="flex flex-col gap-10">
                <InputLabel
                  labelId="title"
                  title="BUIDL Name"
                  isPrimary
                  placeholder="Enter BUIDL Name"
                  register={register}
                />

                <InputLabel
                  labelId="description"
                  title="Description"
                  isPrimary
                  isTextarea
                  placeholder="Introduce yourself. You can describe your skills, experience, and background."
                  inputClassName="!h-38 resize-none"
                  register={register}
                >
                  <div className="text-xs text-muted-foreground text-right mt-2">
                    {description.length}/500 characters
                  </div>
                </InputLabel>

                <div className="space-y-2">
                  <div className="flex items-center gap-6">
                    <div
                      className="w-25 h-25 border border-gray-200 rounded-md flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {coverImagePreview ? (
                        <img
                          src={coverImagePreview}
                          alt="cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">
                        Cover image <span className="text-red-500">*</span>
                      </p>
                      <p className="mb-2 text-muted-foreground">
                        Cover image must be at least 333×333 px.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2 px-3!"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverImage(file);
                      }}
                    />
                  </div>
                  {coverImageError && <p className="text-xs text-red-500">{coverImageError}</p>}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Social links <span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-col gap-2">
                    {socialLinks.map((link, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Enter a social profile URL (GitHub, LinkedIn, X, etc.)"
                            value={link}
                            onChange={(e) => updateSocialLink(i, e.target.value)}
                            onBlur={(e) => validateSocialLink(i, e.target.value)}
                            className={socialLinkErrors[i] ? 'border-destructive' : ''}
                          />
                          {socialLinks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSocialLink(i)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {socialLinkErrors[i] && (
                          <p className="text-destructive text-xs">{socialLinkErrors[i]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit gap-1"
                    onClick={() => {
                      setSocialLinks((prev) => [...prev, '']);
                      setSocialLinkErrors((prev) => [...prev, undefined]);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Add Members</p>
                  <Popover open={memberPopoverOpen} onOpenChange={setMemberPopoverOpen} modal>
                    <PopoverTrigger asChild>
                      <div className="w-full cursor-pointer">
                        <Input
                          placeholder="Search by email or nickname..."
                          value={memberSearch}
                          onChange={(e) => {
                            setMemberSearch(e.target.value);
                            if (!memberPopoverOpen) setMemberPopoverOpen(true);
                          }}
                          onFocus={() => setMemberPopoverOpen(true)}
                          readOnly={false}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-[var(--radix-popover-trigger-width)]"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command shouldFilter={false}>
                        <CommandList>
                          <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                            {usersLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : memberSearch.trim() ? (
                              'No users found.'
                            ) : (
                              'Type to search users.'
                            )}
                          </CommandEmpty>
                          <CommandGroup>
                            {searchResults.map((user) => {
                              const displayName = getUserDisplayName(user.nickname, user.email);
                              return (
                                <CommandItem
                                  key={user.id}
                                  value={user.id ?? ''}
                                  onSelect={() =>
                                    addMember({
                                      id: user.id ?? '',
                                      displayName,
                                      email: user.email ?? null,
                                      profileImage: user.profileImage ?? null,
                                    })
                                  }
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Avatar className="w-7 h-7 shrink-0">
                                    <AvatarImage src={user.profileImage || ''} />
                                    <AvatarFallback className="text-[10px]">
                                      {getInitials(displayName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate">
                                      {displayName}
                                    </span>
                                    {user.email && (
                                      <span className="text-xs text-muted-foreground truncate">
                                        {user.email}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {memberUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {memberUsers.map((user) => (
                        <span
                          key={user.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          <Avatar className="w-4 h-4 shrink-0">
                            <AvatarImage src={user.profileImage || ''} />
                            <AvatarFallback className="text-[8px]">
                              {getInitials(user.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.displayName}</span>
                          <button
                            type="button"
                            onClick={() => removeMember(user.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    *You can also register your BUIDL before inviting team members.
                  </p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  BUIDL Detail <span className="text-red-500">*</span>
                </p>
                <MarkdownEditor
                  isSimple
                  content={buidlDescription}
                  onChange={(val) => setValue('buidlDescription', val)}
                  placeholder="Describe your BUIDL..."
                  contentClassName="min-h-[300px]"
                />
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Tracks <span className="text-red-500">*</span>
                  </p>
                  <MultiSelect
                    options={sponsorOptions}
                    value={sponsorIds}
                    onValueChange={setSponsorIds}
                    placeholder="Select your Tracks"
                    modalPopover
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">GitHub/Gitlab/Bitbucket (optional)</p>
                  <Input
                    placeholder="Enter a social profile URL"
                    {...register('githubLink', {
                      validate: (v) =>
                        !v || isValidUrl(v) || 'Please enter a valid URL (https://...)',
                    })}
                  />
                  {errors.githubLink && (
                    <p className="text-destructive text-xs">{errors.githubLink.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Website</p>
                  <Input
                    placeholder="Enter your Project Website URL"
                    {...register('websiteLink', {
                      validate: (v) =>
                        !v || isValidUrl(v) || 'Please enter a valid URL (https://...)',
                    })}
                  />
                  {errors.websiteLink && (
                    <p className="text-destructive text-xs">{errors.websiteLink.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Video</p>
                  <Input
                    placeholder="Enter your Demo Video URL"
                    {...register('demoVideoLink', {
                      validate: (v) =>
                        !v || isValidUrl(v) || 'Please enter a valid URL (https://...)',
                    })}
                  />
                  {errors.demoVideoLink && (
                    <p className="text-destructive text-xs">{errors.demoVideoLink.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            {step < 2 ? (
              <Button
                type="button"
                variant="purple"
                disabled={!canProceed()}
                onClick={() => setStep((s) => s + 1)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" variant="purple" disabled={!canProceed() || loading}>
                {loading ? 'Submitting...' : 'Submit BUIDL'}
              </Button>
            )}
          </div>
        </form>
      </Container>
    </div>
  );
}

export default HackathonBuidlSubmitPage;
