import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/home" || location.pathname === "/";
  const isPlaygroundPage = location.pathname === "/playground";
  const isDocsPage = location.pathname === "/documentation";

  return (
    <nav
      className={`${isHomePage ? "fixed left-0 right-0 top-0 z-50" : ""} mix-blend-difference`}
    >
      <div className={`${isHomePage ? "mx-4 my-6" : "px-4 py-6"}`}>
        <ul className="flex w-full items-center justify-between text-white">
          <li className="flex items-center gap-1">
            <img src="brand-icon.gif" className="size-16" />
            <NavLink
              to="home"
              className="font-black uppercase leading-none transition-colors hover:text-zinc-200"
            >
              {/* Zah
              <br /> */}
              Auto
              <br />
              Box
            </NavLink>
          </li>
          <li>
            <p className="text-xs md:text-sm">Designed for Developers</p>
          </li>
          <li className="mr-2 flex items-center gap-4 uppercase italic">
            {!isPlaygroundPage && (
              <NavLink
                to="playground"
                className={({ isActive }) =>
                  isActive
                    ? "text-lime-green"
                    : "cursor-pointer transition-colors hover:text-zinc-200"
                }
              >
                App
              </NavLink>
            )}
            {!isDocsPage && (
              <NavLink
                to="documentation"
                className={({ isActive }) =>
                  isActive
                    ? "text-lime-green"
                    : "cursor-pointer transition-colors hover:text-zinc-200"
                }
              >
                Docs
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
