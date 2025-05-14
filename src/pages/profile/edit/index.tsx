import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

import { useUpdateProfileMutation } from '@/apollo/mutation/updateProfile.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { wepinSdk } from '@/lib/wepin';
import type { WepinLifeCycle } from '@wepin/sdk-js';
import { Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function EditProfilePage() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [wepinStatus, setWepinStatus] = useState<WepinLifeCycle>();

  useEffect(() => {
    const checkWepinStatus = async () => {
      const status = await wepinSdk.getStatus();
      setWepinStatus(status);
    };

    checkWepinStatus();
    setInterval(checkWepinStatus, 5000);
  }, []);

  const { data: profileData, refetch } = useProfileQuery({
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const links = profileData?.profile?.links;
    if (links?.length) {
      setLinks(links?.filter((l) => l)?.map((l) => l.url ?? ''));
    }
  }, [profileData]);

  const [links, setLinks] = useState<string[]>(['']);

  const [updateProfile] = useUpdateProfileMutation();

  const { register, handleSubmit, watch } = useForm<{ description: string; name: string }>({
    values: {
      description: profileData?.profile?.about ?? '',
      name: profileData?.profile?.organizationName ?? '',
    },
  });

  const [selectedAvatar, setSelectedAvatar] = useState<File>();

  const onSubmit = (data: { description: string; name: string }) => {
    updateProfile({
      variables: {
        input: {
          id: profileData?.profile?.id ?? '',
          image: selectedAvatar,
          organizationName: data?.name,
          about: data?.description,
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
    });
  };

  const isNoChanges =
    profileData?.profile?.organizationName === watch('name') &&
    profileData?.profile?.about === watch('description') &&
    JSON.stringify(profileData.profile.links?.map((l) => l.url)) === JSON.stringify(links);

  return (
    <div>
      <form className="flex" onSubmit={handleSubmit(onSubmit)}>
        <section className="w-[60%] px-10 py-5">
          <div>
            <p className="font-medium text-sm mb-2">Profile image</p>
            <span className="block text-sm text-[#71717A] mb-2">This is an input description</span>
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

            <label htmlFor="name" className="block text-foreground font-medium mb-2 text-sm">
              Organization / Person name
            </label>
            <Input
              {...register('name', { required: 'Organization Name is required.' })}
              id="name"
              type="text"
              placeholder="Input text"
              className="mb-2 h-10"
            />
            <span className="block text-sm text-[#71717A] mb-10">This is an input description</span>

            <label htmlFor="description" className="block text-foreground font-medium mb-2 text-sm">
              Description
            </label>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Input text"
              className="mb-2 h-10"
            />
            <span className="block text-sm text-[#71717A] mb-10">This is an input description</span>

            <label htmlFor="description" className="block text-foreground font-medium mb-2 text-sm">
              Wallet
            </label>
            <span className="block text-sm text-[#71717A] mb-5">This is an input description</span>
            <div className="p-6 mb-10 border bg-muted w-[282px] h-[156px] rounded-lg shadow-sm relative">
              <label
                htmlFor="description"
                className="block text-foreground font-medium mb-2 text-sm"
              >
                My Wallet
              </label>
              <span className="block text-sm text-[#71717A] mb-5">
                {wepinStatus === 'login' ? 'Your wallet is connected' : 'Connect your wallet'}
              </span>

              <Button
                onClick={async () => {
                  const user = await wepinSdk.loginWithUI();

                  if (user.status === 'success') {
                    const accounts = await wepinSdk.getAccounts();

                    await login({
                      email: user.userInfo?.email ?? '',
                      userId: user.userInfo?.userId ?? '',
                      walletId: user.walletId ?? '',
                      address: accounts?.[0]?.address ?? '',
                      network: accounts?.[0]?.network ?? '',
                    });

                    notify('Successfully logged in', 'success');
                    navigate('/profile');
                  }
                }}
                disabled={wepinStatus === 'login'}
                className="bg-[#B331FF] hover:bg-[#B331FF]/90 h-9 w-[133px] absolute bottom-6 right-6 text-xs"
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
