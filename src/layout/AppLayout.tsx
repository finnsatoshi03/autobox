import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

export default function AppLayout() {
  const location = useLocation();
  const { lenis } = useSmoothScroll();

  // Reset scroll position on route change
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, lenis]);

  return (
    <div className="relative h-screen w-screen bg-white text-black">
      <Navbar />
      <main className="mx-4 pt-24">
        <Outlet />
      </main>
    </div>
  );
}
