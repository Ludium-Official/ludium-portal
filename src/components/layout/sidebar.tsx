import logo from '@/assets/logo.svg';
import { useAuth } from '@/lib/hooks/use-auth';
import { CircleAlert, Scroll, UserRound, Users } from 'lucide-react';

import { Link, NavLink } from 'react-router';

const Sidebar = () => {
  const { isAuthed } = useAuth();
  const links = [
    { name: 'Programs', path: '/programs', icon: Scroll },
    { name: 'Community', path: '/community', icon: Users },
  ];

  if (isAuthed) {
    links.unshift({ name: 'Profile', path: '/profile', icon: UserRound });
  }

  return (
    <aside className="fixed left-0 w-[216px] h-[calc(100dvh-24px)] mx-3 mb-3 bg-white rounded-2xl">
      <Link to="/" className="mt-6 mx-6 mb-[44px] inline-block">
        <img src={logo} alt="LUDIUM" />
      </Link>
      <nav>
        <ul className="space-y-5 mx-2">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium ${
                    isActive
                      ? 'bg-[#F8ECFF] text-[#861CC4]'
                      : 'hover:bg-[#F8ECFF] hover:text-[#861CC4]'
                  }`
                }
              >
                <link.icon className="group-active:text-[#861CC4] group-hover:text-[#861CC4]" />{' '}
                {link.name}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href="https://ludium.oopy.io/"
              className="group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium hover:bg-[#F8ECFF] hover:text-[#861CC4]"
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
