import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="relative h-screen w-screen bg-white text-black">
      <Navbar />
      <main className="mx-4 pt-24">
        <Outlet />
      </main>
    </div>
  );
}
