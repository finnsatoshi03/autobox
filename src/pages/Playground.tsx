import { BaseImagesView } from "@/components/playground/base-images-view";
import { TargetImagesView } from "@/components/playground/target-images-view";
import { UploadView } from "@/components/playground/upload-view";
import { useFileUpload } from "@/components/playground/useFileUpload";
import { useAutoBox } from "@/contexts/AutoBoxContent";
import { useEffect, useState } from "react";

export default function Playground() {
  const {
    state,
    setState,
    addBaseImages,
    addLabel,
    removeBaseImage,
    removeTargetImage,
    validateLabels,
    handleProceed,
    addTargetImages,
  } = useAutoBox();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showBaseImageDialog, setShowBaseImageDialog] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem("showBaseImageDialog") !== "false";
    setShowBaseImageDialog(shouldShow);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    if (state.currentStep === "upload") {
      if (state.baseImages.length + files.length > 5) {
        alert("Maximum 5 base images allowed");
        return;
      }
      await addBaseImages(files);
      const lastImageId = state.baseImages[state.baseImages.length - 1]?.id;
      if (lastImageId) setSelectedImageId(lastImageId);
    } else if (state.currentStep === "targetUpload") {
      if (files.some((file) => !file.name.endsWith(".zip"))) {
        alert("Please upload ZIP files only for target images");
        return;
      }
      await addTargetImages(files);
    }
  };

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useFileUpload(handleFileUpload);

  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      targetImages: [],
      currentStep: prev.currentStep === "upload" ? "upload" : "upload",
      ...(prev.currentStep === "upload" && {
        baseImages: [],
        classValues: { class_values: {} },
        labelFile: null,
        processedZip: null,
      }),
    }));
  };

  const handleProceedAndContinue = async () => {
    if (!validateLabels()) {
      alert("Please add labels for all images before proceeding");
      return;
    }

    try {
      await handleProceed();
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Error processing images. Please try again.");
    }
  };

  const handleDialogClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("showBaseImageDialog", "false");
    }
    setShowBaseImageDialog(false);
  };

  // Render functions
  if (state.baseImages.length > 0 && state.currentStep !== "targetUpload") {
    return (
      <BaseImagesView
        images={state.baseImages}
        selectedImageId={selectedImageId}
        onImageSelect={setSelectedImageId}
        onLabelChange={addLabel}
        onImageRemove={removeBaseImage}
        onAddMore={handleFileUpload}
        onProceed={handleProceedAndContinue}
        onBack={handleBack}
      />
    );
  }

  if (state.currentStep === "targetUpload" && state.targetImages.length > 0) {
    return (
      <TargetImagesView
        images={state.targetImages}
        onImageRemove={removeTargetImage}
        onProceed={handleProceedAndContinue}
        onBack={handleBack}
      />
    );
  }

  return (
    <UploadView
      currentStep={state.currentStep}
      isDragging={isDragging}
      showDialog={showBaseImageDialog}
      dontShowAgain={dontShowAgain}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onFileUpload={handleFileUpload}
      onDialogClose={handleDialogClose}
      onDontShowChange={setDontShowAgain}
      onBack={handleBack}
    />
  );
}
