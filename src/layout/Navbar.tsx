import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="mx-4 my-6">
      <ul className="flex w-full items-center justify-between">
        <li>
          <NavLink to="home">AutoBox</NavLink>
        </li>
        <li>
          <p className="text-sm">Designed for Developers</p>
        </li>
        <li className="mr-2 uppercase italic">Menu</li>
      </ul>
    </nav>
  );
}
