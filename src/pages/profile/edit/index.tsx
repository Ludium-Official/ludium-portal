import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';

import { useUpdateProfileMutation } from '@/apollo/mutation/updateProfile.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Badge } from '@/components/ui/badge';
import notify from '@/lib/notify';
import { ChevronRight, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function EditProfilePage() {
  const navigate = useNavigate();

  const { data: profileData, refetch } = useProfileQuery({
    fetchPolicy: 'network-only',
  });

  const [content, setContent] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  useEffect(() => {
    if (profileData?.profile?.about) {
      setContent(profileData?.profile?.about);
    }
    if (profileData?.profile?.image) {
      setImagePreview(profileData?.profile?.image);
    }
  }, [profileData]);

  useEffect(() => {
    const links = profileData?.profile?.links;
    if (links?.length) {
      setLinks(links?.filter((l) => l)?.map((l) => l.url ?? ''));
    }
  }, [profileData]);

  const [links, setLinks] = useState<string[]>(['']);

  const [updateProfile] = useUpdateProfileMutation();

  const { register, handleSubmit, watch, setValue, getValues } = useForm<{
    email: string;
    summary: string;
    name: string;
    firstName: string;
    lastName: string;
    keywords: string[];
  }>({
    values: {
      email: profileData?.profile?.email ?? '',
      summary: profileData?.profile?.summary ?? '',
      name: profileData?.profile?.organizationName ?? '',
      firstName: profileData?.profile?.firstName ?? '',
      lastName: profileData?.profile?.lastName ?? '',
      keywords: profileData?.profile?.keywords?.map((k) => k.name || '') || [],
    },
  });

  const [selectedAvatar, setSelectedAvatar] = useState<File>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [linksError, setLinksError] = useState(false);

  const onSubmit = (data: {
    summary: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    keywords: string[];
  }) => {
    if (links?.some((l) => !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(l))) {
      setLinksError(true);
      return;
    }

    updateProfile({
      variables: {
        input: {
          id: profileData?.profile?.id ?? '',
          image: selectedAvatar,
          email: data.email,
          organizationName: data?.name,
          summary: data?.summary,
          firstName: data?.firstName,
          lastName: data?.lastName,
          about: content,
          keywords: data.keywords,
          links: links?.filter((l) => l)?.length
            ? links?.filter((l) => l).map((l) => ({ title: l, url: l }))
            : undefined,
        },
      },
      onCompleted: () => {
        notify('Profile successfully updated');
        refetch();
        navigate('/profile');
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
    profileData?.profile?.summary === watch('summary') &&
    profileData?.profile?.firstName === watch('firstName') &&
    profileData?.profile?.lastName === watch('lastName') &&
    profileData?.profile?.organizationName === watch('name') &&
    profileData?.profile?.email === watch('email') &&
    profileData?.profile?.about === content &&
    JSON.stringify(profileData.profile.links?.map((l) => l.url)) === JSON.stringify(links) &&
    JSON.stringify(profileData.profile.keywords?.map((k) => k.name || '') || []) ===
      JSON.stringify(watch('keywords') || []);

  const [keywordInput, setKeywordInput] = useState<string>('');

  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && keywordInput.trim()) {
      e.preventDefault();
      const newKeyword = keywordInput.trim();
      const currentKeywords = getValues('keywords') || [];
      if (newKeyword && !currentKeywords.includes(newKeyword)) {
        setValue('keywords', [...currentKeywords, newKeyword]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = getValues('keywords') || [];
    setValue(
      'keywords',
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

              <label htmlFor="keyword" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">
                  Roles <span className="text-primary">*</span>
                </p>
                <div className="space-y-3">
                  <Input
                    id="keyword"
                    type="text"
                    placeholder="Enter directly"
                    value={keywordInput}
                    onChange={handleKeywordInputChange}
                    onKeyDown={handleKeywordInputKeyDown}
                    className="h-10"
                  />
                  {watch('keywords')?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watch('keywords')?.map((keyword: string) => (
                        <Badge
                          key={keyword}
                          className="text-black bg-[#F4F4F5] border-0 px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
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

                {links.map((l, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      className="h-10 max-w-[555px]"
                      value={l}
                      onChange={(e) => {
                        setLinks((prev) => {
                          const newLinks = [...prev];
                          newLinks[idx] = e.target.value;
                          return newLinks;
                        });
                      }}
                    />
                    {idx !== 0 && (
                      <X
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
                ))}
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
                  <span className="text-red-400 text-sm block">
                    The provided link is not valid. All links must begin with{' '}
                    <span className="font-bold">https://</span>.
                  </span>
                )}
              </label>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="bg-white px-10 py-6 rounded-lg mb-3">
              <label htmlFor="summary" className="space-y-2 block">
                <p className="text-sm font-medium">
                  Summary <span className="text-primary">*</span>
                </p>
                <Input
                  {...register('summary', {
                    required: 'Summary is required.',
                  })}
                  id="summary"
                  type="text"
                  placeholder="Input text"
                  className="h-10"
                />
              </label>
            </div>

            <div className="px-10 py-6 bg-white rounded-lg">
              <label htmlFor="description" className="space-y-2 block">
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
