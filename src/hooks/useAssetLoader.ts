import { useState, useEffect } from "react";

type Asset = {
  type: "image" | "video";
  src: string;
};

export const useAssetLoader = (assets: Asset[]) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const promises = assets.map((asset) => {
          return new Promise((resolve, reject) => {
            if (asset.type === "image") {
              const img = new Image();
              img.src = asset.src;
              img.onload = resolve;
              img.onerror = reject;
            } else if (asset.type === "video") {
              const video = document.createElement("video");
              video.src = asset.src;
              video.onloadeddata = resolve;
              video.onerror = reject;
            }
          });
        });

        await Promise.all(promises);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading assets:", error);
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [assets]);

  return isLoading;
};
