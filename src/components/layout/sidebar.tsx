import logo from '@/assets/logo.svg';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { PathLinkProps } from '@/types/pathLink';
import {
  CircleAlert,
  MessageCircle,
  PanelRightClose,
  PanelRightOpen,
  Scroll,
  UserRound,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Button } from '../ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [programMenuOpen, setProgramMenuOpen] = useState(false);

  const urlLinks: PathLinkProps[] = [
    ...(isLoggedIn ? [{ name: 'Profile', path: '/profile', icon: UserRound }] : []),
    {
      name: 'Program',
      path: '/programs',
      icon: Scroll,
      submenu: [{ name: 'Recruitment', path: '/programs' }],
    },
    {
      name: 'Community',
      path: '/community',
      icon: MessageCircle,
    },
    { name: 'Agent', path: '/users', icon: Users },
  ];

  return (
    <aside
      className={cn(
        'h-[calc(100dvh-24px)] bg-white rounded-2xl sticky top-3 transition-all duration-300 z-[100]',
        isCollapsed ? 'w-[72px]' : 'w-[168px]',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between pt-10 mb-16 h-8',
          !isCollapsed && 'mr-4 ml-6',
        )}
      >
        <Link
          to="/"
          className={cn('inline-block transition-opacity', isCollapsed && 'opacity-0 w-0')}
        >
          <img src={logo} alt="LUDIUM" className="h-8" />
        </Link>
        <Button
          onClick={onToggle}
          className={cn(
            'bg-white hover:bg-gray-100 rounded-lg transition-all flex-shrink-0 shadow-none',
            isCollapsed && 'mx-auto',
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelRightClose className="text-black" />
          ) : (
            <PanelRightOpen className="text-black" />
          )}
        </Button>
      </div>
      <nav>
        <ul className="space-y-5 mx-2">
          {urlLinks.map((link) => {
            const isLinkSubMenu = link.submenu?.some((sMenu) =>
              location.pathname.startsWith(sMenu.path),
            );

            return (
              <li key={link.path} className="relative z-50 mb-[8px]">
                {link.submenu ? (
                  <div
                    onMouseEnter={() => setProgramMenuOpen(true)}
                    onMouseLeave={() => setProgramMenuOpen(false)}
                    className="relative"
                  >
                    <div
                      className={`group flex items-center w-full px-4 py-3 rounded-xl transition-colors text-base font-medium text-left ${
                        isLinkSubMenu
                          ? 'bg-[var(--primary-tranparent)] text-primary'
                          : 'hover:bg-[var(--primary-tranparent)] hover:text-primary'
                      } ${isCollapsed ? 'justify-center' : 'gap-2'}`}
                    >
                      <link.icon className="group-active:text-primary group-hover:text-primary flex-shrink-0 w-[20px] h-[20px]" />
                      <span
                        className={cn(
                          'transition-opacity duration-200 whitespace-nowrap',
                          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
                        )}
                      >
                        {link.name}
                      </span>
                    </div>

                    {isCollapsed && programMenuOpen && (
                      <div className="absolute z-50 left-full top-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px]">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                          {link.name}
                        </div>
                        <ul className="space-y-1 px-2 mt-1">
                          {link.submenu.map((sublink) => (
                            <li key={sublink.path}>
                              <NavLink
                                to={sublink.path}
                                className={({ isActive }) =>
                                  cn(
                                    'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                      ? 'bg-[var(--primary-tranparent)] text-primary'
                                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary',
                                  )
                                }
                              >
                                {sublink.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!isCollapsed && (
                      <div className="overflow-hidden transition-all duration-300 ease-in-out">
                        <div
                          className={cn(
                            'relative ml-6',
                            programMenuOpen || isLinkSubMenu ? 'mt-2' : 'h-0',
                          )}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300" />
                          <ul className="space-y-1">
                            {link.submenu.map((sublink, index) => (
                              <li key={sublink.path}>
                                <NavLink
                                  to={sublink.path}
                                  className={({ isActive }) =>
                                    cn(
                                      'block px-4 py-2 rounded-lg transition-all duration-300 ease-in-out text-sm font-normal hover:text-primary',
                                      isActive ? 'text-primary font-medium' : 'text-gray-600',
                                      programMenuOpen || isLinkSubMenu
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 -translate-y-2',
                                    )
                                  }
                                  style={{
                                    transitionDelay:
                                      programMenuOpen || isLinkSubMenu ? `${index * 50}ms` : '0ms',
                                  }}
                                >
                                  {sublink.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 rounded-xl transition-colors text-base font-semibold ${
                        isActive
                          ? 'bg-[var(--primary-tranparent)] text-primary'
                          : 'hover:bg-[var(--primary-tranparent)] hover:text-primary'
                      } ${isCollapsed ? 'justify-center' : 'gap-2'}`
                    }
                  >
                    <link.icon className="group-active:text-primary group-hover:text-primary flex-shrink-0 w-[20px] h-[20px]" />
                    <span
                      className={cn(
                        'transition-opacity duration-200 whitespace-nowrap',
                        isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
                      )}
                    >
                      {link.name}
                    </span>
                  </NavLink>
                )}
              </li>
            );
          })}
          <li>
            <a
              href="https://ludium.oopy.io/"
              className={cn(
                'group flex items-center px-4 py-3 rounded-xl transition-colors text-lg font-medium hover:bg-[var(--primary-tranparent)] hover:text-primary',
                isCollapsed ? 'justify-center' : 'gap-2',
              )}
              target="_blank"
              rel="noreferrer"
            >
              <CircleAlert className="flex-shrink-0 w-[20px] h-[20px]" />
              <span
                className={cn(
                  'transition-opacity duration-200 whitespace-nowrap text-base font-semibold',
                  isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
                )}
              >
                About
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
