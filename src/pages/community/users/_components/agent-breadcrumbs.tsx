import { useLocation, useParams } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { type SidebarItemType, sidebarLinks } from './sidebar-links';

function findBreadcrumbTrail(
  items: SidebarItemType[],
  segments: string[],
): SidebarItemType[] | null {
  for (const item of items) {
    if (!item.path) {
      if (item.children) {
        const childTrail = findBreadcrumbTrail(item.children, segments);
        if (childTrail) {
          return [item, ...childTrail];
        }
      }
      continue;
    }

    const itemSegments = item.path.split('/');

    const match =
      segments.length >= itemSegments.length && itemSegments.every((seg, i) => seg === segments[i]);

    if (match) {
      if (itemSegments.length === segments.length) {
        return [item];
      }
      if (item.children) {
        const childTrail = findBreadcrumbTrail(item.children, segments.slice(itemSegments.length));
        if (childTrail) {
          return [item, ...childTrail];
        }
      }

      return [item];
    }
  }
  return null;
}

export function AgentBreadcrumbs() {
  const { id } = useParams();
  const location = useLocation();

  const prefix = `/users/${id}/`;
  const relativePath = location.pathname.startsWith(prefix)
    ? location.pathname.slice(prefix.length)
    : '';

  const segments = relativePath.split('/').filter(Boolean);

  if (segments.length === 1 && ['overview', 'description', 'community'].includes(segments[0])) {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-semibold">
            {segments[0][0].toUpperCase() + segments[0].slice(1)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }

  const trail = findBreadcrumbTrail(sidebarLinks, segments);

  if (!trail) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((item, idx) => {
          const isLast = idx === trail.length - 1;
          const fullPath = `/users/${id}/${item.path}`;

          if (!item.path) {
            return (
              <BreadcrumbItem key={item.label}>
                {item.label}
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            );
          }
          return (
            <BreadcrumbItem key={item.label}>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={fullPath}>{item.label}</BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
