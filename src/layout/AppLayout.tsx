import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

type ContextType = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
};

export default function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  const { lenis } = useSmoothScroll();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, lenis]);

  const contextValue: ContextType = {
    isDark,
    setIsDark,
  };

  return (
    <div
      className={`relative h-screen w-screen transition-colors duration-500 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Navbar />
      <main
        className={`${isHomePage ? "mx-4 pt-24" : "flex h-[calc(100%-7rem)] flex-col"}`}
      >
        <Outlet context={contextValue} />
      </main>
    </div>
  );
}

// Custom hook to use the context with type safety
export function useLayoutContext() {
  return useOutletContext<ContextType>();
}
