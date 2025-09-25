import { Link, useLocation, useParams } from 'react-router';

export const sidebarLinks = [
  { label: 'Overview', path: 'overview' },
  { label: 'Description', path: 'description' },
  {
    label: 'Program',
    children: [
      {
        label: 'Recruitment',
        path: 'program/recruitment',
        children: [
          { label: 'Sponsor', path: 'program/recruitment/sponsor' },
          { label: 'Validator', path: 'program/recruitment/validator' },
          { label: 'Builder', path: 'program/recruitment/builder' },
          { label: 'Reclaim', path: 'program/recruitment/reclaim' },
        ],
      },
      {
        label: 'Funding',
        path: 'program/investment',
        children: [
          { label: 'Host', path: 'program/investment/host' },
          { label: 'Project', path: 'program/investment/project' },
          { label: 'Supporter', path: 'program/investment/supporter' },
          { label: 'Reclaim', path: 'program/investment/reclaim' },
        ],
      },
    ],
  },
  { label: 'Community', path: 'community' },
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

  const fullPath = myProfile
    ? `/my-profile/${item.path}`
    : item.path
      ? `/users/${id}/${item.path}`
      : '';

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
        <div className={`ml-4 pl-2 ${item.path && 'border-l'} border-gray-200 space-y-1`}>
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
