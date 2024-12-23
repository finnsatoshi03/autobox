import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import LoadingProvider from "./components/loader-provider";

import { useAssetLoader } from "@/hooks/useAssetLoader";

export default function App() {
  const assets: { type: "image" | "video"; src: string }[] = [
    { type: "image", src: "/b-mo.gif" },
    { type: "video", src: "/vides/hero-highlight.mp4" },
    { type: "video", src: "/vides/playground-highlight.mp4" },
  ];

  const isLoading = useAssetLoader(assets);

  return (
    <BrowserRouter>
      <LoadingProvider isLoading={isLoading}>
        <Routes>
          <Route index element={<Navigate replace to="home" />} />
          <Route element={<AppLayout />}>
            <Route path="home" element={<LandingPage />} />
          </Route>
        </Routes>
      </LoadingProvider>
    </BrowserRouter>
  );
}
