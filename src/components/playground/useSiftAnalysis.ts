import { useMutation } from "@tanstack/react-query";
import { SiftInitialResponse, SiftRequest } from "@/lib/types";
import toast from "react-hot-toast";
import axios from "axios";
import { api } from "@/services/api";

export const useSiftAnalysis = () => {
  return useMutation({
    mutationFn: async (data: SiftRequest): Promise<SiftInitialResponse> => {
      // Validate input data
      if (!data.target_archive || !data.base_archive || !data.label) {
        throw new Error(
          "Missing required files: target_archive, base_archive, or label file",
        );
      }

      const formData = new FormData();

      formData.append("class", JSON.stringify(data.class));
      formData.append(
        "target_archive",
        data.target_archive,
        data.target_archive.name,
      );
      formData.append(
        "base_archive",
        data.base_archive,
        data.base_archive.name,
      );
      formData.append("label", data.label, data.label.name);

      const response = await axios.post<SiftInitialResponse>(
        `${api}/run-sift`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(`SIFT analysis failed: ${String(error)}`);
    },
  });
};
