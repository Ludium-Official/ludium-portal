import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';

import { useUpdateProfileV2Mutation } from '@/apollo/mutation/update-profile-v2.generated';
import { useProfileV2Query } from '@/apollo/queries/profile-v2.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Badge } from '@/components/ui/badge';
import SocialIcon from '@/components/ui/social-icon';
import notify from '@/lib/notify';
import { filterEmptyLinks, validateLinks } from '@/lib/validation';
import { ChevronRight, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function EditProfilePage() {
  const navigate = useNavigate();

  const { data: profileData, refetch } = useProfileV2Query({
    fetchPolicy: 'network-only',
  });

  const [content, setContent] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  useEffect(() => {
    if (profileData?.profileV2?.bio) {
      setContent(profileData?.profileV2?.bio);
    }
    if (profileData?.profileV2?.profileImage) {
      setImagePreview(profileData?.profileV2?.profileImage);
    }
  }, [profileData]);

  useEffect(() => {
    const links = profileData?.profileV2?.links;
    if (links?.length) {
      setLinks(links?.filter((l) => l));
    }
  }, [profileData]);

  const [links, setLinks] = useState<string[]>(['']);

  const [updateProfile] = useUpdateProfileV2Mutation();

  const { register, handleSubmit, watch, setValue, getValues } = useForm<{
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    roleKeywords: string[];
    skillKeywords: string[];
  }>({
    values: {
      email: profileData?.profileV2?.email ?? '',
      name: profileData?.profileV2?.organizationName ?? '',
      firstName: profileData?.profileV2?.firstName ?? '',
      lastName: profileData?.profileV2?.lastName ?? '',
      roleKeywords: [],
      skillKeywords: profileData?.profileV2?.skills || [],
    },
  });

  // TODO: 이미지 backend에서 처리하는 것 확인
  const [_selectedAvatar, setSelectedAvatar] = useState<File>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [linksError, setLinksError] = useState(false);

  const onSubmit = (data: {
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    roleKeywords: string[];
    skillKeywords: string[];
  }) => {
    const { isValid } = validateLinks(links);
    if (!isValid) {
      setLinksError(true);
      return;
    }

    updateProfile({
      variables: {
        input: {
          email: data.email,
          organizationName: data?.name,
          firstName: data?.firstName,
          lastName: data?.lastName,
          bio: content,
          skills: data.skillKeywords,
          links: (() => {
            const { shouldSend } = validateLinks(links);
            return shouldSend ? filterEmptyLinks(links) : undefined;
          })(),
        },
      },
      onCompleted: () => {
        notify('Profile successfully updated');
        refetch();
        navigate('/my-profile');
      },
      onError: (e) => {
        if (e.message === 'duplicate key value violates unique constraint "users_email_unique"') {
          notify('This email is already taken.', 'error');
        } else {
          notify(e.message, 'error');
        }
      },
    });
  };

  const isNoChanges =
    profileData?.profileV2?.firstName === watch('firstName') &&
    profileData?.profileV2?.lastName === watch('lastName') &&
    profileData?.profileV2?.organizationName === watch('name') &&
    profileData?.profileV2?.email === watch('email') &&
    profileData?.profileV2?.bio === content &&
    JSON.stringify(profileData?.profileV2?.links || []) === JSON.stringify(links) &&
    JSON.stringify(profileData?.profileV2?.skills || []) ===
      JSON.stringify(watch('skillKeywords') || []);

  const [roleKeywordInput, setRoleKeywordInput] = useState<string>('');
  const [skillKeywordInput, setSkillKeywordInput] = useState<string>('');

  // Role keywords handlers
  const handleRoleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleKeywordInput(e.target.value);
  };

  const handleRoleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && roleKeywordInput.trim()) {
      e.preventDefault();
      const newKeyword = roleKeywordInput.trim();
      const currentKeywords = getValues('roleKeywords') || [];
      if (newKeyword && !currentKeywords.includes(newKeyword)) {
        setValue('roleKeywords', [...currentKeywords, newKeyword]);
      }
      setRoleKeywordInput('');
    }
  };

  const removeRoleKeyword = (keywordToRemove: string) => {
    const currentKeywords = getValues('roleKeywords') || [];
    setValue(
      'roleKeywords',
      currentKeywords.filter((keyword) => keyword !== keywordToRemove),
    );
  };

  // Skill keywords handlers
  const handleSkillKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillKeywordInput(e.target.value);
  };

  const handleSkillKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && skillKeywordInput.trim()) {
      e.preventDefault();
      const newKeyword = skillKeywordInput.trim();
      const currentKeywords = getValues('skillKeywords') || [];
      if (newKeyword && !currentKeywords.includes(newKeyword)) {
        setValue('skillKeywords', [...currentKeywords, newKeyword]);
      }
      setSkillKeywordInput('');
    }
  };

  const removeSkillKeyword = (keywordToRemove: string) => {
    const currentKeywords = getValues('skillKeywords') || [];
    setValue(
      'skillKeywords',
      currentKeywords.filter((keyword) => keyword !== keywordToRemove),
    );
  };

  // image input handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setImageError('Only PNG, JPG, or JPEG files are allowed.');
      setSelectedAvatar(undefined);
      setImagePreview(null);
      return;
    }
    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be under 2MB.');
      setSelectedAvatar(undefined);
      setImagePreview(null);
      return;
    }
    // Validate square
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

  return (
    <div className="max-w-[820px] w-full mx-auto">
      <h1 className="font-medium text-xl mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full px-0 mb-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="bg-white py-6 px-10 rounded-lg mb-3">
              <label htmlFor="firstName" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">
                  First name <span className="text-primary">*</span>
                </p>
                <Input
                  {...register('firstName', {
                    required: 'First Name is required.',
                  })}
                  id="firstName"
                  type="text"
                  placeholder="Input text"
                  className="h-10"
                />
              </label>

              <label htmlFor="lastName" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">
                  Last name <span className="text-primary">*</span>
                </p>
                <Input
                  {...register('lastName', {
                    required: 'Last Name is required.',
                  })}
                  id="lastName"
                  type="text"
                  placeholder="Input text"
                  className="h-10"
                />
              </label>

              <label htmlFor="email" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">
                  Email <span className="text-primary">*</span>
                </p>
                <Input
                  {...register('email', {
                    required: 'Email is required.',
                  })}
                  id="email"
                  type="email"
                  placeholder="Input text"
                  className="h-10"
                />
              </label>

              <label htmlFor="name" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">
                  Organization <span className="text-primary">*</span>
                </p>
                <Input
                  {...register('name', {
                    required: 'Organization Name is required.',
                  })}
                  id="name"
                  type="text"
                  placeholder="Input text"
                  className="h-10"
                />
              </label>

              <label htmlFor="roleKeyword" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">
                  Roles <span className="text-primary">*</span>
                </p>
                <div className="space-y-3">
                  <Input
                    id="roleKeyword"
                    type="text"
                    placeholder="Enter directly"
                    value={roleKeywordInput}
                    onChange={handleRoleKeywordInputChange}
                    onKeyDown={handleRoleKeywordInputKeyDown}
                    className="h-10"
                  />
                  {watch('roleKeywords')?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watch('roleKeywords')?.map((keyword: string) => (
                        <Badge
                          key={keyword}
                          className="text-black bg-[#F4F4F5] border-0 px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeRoleKeyword(keyword)}
                            className="ml-1 hover:cursor-pointer rounded-full p-0.5 transition-colors"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="Remove keyword"
                            >
                              <title>Remove keyword</title>
                              <path
                                d="M9 3L3 9M3 3L9 9"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <label htmlFor="skillKeyword" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">Skills</p>
                <div className="space-y-3">
                  <Input
                    id="skillKeyword"
                    type="text"
                    placeholder="Enter directly"
                    value={skillKeywordInput}
                    onChange={handleSkillKeywordInputChange}
                    onKeyDown={handleSkillKeywordInputKeyDown}
                    className="h-10"
                  />
                  {watch('skillKeywords')?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watch('skillKeywords')?.map((keyword: string) => (
                        <Badge
                          key={keyword}
                          className="text-black bg-[#F4F4F5] border-0 px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeSkillKeyword(keyword)}
                            className="ml-1 hover:cursor-pointer rounded-full p-0.5 transition-colors"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="Remove keyword"
                            >
                              <title>Remove keyword</title>
                              <path
                                d="M9 3L3 9M3 3L9 9"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <label htmlFor="image" className="space-y-2 block mb-10">
                <div className="flex items-start gap-6">
                  {/* Image input with preview/placeholder */}
                  <div className="relative w-[200px] h-[200px] flex items-center justify-center bg-[#eaeaea] rounded-lg overflow-hidden group">
                    <input
                      id="picture"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <ImageIcon className="w-10 h-10 text-[#666666] mb-2" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 bg-black/80 rounded-md w-10 h-10 flex justify-center items-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {/* Text info */}
                  <div className="flex-1">
                    <p className="font-medium text-base">
                      Profile image <span className="text-primary">*</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Profile image must be square, under 2MB, and in PNG, JPG, or JPEG format.
                      <br />
                      This image is used as your profile picture
                    </p>
                    {imageError && (
                      <span className="text-destructive text-sm block mt-28">{imageError}</span>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <div className="bg-white px-10 pt-6 pb-[32px] rounded-lg mb-3">
              <label htmlFor="links" className="space-y-2 block">
                <p className="text-sm font-medium">Links</p>
                <span className="block text-[#71717A] text-sm">
                  Add links to your website, blog, or social media profiles.
                </span>

                {links.map((l, idx) => {
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <div key={idx} className="flex items-center gap-2">
                      <div className="bg-[#F4F4F5] rounded-md min-w-10 w-10 h-10 flex items-center justify-center">
                        <SocialIcon value={l} className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <Input
                        className="h-10"
                        value={l}
                        onChange={(e) => {
                          setLinks((prev) => {
                            const newLinks = [...prev];
                            newLinks[idx] = e.target.value;
                            return newLinks;
                          });
                          // Clear error when user starts typing
                          if (linksError) {
                            setLinksError(false);
                          }
                        }}
                      />
                      {idx !== 0 && (
                        <X
                          className="hover:cursor-pointer"
                          onClick={() =>
                            setLinks((prev) => {
                              const newLinks = [
                                ...[...prev].slice(0, idx),
                                ...[...prev].slice(idx + 1),
                              ];

                              return newLinks;
                            })
                          }
                        />
                      )}
                    </div>
                  );
                })}
                <Button
                  onClick={() => setLinks((prev) => [...prev, ''])}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-[6px]"
                >
                  Add URL
                </Button>
                {linksError && (
                  <span className="text-destructive text-sm block">
                    The provided link is not valid. All links must begin with{' '}
                    <span className="font-bold">https://</span>.
                  </span>
                )}
              </label>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="px-10 py-6 bg-white rounded-lg">
              <label htmlFor="bio" className="space-y-2 block">
                <p className="text-sm font-medium">
                  Description <span className="text-primary">*</span>
                </p>
                <MarkdownEditor onChange={setContent} content={content} />
                {!content.length && (
                  <span className="text-red-400 text-sm block">Content is required</span>
                )}
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="py-3 flex justify-end gap-4">
          {selectedTab === 'details' && (
            <Button
              type="submit"
              disabled={isNoChanges}
              className="min-w-[97px] bg-primary hover:bg-primary/90"
              size="lg"
            >
              Save
            </Button>
          )}

          {selectedTab === 'overview' && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => setSelectedTab('details')}
            >
              Next to Details <ChevronRight />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;
