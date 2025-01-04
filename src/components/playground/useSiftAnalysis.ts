import { runSiftAnalysis } from "@/services/apiSift";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSiftAnalysis = () => {
  return useMutation({
    mutationFn: runSiftAnalysis,
    onSuccess: (data) => {
      if (data.download_url) {
        window.open(data.download_url, "_blank");
      }
    },
    onError: (error) => {
      toast.error(`SIFT analysis failed: ${String(error)}`);
    },
  });
};
