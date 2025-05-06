import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layout/AppLayout";

import LandingPage from "./pages/LandingPage";
import Playground from "./pages/Playground";
import Documentation from "./pages/Documentation";

import LoadingProvider from "./components/loader-provider";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { AutoBoxProvider } from "./contexts/AutoBoxContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      // refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const assets: { type: "image" | "video"; src: string }[] = [
    { type: "image", src: "/b-mo.gif" },
    { type: "video", src: "/vides/hero-highlight.mp4" },
    { type: "video", src: "/vides/playground-highlight.mp4" },
  ];
  const isLoading = useAssetLoader(assets);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <AutoBoxProvider>
          <LoadingProvider isLoading={isLoading}>
            <Routes>
              <Route index element={<Navigate replace to="home" />} />
              <Route element={<AppLayout />}>
                <Route path="home" element={<LandingPage />} />
                <Route path="playground" element={<Playground />} />
                <Route path="documentation" element={<Documentation />} />
              </Route>
            </Routes>
          </LoadingProvider>
        </AutoBoxProvider>
      </BrowserRouter>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
