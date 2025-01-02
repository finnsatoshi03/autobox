import React, { createContext, useContext, useState, useCallback } from "react";
import JSZip from "jszip";
import {
  AutoBoxContextType,
  AutoBoxState,
  BaseImage,
  ClassValues,
} from "@/lib/types";

const initialState: AutoBoxState = {
  baseImages: [],
  classValues: {},
  targetImages: [],
  currentStep: "upload",
  labelFile: null,
  processedZip: null,
};

const AutoBoxContext = createContext<AutoBoxContextType | undefined>(undefined);

export function AutoBoxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AutoBoxState>(initialState);

  console.log(state);

  const addBaseImages = useCallback(async (files: File[]) => {
    const newImages: BaseImage[] = await Promise.all(
      files.map(async (file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        label: "",
        originalName: file.name,
      })),
    );

    setState((prev) => ({
      ...prev,
      baseImages: [...prev.baseImages, ...newImages],
    }));
  }, []);

  const addLabel = useCallback((id: string, label: string) => {
    setState((prev) => {
      const updatedImages = prev.baseImages.map((img) =>
        img.id === id ? { ...img, label } : img,
      );

      // Create a map to track label occurrences
      const labelOccurrences: { [key: string]: number[] } = {};

      // First pass: collect all labels
      updatedImages.forEach((img, index) => {
        if (!img.label) return;
        if (!labelOccurrences[img.label]) {
          labelOccurrences[img.label] = [index];
        } else {
          labelOccurrences[img.label].push(index);
        }
      });

      // Generate class values with proper indexing
      const classValues: ClassValues = {};

      updatedImages.forEach((img, index) => {
        if (!img.label) return;

        const occurrences = labelOccurrences[img.label];
        const fileName =
          occurrences.length > 1
            ? `${img.label}-${occurrences.indexOf(index) + 1}.jpg`
            : `${img.label}.jpg`;

        classValues[fileName] = index;
      });

      return {
        ...prev,
        baseImages: updatedImages,
        classValues,
      };
    });
  }, []);

  const removeBaseImage = useCallback((id: string) => {
    setState((prev) => {
      const image = prev.baseImages.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return {
        ...prev,
        baseImages: prev.baseImages.filter((img) => img.id !== id),
      };
    });
  }, []);

  const validateLabels = useCallback((): boolean => {
    return state.baseImages.every((img) => img.label.trim().length > 0);
  }, [state.baseImages]);

  const generateClassFile = () => {
    const classValues: { [key: string]: number } = {};

    // Create a map to track label occurrences
    const labelOccurrences: { [key: string]: number[] } = {};

    // First pass: collect all labels
    state.baseImages.forEach((img, index) => {
      if (!labelOccurrences[img.label]) {
        labelOccurrences[img.label] = [index];
      } else {
        labelOccurrences[img.label].push(index);
      }
    });

    // Generate filenames with proper indexing
    state.baseImages.forEach((img, index) => {
      const extension = img.originalName.split(".").pop();
      const occurrences = labelOccurrences[img.label];
      const fileName =
        occurrences.length > 1
          ? `${img.label}-${occurrences.indexOf(index) + 1}.${extension}`
          : `${img.label}.${extension}`;

      classValues[fileName] = index;
    });

    const content = JSON.stringify(classValues, null, 2);
    const file = new File([content], "class_values.txt", {
      type: "text/plain",
    });
    setState((prev) => ({ ...prev, classValues, labelFile: file }));
    return file;
  };

  const createBaseImagesZip = async () => {
    const zip = new JSZip();

    // Create a map to track label occurrences
    const labelOccurrences: { [key: string]: number[] } = {};

    // First pass: collect all labels
    state.baseImages.forEach((img, index) => {
      if (!labelOccurrences[img.label]) {
        labelOccurrences[img.label] = [index];
      } else {
        labelOccurrences[img.label].push(index);
      }
    });

    state.baseImages.forEach((img, index) => {
      const extension = img.originalName.split(".").pop();
      const occurrences = labelOccurrences[img.label];
      const fileName =
        occurrences.length > 1
          ? `${img.label}-${occurrences.indexOf(index) + 1}.${extension}`
          : `${img.label}.${extension}`;

      zip.file(fileName, img.file);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const zipFile = new File([content], "base_images.zip", {
      type: "application/zip",
    });

    setState((prev) => ({ ...prev, processedZip: zipFile }));
    return zipFile;
  };

  const downloadZip = async () => {
    const zip = new JSZip();

    // Create a map to track label occurrences
    const labelOccurrences: { [key: string]: number[] } = {};

    // First pass: collect all labels
    state.baseImages.forEach((img, index) => {
      if (!labelOccurrences[img.label]) {
        labelOccurrences[img.label] = [index];
      } else {
        labelOccurrences[img.label].push(index);
      }
    });

    // Add base images with proper indexing
    state.baseImages.forEach((img, index) => {
      const extension = img.originalName.split(".").pop();
      const occurrences = labelOccurrences[img.label];
      const fileName =
        occurrences.length > 1
          ? `${img.label}-${occurrences.indexOf(index) + 1}.${extension}`
          : `${img.label}.${extension}`;

      zip.file(`base_images/${fileName}`, img.file);
    });

    // Add class values file
    const classFile = state.labelFile || generateClassFile();
    zip.file("class_values.txt", classFile);

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dataset.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProceed = async () => {
    await createBaseImagesZip();
    // downloadZip();
    setState((prev) => ({ ...prev, currentStep: "targetUpload" }));
  };

  const addTargetImages = useCallback(async (files: File[]) => {
    setState((prev) => ({
      ...prev,
      targetImages: [...prev.targetImages, ...files],
    }));
  }, []);

  const removeTargetImage = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      targetImages: prev.targetImages.filter((_, i) => i !== index),
    }));
  }, []);

  const value = {
    state,
    addBaseImages,
    addLabel,
    removeBaseImage,
    validateLabels,
    generateClassFile,
    downloadZip,
    addTargetImages,
    removeTargetImage,
    handleProceed,
    setState,
  };

  return (
    <AutoBoxContext.Provider value={value}>{children}</AutoBoxContext.Provider>
  );
}

export function useAutoBox() {
  const context = useContext(AutoBoxContext);
  if (context === undefined) {
    throw new Error("useAutoBox must be used within an AutoBoxProvider");
  }
  return context;
}
