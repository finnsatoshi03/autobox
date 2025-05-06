import { runSiftAnalysis } from "@/services/apiSift";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSiftAnalysis = () => {
  return useMutation({
    mutationFn: runSiftAnalysis,
    onError: (error) => {
      toast.error(`SIFT analysis failed: ${String(error)}`);
    },
  });
};
