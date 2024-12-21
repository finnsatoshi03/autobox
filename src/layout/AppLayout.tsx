import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="relative h-screen w-screen bg-white">
      <main className="mx-4 h-full overflow-auto text-black">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
