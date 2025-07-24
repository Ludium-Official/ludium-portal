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
import React from 'react';

function findBreadcrumbTrail(
  items: SidebarItemType[],
  segments: string[],
): SidebarItemType[] | null {
  for (const item of items) {
    if (!item.path && item.children) {
      const childTrail = findBreadcrumbTrail(item.children, segments);
      if (childTrail) return [item, ...childTrail];
      continue;
    }

    if (!item.path) continue;

    const itemSegments = item.path.split('/');

    const match =
      segments.length >= itemSegments.length && itemSegments.every((seg, i) => seg === segments[i]);

    if (match) {
      if (itemSegments.length === segments.length) {
        return [item];
      }

      if (item.children) {
        const childTrail = findBreadcrumbTrail(item.children, segments);
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
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold">
              {segments[0][0].toUpperCase() + segments[0].slice(1)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
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
              <React.Fragment key={item.label}>
                <BreadcrumbItem>{item.label}</BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={fullPath}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>{' '}
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
