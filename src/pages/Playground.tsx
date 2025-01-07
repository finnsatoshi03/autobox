import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { BaseImagesView } from "@/components/playground/base-images-view";
import { TargetImagesView } from "@/components/playground/target-images-view";
import { UploadView } from "@/components/playground/upload-view";
import { useFileUpload } from "@/components/playground/useFileUpload";
import { useSiftAnalysis } from "@/components/playground/useSiftAnalysis";
import { useAutoBox } from "@/contexts/AutoBoxContent";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const { mutate, isLoading } = useSiftAnalysis();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showBaseImageDialog, setShowBaseImageDialog] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const resetStateOptions = {
    full: {
      baseImages: [],
      targetImages: [],
      currentStep: "upload" as const,
      classValues: { class_values: {} },
      labelFile: null,
      processedZip: null,
    },
    keepBase: {
      targetImages: [],
      currentStep: "targetUpload" as const,
    },
  };

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

  const handleStateReset = (type: keyof typeof resetStateOptions) => {
    setState((prev) => ({
      ...prev,
      ...resetStateOptions[type],
    }));
    setSelectedImageId(null);
    setShowSuccessDialog(false);
  };

  const processFinalData = async () => {
    const { classValues, targetImages, processedZip, labelFile } = state;

    if (!processedZip || !labelFile) {
      toast.error(
        `${!processedZip ? "Processed zip" : "Label"} file is missing.`,
      );
      return;
    }

    return {
      class: {
        class_values: Object.fromEntries(
          Object.entries(classValues.class_values).map(([key, value]) => [
            key,
            value.toString(),
          ]),
        ),
      },
      target_archive: targetImages[0],
      base_archive: processedZip,
      label: labelFile,
    };
  };

  const handleProceedAndContinue = async () => {
    if (!validateLabels()) {
      toast.error("Please add labels for all images before proceeding");
      return;
    }

    try {
      if (state.currentStep === "upload") {
        await handleProceed();
        return;
      }

      const loadingToast = toast.loading("Processing your images...");

      try {
        const finalData = await processFinalData();
        if (!finalData) return;

        mutate(finalData);
        toast.success("Processing completed successfully!");
        setShowSuccessDialog(true);
      } catch (error) {
        console.error("Error processing images:", error);
        toast.error("Error processing images. Please try again.");
      } finally {
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.error("Error in handle proceed:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleDialogClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("showBaseImageDialog", "false");
    }
    setShowBaseImageDialog(false);
  };

  // Render functions
  const SuccessDialog = () => (
    <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Processing Completed Successfully!
          </AlertDialogTitle>
          <AlertDialogDescription>
            What would you like to do next?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleStateReset("keepBase")}
            className="flex-1"
          >
            Process New Dataset with Same Base Images
          </Button>
          <Button
            onClick={() => handleStateReset("full")}
            className="flex-1 bg-lime-green text-black hover:bg-lime-green/80"
          >
            Start Fresh with New Base Images
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderContent = () => {
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
          isLoading={isLoading}
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
  };

  return (
    <>
      {renderContent()}
      <SuccessDialog />
    </>
  );
}
