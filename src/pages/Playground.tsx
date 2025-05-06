import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { BaseImagesView } from "@/components/playground/base-images-view";
import { TargetImagesView } from "@/components/playground/target-images-view";
import { UploadView } from "@/components/playground/upload-view";
import { useFileUpload } from "@/components/playground/useFileUpload";
import { useSiftAnalysis } from "@/components/playground/useSiftAnalysis";
import { useAutoBox } from "@/contexts/AutoBoxContent";
import { SiftResponse } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define supported archive formats
const SUPPORTED_ARCHIVE_FORMATS = [".zip", ".rar"];

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
    createBaseImagesZip,
  } = useAutoBox();
  const { mutate, isLoading } = useSiftAnalysis();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showBaseImageDialog, setShowBaseImageDialog] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<SiftResponse | null>(
    null,
  );

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

  // Helper to check if file is a supported archive
  const isArchiveFile = (fileName: string): boolean => {
    return SUPPORTED_ARCHIVE_FORMATS.some((format) =>
      fileName.toLowerCase().endsWith(format),
    );
  };

  const handleFileUpload = async (files: File[]) => {
    if (state.currentStep === "upload") {
      await addBaseImages(files);
      const lastImageId = state.baseImages[state.baseImages.length - 1]?.id;
      if (lastImageId) setSelectedImageId(lastImageId);
    } else if (state.currentStep === "targetUpload") {
      if (files.some((file) => !isArchiveFile(file.name))) {
        alert(
          `Please upload archive files only (${SUPPORTED_ARCHIVE_FORMATS.join(", ")}) for target images`,
        );
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

    if (!targetImages.length) {
      toast.error("No target images uploaded. Please upload a target archive.");
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
      setApiError(null);

      try {
        // Ensure we have the base archive and label file
        if (!state.processedZip || !state.labelFile) {
          // If missing, regenerate them
          const { zipFile, classFile } = await createBaseImagesZip();

          // Make sure they're properly set in state
          if (!zipFile || !classFile) {
            toast.error("Failed to generate required files");
            toast.dismiss(loadingToast);
            return;
          }
        }

        const finalData = await processFinalData();
        if (!finalData) {
          toast.dismiss(loadingToast);
          return;
        }

        mutate(finalData, {
          onSuccess: (data) => {
            if (data && data.download_url) {
              toast.success("Processing completed successfully!");
              setAnalysisResults(data);
              setShowSuccessDialog(true);
            } else {
              toast.error("Processing completed but no results were returned.");
              setApiError("No download URL was returned from the server");
            }
            toast.dismiss(loadingToast);
          },
          onError: (error) => {
            toast.error(`Error processing images: ${String(error)}`);
            setApiError(String(error));
            toast.dismiss(loadingToast);
          },
        });
      } catch (error) {
        console.error("Error preparing data:", error);
        toast.error("Error processing images. Please try again.");
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

  // Assign incremental labels to all images
  const assignIncrementalLabels = (baseLabel: string) => {
    if (!baseLabel.trim()) {
      toast.error("Please enter a base label first");
      return;
    }

    const label = baseLabel.trim().toLowerCase();

    // Apply the incremental labels to all images
    state.baseImages.forEach((image, index) => {
      const incrementalLabel = `${label}-${index + 1}`;
      addLabel(image.id, incrementalLabel);
    });

    toast.success(`Applied "${label}" labels to all images`);
  };

  // Render functions
  const SuccessDialog = () => (
    <AlertDialog
      open={showSuccessDialog && !apiError}
      onOpenChange={(isOpen) => {
        if (!isOpen) setShowSuccessDialog(false);
      }}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Processing Completed Successfully!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Here are your analysis results:
          </AlertDialogDescription>
        </AlertDialogHeader>

        {analysisResults && (
          <div className="mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-semibold">Detection Accuracy:</div>
              <div>{analysisResults.detection_accuracy}</div>

              <div className="font-semibold">Processing Time:</div>
              <div>{analysisResults.processing_time}</div>

              <div className="font-semibold">Images Detected:</div>
              <div>
                {analysisResults.images_with_detections} of{" "}
                {analysisResults.total_images}
              </div>

              <div className="font-semibold">Annotated Images:</div>
              <div>{analysisResults.total_annotated_images}</div>
            </div>

            <div className="mt-4 flex">
              <Button
                onClick={() =>
                  window.open(analysisResults.download_url, "_blank")
                }
              >
                Download Results
              </Button>
            </div>
          </div>
        )}

        <AlertDialogFooter className="flex flex-col flex-wrap gap-2">
          <div className="mb-2 w-full text-center text-sm">
            What would you like to do next?
          </div>
          <Button
            variant="outline"
            onClick={() => handleStateReset("keepBase")}
            className="flex-1 border-gray-400"
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
          onAssignIncrementalLabels={assignIncrementalLabels}
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
