import { useUserQuery } from '@/apollo/queries/user.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Share2Icon } from 'lucide-react';
import { Outlet, useParams } from 'react-router';
import { SidebarLinks, sidebarLinks } from '../_components/sidebar-links';
import { platformIcons } from '../agent-utils';

function UserDetailsPage() {
  const { id } = useParams();

  const { data: userData } = useUserQuery({
    variables: {
      id: id ?? '',
    },
  });

  return (
    <div className="flex p-10 gap-6 bg-white">
      <section className="max-w-[360px] flex flex-col gap-5">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-[22px]">
            <div className="p-[7.5px]">
              <img
                src={userData?.user?.image ?? avatarPlaceholder}
                alt="avatar"
                className="w-[121px] h-[121px] rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="space-y-0.5">
                <p className="font-bold text-xl text-gray-dark">
                  {userData?.user?.firstName} {userData?.user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{userData?.user?.email}</p>
              </div>
              <p className="text-sm text-muted-foreground">{userData?.user?.organizationName}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-sm text-muted-foreground">SUMMARY</p>
            <p className="text-sm text-slate-600 line-clamp-4 font-inter">
              {userData?.user?.summary}
            </p>
          </div>
          <Button variant={'outline'} className="h-11">
            <p className="font-medium text-sm text-gray-dark">Share</p>
            <Share2Icon />
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 px-6">
          {sidebarLinks.map((item) => (
            <SidebarLinks key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="font-bold text-sm text-muted-foreground">ROLES</p>
            <div className="flex gap-[6px]">
              <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                Crypto
              </Badge>
              <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                BD
              </Badge>
              <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                Develope
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-sm text-muted-foreground">SKILLS</p>
            <div className="flex gap-[6px]">
              <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                Crypto
              </Badge>
              <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                BD
              </Badge>
              <Badge className="bg-zinc-100 text-gray-dark px-2.5 py-0.5 font-semibold text-xs">
                Develope
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-bold text-sm text-muted-foreground">CONTACT</p>
            <div className="space-y-2">
              <div className="space-y-2">
                {userData?.user?.links?.length ? (
                  userData.user.links.map((link, index) => {
                    const url = link.url?.toLowerCase() || '';
                    const matchedKey = Object.keys(platformIcons).find((key) => url.includes(key));
                    const platform = matchedKey ? platformIcons[matchedKey] : null;

                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <div key={index} className="flex items-center gap-2">
                        {platform && (
                          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-secondary">
                            <img src={platform.icon} width={16} height={16} alt={platform.alt} />
                          </div>
                        )}
                        <a
                          target="_blank"
                          href={link.url || '#'}
                          className="text-sm text-slate-600 break-all"
                          rel="noreferrer"
                        >
                          {link.url || 'No link'}
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No links available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex-1 space-y-1">
        <Outlet />
      </section>
    </div>
  );
}

export default UserDetailsPage;
