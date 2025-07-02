import logo from '@/assets/logo.svg';
import { useAuth } from '@/lib/hooks/use-auth';
import { CircleAlert, MessageCircle, Scroll, ShieldCheck, UserRound, Users } from 'lucide-react';
import { Link, NavLink } from 'react-router';

const Sidebar = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  const links = [
    { name: 'Programs', path: '/programs', icon: Scroll },
    {
      name: 'Community',
      path: '/community',
      icon: MessageCircle,
    },
    { name: 'Users', path: '/users', icon: Users },
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
            <li
              key={link.path}
              className="relative z-50"
              onMouseEnter={() => {
                if (link.submenu) {
                  if (closeTimeout.current) clearTimeout(closeTimeout.current);
                  setCommunityMenuOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (link.submenu) {
                  closeTimeout.current = setTimeout(() => {
                    setCommunityMenuOpen(false);
                  }, 120); // 120ms delay
                }
              }}
            >
              {link.submenu ? (
                <>
                  <p
                    // to={link.path}
                    className={`group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium cursor-default ${location.pathname.startsWith('/community') ||
                      location.pathname.startsWith('/users')
                      ? 'bg-primary-light text-primary'
                      : 'hover:bg-primary-light hover:text-primary'
                      }`}
                  >
                    <link.icon className="group-active:text-primary group-hover:text-primary" />
                    {link.name}
                  </p>
                  {communityMenuOpen && (
                    <ul className="absolute z-50 left-full -top-1/2 ml-2 w-48 bg-white rounded-xl shadow-lg p-3 space-y-2">
                      {link.submenu.map((sublink) => (
                        <li key={sublink.path}>
                          <NavLink
                            to={sublink.path}
                            className={
                              'flex gap-3 items-center px-4 py-3 rounded-lg transition-all text-[16px] font-medium hover:bg-primary-light hover:text-primary'
                            }
                          >
                            <sublink.icon className="group-active:text-primary group-hover:text-primary" />
                            {sublink.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium ${isActive
                      ? 'bg-primary-light text-primary'
                      : 'hover:bg-primary-light hover:text-primary'
                  }`
                }
              >
                <link.icon className="group-active:text-primary group-hover:text-primary" />
                {link.name}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href="https://ludium.oopy.io/"
              className="group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium hover:bg-primary-light hover:text-primary"
              target="_blank"
              rel="noreferrer"
            >
              <CircleAlert />
              About
            </a>
          </li>
          {isAdmin && (
            <li>
              <NavLink to="/admin" className="group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium hover:bg-primary-light hover:text-primary">
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
