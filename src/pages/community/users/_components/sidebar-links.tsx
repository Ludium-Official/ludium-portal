import { Link, useLocation, useParams } from 'react-router';

export const sidebarLinks = [
  { label: 'Overview', path: 'profile' },
  { label: 'Description', path: 'profile/description' },
  {
    label: 'Program',
    children: [
      {
        label: 'Recruitment',
        children: [
          { label: 'Sponsor', path: 'dashboard/recruitment/sponsor' },
          { label: 'Builder', path: 'dashboard/recruitment/builder' },
        ],
      },
    ],
  },
  { label: 'Community', path: 'profile/community' },
];

export type SidebarItemType = {
  label: string;
  path?: string;
  children?: SidebarItemType[];
};

export function SidebarLinks({
  item,
  myProfile,
}: {
  item: SidebarItemType;
  myProfile?: boolean;
}) {
  const { id } = useParams();
  const location = useLocation();

  const fullPath = myProfile ? `/${item.path}` : item.path ? `/users/${id}/${item.path}` : '';

  const isActive = location.pathname === fullPath;

  return (
    <div>
      {item.path ? (
        <Link
          to={fullPath}
          className={`px-2 h-8 flex items-center text-sm ${
            isActive
              ? 'font-medium text-gray-dark bg-sidebar-accent rounded-md'
              : 'text-gray-asphalt font-normal'
          }`}
        >
          {item.label}
        </Link>
      ) : (
        <div className="text-sm px-2 h-8 flex items-center text-gray-dark select-none">
          {item.label}
        </div>
      )}
      {item.children && (
        <div className={`ml-4 pl-2 border-l border-gray-200 space-y-1`}>
          {item.children
            .filter((child) => myProfile || child.label !== 'Reclaim')
            .map((child) => (
              <SidebarLinks key={child.label} item={child} myProfile={myProfile} />
            ))}
        </div>
      )}
    </div>
  );
}
