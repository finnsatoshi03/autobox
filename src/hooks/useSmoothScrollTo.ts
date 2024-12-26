import { useSmoothScroll } from "@/contexts/SmoothScrollContext";
import { useCallback } from "react";

export const useSmoothScrollTo = () => {
  const { lenis } = useSmoothScroll();

  return useCallback(
    (
      target: string | HTMLElement,
      options?: {
        offset?: number;
        duration?: number;
        immediate?: boolean;
      },
    ) => {
      if (!lenis) return;
      lenis.scrollTo(target, options);
    },
    [lenis],
  );
};
