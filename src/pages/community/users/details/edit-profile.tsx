import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';

import { useUpdateUserV2Mutation } from '@/apollo/mutation/update-user-v2.generated';
import { useProfileV2Query } from '@/apollo/queries/profile-v2.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Badge } from '@/components/ui/badge';
import notify from '@/lib/notify';
import { ChevronRight, Image as ImageIcon, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function EditProfilePage() {
  const navigate = useNavigate();

  const { data: profileData, refetch } = useProfileV2Query({
    fetchPolicy: 'network-only',
  });

  const [about, setAbout] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  useEffect(() => {
    if (profileData?.profileV2?.about) {
      setAbout(profileData?.profileV2?.about);
    }
    if (profileData?.profileV2?.profileImage) {
      setImagePreview(profileData?.profileV2?.profileImage);
    }
  }, [profileData]);

  const [updateUser] = useUpdateUserV2Mutation();

  const { register, handleSubmit, watch, setValue, getValues } = useForm<{
    email: string;
    nickname: string;
    userRole: string;
    location: string;
    skillKeywords: string[];
  }>({
    values: {
      email: profileData?.profileV2?.email ?? '',
      nickname: profileData?.profileV2?.nickname ?? '',
      userRole: profileData?.profileV2?.userRole ?? '',
      location: profileData?.profileV2?.location ?? '',
      skillKeywords: profileData?.profileV2?.skills || [],
    },
  });

  const [selectedAvatar, setSelectedAvatar] = useState<File>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = async (data: {
    email: string;
    nickname: string;
    userRole: string;
    location: string;
    skillKeywords: string[];
  }) => {
    if (!profileData?.profileV2?.id) {
      notify('Profile not found', 'error');
      return;
    }

    let profileImageUrl = profileData?.profileV2?.profileImage;

    // TODO: Implement file upload logic if needed
    if (selectedAvatar) {
      notify('Image upload not yet implemented', 'error');
      return;
    }

    updateUser({
      variables: {
        input: {
          id: profileData.profileV2.id,
          email: data.email,
          nickname: data.nickname,
          userRole: data.userRole || undefined,
          location: data.location || undefined,
          skills: data.skillKeywords,
          about: about || undefined,
          profileImage: profileImageUrl,
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
    profileData?.profileV2?.nickname === watch('nickname') &&
    profileData?.profileV2?.email === watch('email') &&
    profileData?.profileV2?.userRole === watch('userRole') &&
    profileData?.profileV2?.location === watch('location') &&
    profileData?.profileV2?.about === about &&
    JSON.stringify(profileData?.profileV2?.skills || []) ===
      JSON.stringify(watch('skillKeywords') || []);

  const [skillKeywordInput, setSkillKeywordInput] = useState<string>('');

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
      setSelectedAvatar(file);
      setImagePreview(URL.createObjectURL(file));
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
              <label htmlFor="nickname" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">
                  Nickname <span className="text-primary">*</span>
                </p>
                <Input
                  {...register('nickname', {
                    required: 'Nickname is required.',
                  })}
                  id="nickname"
                  type="text"
                  placeholder="Enter your nickname"
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
                  placeholder="Enter your email"
                  className="h-10"
                />
              </label>

              <label htmlFor="userRole" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">Professional Role</p>
                <Input
                  {...register('userRole')}
                  id="userRole"
                  type="text"
                  placeholder="e.g., Web Developer, Designer"
                  className="h-10"
                />
              </label>

              <label htmlFor="location" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">Location / Timezone</p>
                <Input
                  {...register('location')}
                  id="location"
                  type="text"
                  placeholder="e.g., (GMT+09:00) Korea Standard Time - Seoul"
                  className="h-10"
                />
              </label>

              <label htmlFor="skillKeyword" className="space-y-2 block mb-10">
                <p className="text-sm font-medium">Skills</p>
                <div className="space-y-3">
                  <Input
                    id="skillKeyword"
                    type="text"
                    placeholder="Enter directly (press space or enter to add)"
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
          </TabsContent>

          <TabsContent value="details">
            <div className="px-10 py-6 bg-white rounded-lg">
              <label htmlFor="about" className="space-y-2 block">
                <p className="text-sm font-medium">About</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Tell others about yourself (max 1000 characters)
                </p>
                <MarkdownEditor onChange={setAbout} content={about} />
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
