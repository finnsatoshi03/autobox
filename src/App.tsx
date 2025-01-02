import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import LandingPage from "./pages/LandingPage";
import Playground from "./pages/Playground";

import LoadingProvider from "./components/loader-provider";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { SmoothScrollProvider } from "./contexts/SmoothScrollContext";
import { AutoBoxProvider } from "./contexts/AutoBoxContent";

export default function App() {
  const assets: { type: "image" | "video"; src: string }[] = [
    { type: "image", src: "/b-mo.gif" },
    { type: "video", src: "/vides/hero-highlight.mp4" },
    { type: "video", src: "/vides/playground-highlight.mp4" },
  ];
  const isLoading = useAssetLoader(assets);

  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <AutoBoxProvider>
          <LoadingProvider isLoading={isLoading}>
            <Routes>
              <Route index element={<Navigate replace to="home" />} />
              <Route element={<AppLayout />}>
                <Route path="home" element={<LandingPage />} />
                <Route path="playground" element={<Playground />} />
              </Route>
            </Routes>
          </LoadingProvider>
        </AutoBoxProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}
