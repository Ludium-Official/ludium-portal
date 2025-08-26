import logo from '@/assets/logo.svg';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  CircleAlert,
  type LucideIcon,
  MessageCircle,
  Scroll,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

type SidebarLink = {
  name: string;
  path: string;
  icon: LucideIcon;
  submenu?: {
    name: string;
    path: string;
    icon: LucideIcon;
  }[];
};

const Sidebar = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  const [programMenuOpen, setProgramMenuOpen] = useState(false);
  const links: SidebarLink[] = [
    {
      name: 'Program',
      path: '/programs',
      icon: Scroll,
      submenu: [
        { name: 'Recruitment', path: '/programs', icon: Scroll },
        { name: 'Investment', path: '/investments', icon: Scroll },
      ],
    },
    {
      name: 'Community',
      path: '/community',
      icon: MessageCircle,
    },
    { name: 'Agent', path: '/users', icon: Users },
  ];

  if (isLoggedIn) {
    links.unshift({ name: 'Profile', path: '/profile', icon: UserRound });
  }

  return (
    <aside className="fixed z-[2] left-0 w-[216px] h-[calc(100dvh-24px)] mx-3 mb-3 bg-white rounded-2xl">
      <Link to="/" className="mt-6 mx-6 mb-[44px] inline-block">
        <img src={logo} alt="LUDIUM" />
      </Link>
      <nav>
        <ul className="space-y-5 mx-2">
          {links.map((link) => (
            <li key={link.path} className="relative z-50">
              {link.submenu ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setProgramMenuOpen(!programMenuOpen)}
                    className={`group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium w-full text-left ${location.pathname.startsWith('/programs') ||
                      location.pathname.startsWith('/investments')
                      ? 'bg-[#B331FF0A] text-primary'
                      : 'hover:bg-[#B331FF0A] hover:text-primary'
                      }`}
                  >
                    <link.icon className="group-active:text-primary group-hover:text-primary" />
                    {link.name}
                  </button>
                  <div className="overflow-hidden transition-all duration-300 ease-in-out">
                    <div className={cn('relative ml-6', programMenuOpen ? 'h-20 mt-2' : 'h-0')}>
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300" />
                      <ul className="space-y-1">
                        {link.submenu.map((sublink, index) => (
                          <li key={sublink.path}>
                            <NavLink
                              to={sublink.path}
                              className={({ isActive }) =>
                                cn(
                                  'block px-4 py-2 rounded-lg transition-all duration-300 ease-in-out text-[16px] font-normal hover:text-primary',
                                  isActive ? 'text-primary font-medium' : 'text-gray-600',
                                  programMenuOpen
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 -translate-y-2',
                                )
                              }
                              style={{
                                transitionDelay: programMenuOpen ? `${index * 50}ms` : '0ms',
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
                    `group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium ${isActive
                      ? 'bg-[#B331FF0A] text-primary'
                      : 'hover:bg-[#B331FF0A] hover:text-primary'
                    }`
                  }
                >
                  <link.icon className="group-active:text-primary group-hover:text-primary" />
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
          <li>
            <a
              href="https://ludium.oopy.io/"
              className="group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium hover:bg-[#B331FF0A] hover:text-primary"
              target="_blank"
              rel="noreferrer"
            >
              <CircleAlert />
              About
            </a>
          </li>
          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                className="group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium hover:bg-[#B331FF0A] hover:text-primary"
              >
                <ShieldCheck />
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
