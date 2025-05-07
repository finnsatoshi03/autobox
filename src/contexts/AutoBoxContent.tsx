import React, { createContext, useContext, useState, useCallback } from "react";
import JSZip from "jszip";
import { AutoBoxContextType, AutoBoxState, BaseImage } from "@/lib/types";

const initialState: AutoBoxState = {
  baseImages: [],
  classValues: { class_values: {} },
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

      // Create a map to track label occurrences and prefix groups
      const labelOccurrences: { [key: string]: number[] } = {};
      const prefixes = new Set<string>();

      // First pass: collect all labels and prefixes
      updatedImages.forEach((img, index) => {
        if (!img.label) return;

        // Extract the label prefix (e.g. "apple" from "apple-1")
        const prefix = img.label.split("-")[0];
        prefixes.add(prefix);

        if (!labelOccurrences[img.label]) {
          labelOccurrences[img.label] = [index];
        } else {
          labelOccurrences[img.label].push(index);
        }
      });

      // Convert prefixes to array for ease of access
      const prefixArray = Array.from(prefixes);

      // Generate class values with proper indexing and class values
      const innerClassValues: { [key: string]: number } = {};

      updatedImages.forEach((img, index) => {
        if (!img.label) return;

        const occurrences = labelOccurrences[img.label];
        // Get the prefix to determine class value
        const prefix = img.label.split("-")[0];
        // Use first prefix as reference (class value 0)
        // Any other prefix gets class value 1
        const classValue = prefixArray.indexOf(prefix) === 0 ? 0 : 1;

        const extension = img.originalName.split(".").pop() || "jpg";
        const fileName =
          occurrences.length > 1
            ? `${img.label}-${occurrences.indexOf(index) + 1}.${extension}`
            : `${img.label}.${extension}`;

        innerClassValues[fileName] = classValue;
      });

      return {
        ...prev,
        baseImages: updatedImages,
        classValues: { class_values: innerClassValues },
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
    // Track label prefixes
    const prefixes = new Set<string>();

    // First pass: collect all label prefixes
    state.baseImages.forEach((img) => {
      if (!img.label) return;

      // Extract the label prefix
      const prefix = img.label.split("-")[0];
      prefixes.add(prefix);
    });

    // Convert prefixes to array for ordering
    const prefixArray = Array.from(prefixes);

    // Create a simple text with just the label prefixes (one per line)
    // First line: prefix with class value 0, second line: prefix with class value 1
    let content = "";

    // Only add prefixes that exist
    if (prefixArray.length > 0) {
      content += prefixArray[0]; // First prefix (class value 0)

      // If there's a second prefix, add it on a new line
      if (prefixArray.length > 1) {
        content += "\n" + prefixArray[1]; // Second prefix (class value 1)
      }
    }

    // Still generate the class values internally for application use
    const innerClassValues: { [key: string]: number } = {};

    // Track label occurrences
    const labelOccurrences: { [key: string]: number[] } = {};

    // Collect label occurrences
    state.baseImages.forEach((img, index) => {
      if (!img.label) return;

      if (!labelOccurrences[img.label]) {
        labelOccurrences[img.label] = [index];
      } else {
        labelOccurrences[img.label].push(index);
      }
    });

    // Generate filenames with proper indexing and class values
    state.baseImages.forEach((img, index) => {
      if (!img.label) return;

      const extension = img.originalName.split(".").pop() || "jpg";
      const occurrences = labelOccurrences[img.label];

      // Get the prefix to determine class value
      const prefix = img.label.split("-")[0];
      // First prefix gets class value 0, others get class value 1
      const classValue = prefixArray.indexOf(prefix) === 0 ? 0 : 1;

      const fileName =
        occurrences.length > 1
          ? `${img.label}-${occurrences.indexOf(index) + 1}.${extension}`
          : `${img.label}.${extension}`;

      innerClassValues[fileName] = classValue;
    });

    // Create a proper text file with just the label prefixes
    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], "class_values.txt", {
      type: "text/plain",
    });

    // Update state with both the simplified file and the internal class values
    setState((prev) => ({
      ...prev,
      classValues: { class_values: innerClassValues },
      labelFile: file,
    }));

    // Automatically download the file for debugging
    // Commented out to prevent automatic downloads
    /*
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class_values.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    */

    return file;
  };

  const createBaseImagesZip = async () => {
    const zip = new JSZip();

    // Track label occurrences and prefixes
    const labelOccurrences: { [key: string]: number[] } = {};
    const prefixes = new Set<string>();

    // First pass: collect all labels and prefixes
    state.baseImages.forEach((img, index) => {
      if (!img.label) return;

      // Extract the label prefix
      const prefix = img.label.split("-")[0];
      prefixes.add(prefix);

      if (!labelOccurrences[img.label]) {
        labelOccurrences[img.label] = [index];
      } else {
        labelOccurrences[img.label].push(index);
      }
    });

    // Generate class file with correct class values
    generateClassFile();

    state.baseImages.forEach((img, index) => {
      const extension = img.originalName.split(".").pop() || "jpg";
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

    // Generate and store the class file right after creating the zip
    const classFile = generateClassFile();

    // Make sure both files are set in state before returning
    setState((prev) => ({
      ...prev,
      processedZip: zipFile,
      labelFile: classFile,
    }));

    return { zipFile, classFile };
  };

  const downloadZip = async () => {
    const zip = new JSZip();

    // Track label occurrences and prefixes
    const labelOccurrences: { [key: string]: number[] } = {};

    // First pass: collect all labels
    state.baseImages.forEach((img, index) => {
      if (!img.label) return;

      if (!labelOccurrences[img.label]) {
        labelOccurrences[img.label] = [index];
      } else {
        labelOccurrences[img.label].push(index);
      }
    });

    // Add base images with proper indexing
    state.baseImages.forEach((img, index) => {
      const extension = img.originalName.split(".").pop() || "jpg";
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
    setState((prev) => ({ ...prev, currentStep: "targetUpload" }));
  };

  const addTargetImages = useCallback(async (files: File[]) => {
    // Make sure files is an array and contains valid files
    if (!files || !files.length) {
      console.error("No files provided to addTargetImages");
      return;
    }

    // Ensure files are properly set in state
    setState((prev) => {
      // console.log("Adding target images:", files);

      return {
        ...prev,
        targetImages: [...prev.targetImages, ...files],
      };
    });
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
    createBaseImagesZip,
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
