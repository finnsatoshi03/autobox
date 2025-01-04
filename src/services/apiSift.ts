import axios from "axios";
import { SiftRequest, SiftResponse } from "@/lib/types";

import { api } from "./api";

export const runSiftAnalysis = async (data: SiftRequest) => {
  const formData = new FormData();
  formData.append("class", JSON.stringify(data.class));
  formData.append("target_archive", data.target_archive);
  formData.append("base_archive", data.base_archive);
  formData.append("label", data.label);

  const response = await axios.post<SiftResponse>(`${api}/run-sift`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
