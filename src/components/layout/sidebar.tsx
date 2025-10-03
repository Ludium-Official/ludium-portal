import logo from '@/assets/logo.svg';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { PathLinkProps } from '@/types/pathLink';
import { CircleAlert, MessageCircle, Scroll, UserRound, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

const Sidebar = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [programMenuOpen, setProgramMenuOpen] = useState(false);

  const urlLinks: PathLinkProps[] = [
    ...(isLoggedIn ? [{ name: 'Profile', path: '/my-profile', icon: UserRound }] : []),
    {
      name: 'Program',
      path: '/programs',
      icon: Scroll,
      submenu: [
        { name: 'Recruitment', path: '/programs' },
        { name: 'Funding', path: '/investments' },
      ],
    },
    {
      name: 'Community',
      path: '/community',
      icon: MessageCircle,
    },
    { name: 'Agent', path: '/users', icon: Users },
  ];

  return (
    <aside className="fixed z-[2] left-0 w-[216px] h-[calc(100dvh-24px)] mx-3 mb-3 bg-white rounded-2xl">
      <Link to="/" className="mt-6 mx-6 mb-[44px] inline-block">
        <img src={logo} alt="LUDIUM" />
      </Link>
      <nav>
        <ul className="space-y-5 mx-2">
          {urlLinks.map((link) => {
            const isLinkSubMenu = link.submenu?.some((sMenu) =>
              location.pathname.startsWith(sMenu.path),
            );

            return (
              <li key={link.path} className="relative z-50">
                {link.submenu ? (
                  <div
                    onMouseEnter={() => setProgramMenuOpen(true)}
                    onMouseLeave={() => setProgramMenuOpen(false)}
                  >
                    <div
                      className={`group flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all text-lg font-medium text-left ${
                        isLinkSubMenu
                          ? 'bg-[var(--primary-tranparent)] text-primary'
                          : 'hover:bg-[var(--primary-tranparent)] hover:text-primary'
                      }`}
                    >
                      <link.icon className="group-active:text-primary group-hover:text-primary" />
                      {link.name}
                    </div>
                    <div className="overflow-hidden transition-all duration-300 ease-in-out">
                      <div
                        className={cn(
                          'relative ml-6',
                          programMenuOpen || isLinkSubMenu ? 'h-20 mt-2' : 'h-0',
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
                                    'block px-4 py-2 rounded-lg transition-all duration-300 ease-in-out text-base font-normal hover:text-primary',
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
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `group flex gap-4 items-center px-4 py-3 rounded-xl transition-all text-lg font-medium ${
                        isActive
                          ? 'bg-[var(--primary-tranparent)] text-primary'
                          : 'hover:bg-[var(--primary-tranparent)] hover:text-primary'
                      }`
                    }
                  >
                    <link.icon className="group-active:text-primary group-hover:text-primary" />
                    {link.name}
                  </NavLink>
                )}
              </li>
            );
          })}
          <li>
            <a
              href="https://ludium.oopy.io/"
              className="group flex gap-4 items-center px-4 py-3 rounded-xl transition-all text-lg font-medium hover:bg-[var(--primary-tranparent)] hover:text-primary"
              target="_blank"
              rel="noreferrer"
            >
              <CircleAlert />
              About
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
