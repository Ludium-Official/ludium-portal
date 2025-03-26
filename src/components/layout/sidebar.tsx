// import about from "@/assets/icons/about.svg";
// import book from "@/assets/icons/book.svg";
// import notification from "@/assets/icons/notification-bold.svg";
// import pencil from "@/assets/icons/pencil.svg";
// import profile from "@/assets/icons/profile-bold.svg";
// import wallet from "@/assets/icons/wallet.svg";
import logo from '@/assets/logo.svg';
import { Scroll, UserRound } from "lucide-react";

import { Link, NavLink } from "react-router";

const Sidebar = () => {
  const links = [
    { name: "Profile", path: "/profile", icon: UserRound },
    // { name: "NOTIFICATIONS", path: "/notifications", icon: notification },
    { name: "Programs", path: "/programs", icon: Scroll },
    // { name: "USERS", path: "/users", icon: wallet },
    // { name: "Community", path: "/", icon: Landmark },
    // { name: "About", path: "/", icon: Info },
  ];

  return (
    <aside className="fixed left-0 w-[216px] h-[calc(100dvh-24px)] mx-3 mb-3 bg-white rounded-2xl">
      <Link to="/" className="mt-6 mx-6 mb-[44px] inline-block"><img src={logo} alt='LUDIUM' /></Link>
      <nav>
        <ul className="space-y-5 mx-2">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `group flex gap-4 items-center px-4 py-[14px] rounded-xl transition-all text-[18px] font-medium ${isActive
                    ? "bg-[#F8ECFF] text-[#861CC4]"
                    : "hover:bg-[#F8ECFF] hover:text-[#861CC4]"
                  }`
                }
              >
                <link.icon className='group-active:text-[#861CC4] group-hover:text-[#861CC4]' /> {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;