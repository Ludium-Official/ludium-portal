import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

import { useUpdateProfileMutation } from '@/apollo/mutation/updateProfile.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { MarkdownEditor } from '@/components/markdown';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function EditProfilePage() {
  const navigate = useNavigate();

  const { login: authLogin } = useAuth();
  const { user, login: privyLogin } = usePrivy();

  const { data: profileData, refetch } = useProfileQuery({
    fetchPolicy: 'network-only',
  });

  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (profileData?.profile?.about) {
      setContent(profileData?.profile?.about);
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

  const { register, handleSubmit, watch } = useForm<{
    // description: string;
    email: string;
    summary: string;
    name: string;
    firstName: string;
    lastName: string;
  }>({
    values: {
      // description: profileData?.profile?.about ?? '',
      email: profileData?.profile?.email ?? '',
      summary: profileData?.profile?.summary ?? '',
      name: profileData?.profile?.organizationName ?? '',
      firstName: profileData?.profile?.firstName ?? '',
      lastName: profileData?.profile?.lastName ?? '',
    },
  });

  const [selectedAvatar, setSelectedAvatar] = useState<File>();
  const [linksError, setLinksError] = useState(false);

  const onSubmit = (data: {
    summary: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
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
    JSON.stringify(profileData.profile.links?.map((l) => l.url)) === JSON.stringify(links);

  const walletInfo = user?.wallet;

  const login = async () => {
    try {
      const googleInfo = user?.google;
      const farcasterInfo = user?.farcaster;

      const loginType = (() => {
        const types = {
          google: googleInfo,
          farcaster: farcasterInfo,
        };

        return (
          (Object.keys(types) as Array<keyof typeof types>).find((key) => types[key]) || 'wallet'
        );
      })();

      privyLogin({ disableSignup: false });

      if (user && walletInfo) {
        await authLogin({
          email: googleInfo?.email || null,
          walletAddress: walletInfo.address,
          loginType,
        });
      }
    } catch (error) {
      notify('Failed to login', 'error');
      console.error('Failed to login:', error);
    }
  };

  return (
    <div>
      <form className="flex" onSubmit={handleSubmit(onSubmit)}>
        <section className="w-[60%] px-10 py-5">
          <div>
            <p className="font-medium text-sm mb-2">Profile image</p>
            <div className="flex items-end mb-9 gap-12 ">
              <div className="relative">
                <img
                  className="w-[137] h-[137px] object-cover"
                  width={137}
                  height={137}
                  src={
                    selectedAvatar
                      ? URL.createObjectURL(selectedAvatar)
                      : (profileData?.profile?.image ?? avatarPlaceholder)
                  }
                  alt="Avatar"
                />
                <input
                  onChange={(e) => setSelectedAvatar(e.target.files?.[0])}
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  className="hidden"
                  id="image-input"
                />
                <Button
                  type="button"
                  size="sm"
                  className="w-10 h-10 absolute right-0 bottom-0"
                  onClick={() => {
                    document.getElementById('image-input')?.click();
                  }}
                >
                  +
                </Button>
              </div>
            </div>

            <label htmlFor="firstName" className="block text-foreground font-medium mb-2 text-sm">
              First name
            </label>
            <Input
              {...register('firstName', {
                required: 'First Name is required.',
              })}
              id="firstName"
              type="text"
              placeholder="Input text"
              className="mb-5 h-10"
            />

            <label htmlFor="lastName" className="block text-foreground font-medium mb-2 text-sm">
              Last name
            </label>
            <Input
              {...register('lastName', {
                required: 'Last Name is required.',
              })}
              id="lastName"
              type="text"
              placeholder="Input text"
              className="mb-5 h-10"
            />

            <label htmlFor="name" className="block text-foreground font-medium mb-2 text-sm">
              Organization
            </label>
            <Input
              {...register('name', {
                required: 'Organization Name is required.',
              })}
              id="name"
              type="text"
              placeholder="Input text"
              className="mb-5 h-10"
            />

            <label htmlFor="email" className="block text-foreground font-medium mb-2 text-sm">
              Email
            </label>
            <Input
              {...register('email', {
                required: 'Organization Name is required.',
              })}
              id="email"
              type="email"
              placeholder="Input text"
              className="mb-5 h-10"
            />

            <label htmlFor="summary" className="block text-foreground font-medium mb-2 text-sm">
              Summary
            </label>
            <Input
              {...register('summary', {
                required: 'Summary is required.',
              })}
              id="name"
              type="text"
              placeholder="Input text"
              className="mb-5 h-10"
            />

            <label htmlFor="description" className="block text-foreground font-medium mb-2 text-sm">
              Description
            </label>

            <MarkdownEditor onChange={setContent} content={content} />

            {!content.length && (
              <span className="text-red-400 text-sm block">Content is required</span>
            )}
            {/* <Textarea
              {...register('description')}
              id="description"
              placeholder="Input text"
              className="mb-5 h-10"
            /> */}

            <label
              htmlFor="description"
              className="block text-foreground font-medium mb-2 text-sm mt-5"
            >
              Wallet
            </label>
            <div className="p-6 mb-10 border bg-muted w-[282px] h-[156px] rounded-lg shadow-sm relative">
              <label
                htmlFor="description"
                className="block text-foreground font-medium mb-2 text-sm"
              >
                My Wallet
              </label>
              <span className="block text-sm text-[#71717A] mb-5">
                {user ? 'Your wallet is connected' : 'Connect your wallet'}
              </span>

              <Button
                onClick={login}
                disabled={user !== null}
                variant="purple"
                className="h-9 w-[133px] absolute bottom-6 right-6 text-xs"
              >
                Connect wallet <Wallet />
              </Button>
            </div>

            <label htmlFor="links" className="space-y-2 block mb-10">
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

            <Button disabled={isNoChanges} className="w-[153px] h-[44px] ml-auto block mb-[83px]">
              Save Changes
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}

export default EditProfilePage;
