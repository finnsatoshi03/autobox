export type BaseImage = {
  id: string;
  file: File;
  url: string;
  label: string;
  originalName: string;
};

export type TargetImage = {
  name: string;
  size: number;
};

export type ClassValues = {
  class_values: {
    [key: string]: number;
  };
};

export type AutoBoxState = {
  baseImages: BaseImage[];
  classValues: ClassValues;
  targetImages: File[];
  currentStep: "upload" | "labeling" | "targetUpload";
  labelFile: File | null;
  processedZip: File | null;
};

export interface AutoBoxContextType {
  state: AutoBoxState;
  setState: React.Dispatch<React.SetStateAction<AutoBoxState>>;
  addBaseImages: (files: File[]) => Promise<void>;
  addLabel: (id: string, label: string) => void;
  removeBaseImage: (id: string) => void;
  validateLabels: () => boolean;
  generateClassFile: () => File;
  downloadZip: () => Promise<void>;
  addTargetImages: (files: File[]) => Promise<void>;
  removeTargetImage: (index: number) => void;
  handleProceed: () => Promise<void>;
}

export interface SiftResponse {
  accuracy: string;
  download_url: string;
  message: string;
  total_fail: number;
  total_images: number;
  total_success: number;
}

export interface SiftRequest {
  class: {
    class_values: Record<string, string>;
  };
  target_archive: File;
  base_archive: File;
  label: File;
}
