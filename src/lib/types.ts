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
  createBaseImagesZip: () => Promise<{ zipFile: File; classFile: File }>;
}

export interface SiftResponse {
  detection_accuracy: string;
  download_url: string;
  images_with_detections: number;
  message: string;
  processing_time: string;
  total_annotated_images: string;
  total_images: number;
}

export interface SiftRequest {
  class: {
    class_values: Record<string, string>;
  };
  target_archive: File;
  base_archive: File;
  label: File;
}
