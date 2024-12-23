import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 mix-blend-difference">
      <div className="mx-4 my-6">
        <ul className="flex w-full items-center justify-between text-white">
          <li className="flex items-center gap-1">
            <img src="brand-icon.gif" className="size-16" />
            <NavLink
              to="home"
              className="font-black uppercase leading-none transition-colors hover:text-zinc-200"
            >
              Zah
              <br />
              Auto
              <br />
              Box
            </NavLink>
          </li>
          <li>
            <p className="text-xs md:text-sm">Designed for Developers</p>
          </li>
          <li className="mr-2 cursor-pointer uppercase italic transition-colors hover:text-zinc-200">
            Menu
          </li>
        </ul>
      </div>
    </nav>
  );
}
