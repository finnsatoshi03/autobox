import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import toast from "react-hot-toast";

import { BaseImagesView } from "@/components/playground/base-images-view";
import { TargetImagesView } from "@/components/playground/target-images-view";
import { UploadView } from "@/components/playground/upload-view";
import { useFileUpload } from "@/components/playground/useFileUpload";
import { useSiftAnalysis } from "@/components/playground/useSiftAnalysis";
import { useAutoBox } from "@/contexts/AutoBoxContent";
import {
  SiftResponse,
  SiftInitialResponse,
  SiftProgressResponse,
} from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define supported archive formats
const SUPPORTED_ARCHIVE_FORMATS = [".zip", ".rar"];

// Maximum number of details items to show in progress
const MAX_DETAILS_SHOWN = 5;

// Indeterminate progress indicator styles
const progressStyles = `
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%; 
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
`;

export default function Playground() {
  // Add the styles to the document head
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = progressStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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

  // Reference to store polling interval IDs
  const intervalRefs = useRef<{
    progress: NodeJS.Timeout | null;
    results: NodeJS.Timeout | null;
  }>({
    progress: null,
    results: null,
  });

  const [processingProgress, setProcessingProgress] = useState<{
    processed: number;
    total: number;
    isPolling: boolean;
    uid: string | null;
    statusUrl: string | null;
    progressUrl: string | null;
    details: Array<{
      confidence: number;
      image: string;
      status: string;
    }>;
    showingDetails: boolean;
  }>({
    processed: 0,
    total: 1, // Initialize with 1 to avoid division by zero
    isPolling: false,
    uid: null,
    statusUrl: null,
    progressUrl: null,
    details: [],
    showingDetails: false,
  });

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

  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      if (intervalRefs.current.progress)
        clearInterval(intervalRefs.current.progress);
      if (intervalRefs.current.results)
        clearInterval(intervalRefs.current.results);
    };
  }, []);

  // Fetch final results from the status URL
  const fetchFinalResults = useCallback(async () => {
    if (!processingProgress.statusUrl) return;

    try {
      const response = await fetch(processingProgress.statusUrl);
      const data = await response.json();

      // Check if processing is still ongoing
      if (data.status === "processing") {
        return null;
      }

      // Clear the results polling interval
      if (intervalRefs.current.results) {
        clearInterval(intervalRefs.current.results);
        intervalRefs.current.results = null;
      }

      // Set analysis results and show success dialog
      setAnalysisResults(data);
      setShowSuccessDialog(true);
      setProcessingProgress((prev) => ({ ...prev, isPolling: false }));

      return data;
    } catch (error) {
      console.error("Error fetching final results:", error);
      return null;
    }
  }, [processingProgress.statusUrl]);

  // Fetch progress from the progress URL
  const fetchProgress = useCallback(async () => {
    if (!processingProgress.isPolling || !processingProgress.progressUrl)
      return;

    try {
      const response = await fetch(processingProgress.progressUrl);
      const data: SiftProgressResponse = await response.json();

      setProcessingProgress((prev) => ({
        ...prev,
        processed: data.processed,
        total: data.total,
        details: data.details,
      }));

      // If processing is complete, start polling for final results
      if (data.processed === data.total && data.processed > 0) {
        if (intervalRefs.current.progress) {
          clearInterval(intervalRefs.current.progress);
          intervalRefs.current.progress = null;
        }

        // First try to get the final results
        const results = await fetchFinalResults();

        // If not ready yet, start polling for results
        if (!results && processingProgress.statusUrl) {
          intervalRefs.current.results = setInterval(fetchFinalResults, 2000);
        }
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, [
    processingProgress.isPolling,
    processingProgress.progressUrl,
    processingProgress.statusUrl,
    fetchFinalResults,
  ]);

  // Setup polling when isPolling becomes true
  useEffect(() => {
    if (processingProgress.isPolling && !intervalRefs.current.progress) {
      // Fetch immediately, then start interval
      fetchProgress();
      intervalRefs.current.progress = setInterval(fetchProgress, 1000);
    } else if (!processingProgress.isPolling) {
      // Clear intervals if we're no longer polling
      if (intervalRefs.current.progress) {
        clearInterval(intervalRefs.current.progress);
        intervalRefs.current.progress = null;
      }
      if (intervalRefs.current.results) {
        clearInterval(intervalRefs.current.results);
        intervalRefs.current.results = null;
      }
    }

    return () => {
      if (intervalRefs.current.progress)
        clearInterval(intervalRefs.current.progress);
    };
  }, [processingProgress.isPolling, fetchProgress]);

  // Helper to check if file is a supported archive
  const isArchiveFile = (fileName: string): boolean => {
    return SUPPORTED_ARCHIVE_FORMATS.some((format) =>
      fileName.toLowerCase().endsWith(format),
    );
  };

  // Helper to check if file is an image
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  const handleFileUpload = async (files: File[]) => {
    if (state.currentStep === "upload") {
      // Filter to only include image files
      const imageFiles = files.filter(isImageFile);

      if (files.length > 0 && imageFiles.length === 0) {
        toast.error(
          "No valid image files found. Please select images or a folder containing images.",
        );
        return;
      }

      await addBaseImages(imageFiles);
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
    setProcessingProgress({
      processed: 0,
      total: 1,
      isPolling: false,
      uid: null,
      statusUrl: null,
      progressUrl: null,
      details: [],
      showingDetails: false,
    });
  };

  const processFinalData = async () => {
    const { targetImages, processedZip, labelFile, classValues } = state;

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

    // For backend compatibility, we still need to pass the class_values
    // even though the label file now contains just the label names
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
          onSuccess: (data: SiftInitialResponse) => {
            if (data && data.progress_url && data.status_url && data.uid) {
              toast.success("Processing started successfully!");
              toast.dismiss(loadingToast);

              // Start tracking progress
              setProcessingProgress({
                processed: 0,
                total: 1,
                isPolling: true,
                uid: data.uid,
                statusUrl: data.status_url,
                progressUrl: data.progress_url,
                details: [],
                showingDetails: false,
              });
            } else {
              toast.error("Processing started but couldn't track progress.");
              setApiError("Could not get progress tracking information");
              toast.dismiss(loadingToast);
            }
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

  // Toggle showing detailed progress information
  const toggleDetailsView = () => {
    setProcessingProgress((prev) => ({
      ...prev,
      showingDetails: !prev.showingDetails,
    }));
  };

  // State for cycling through status messages
  const [statusTextIndex, setStatusTextIndex] = useState(0);

  // Text variations for the retrieving results state
  const resultStatusTexts = [
    "Analyzing image patterns...",
    "Extracting SIFT keypoints...",
    "Detecting object boundaries...",
    "Computing SIFT descriptors...",
    "Calculating bounding boxes...",
    "Matching feature vectors...",
    "Applying scale invariance...",
    "Identifying object regions...",
    "Generating spatial histograms...",
    "Refining edge detection...",
    "Matching keypoint orientations...",
    "Creating annotation metadata...",
    "Finalizing bounding coordinates...",
    "Applying label classifications...",
    "Packaging final annotations...",
  ];

  // Effect to rotate through status messages
  useEffect(() => {
    const isRetrievingResults =
      processingProgress.processed === processingProgress.total &&
      processingProgress.processed > 0 &&
      processingProgress.isPolling;

    if (!isRetrievingResults) return;

    const intervalId = setInterval(() => {
      setStatusTextIndex((prev) => (prev + 1) % resultStatusTexts.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [
    processingProgress.processed,
    processingProgress.total,
    processingProgress.isPolling,
    resultStatusTexts.length,
  ]);

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

  // ProgressDialog - prevents rerendering during polling
  const ProgressDialog = useMemo(() => {
    // Determine if we're in the "retrieving results" state - all images processed but final results not ready
    const isRetrievingResults =
      processingProgress.processed === processingProgress.total &&
      processingProgress.processed > 0 &&
      processingProgress.isPolling;

    const currentStatusText = resultStatusTexts[statusTextIndex];

    const dialogContent = (
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRetrievingResults
              ? "Finalizing Results"
              : "Processing Your Images"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {isRetrievingResults
              ? "Please wait while we prepare your final results"
              : "Please wait while we process your images"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mb-4 space-y-4">
          {isRetrievingResults ? (
            // Indeterminate loading indicator for the "retrieving results" state
            <div className="space-y-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-900/20 dark:bg-zinc-50/20">
                <div
                  className="absolute h-full w-2/5 rounded-full bg-zinc-900 dark:bg-zinc-50"
                  style={{
                    animation: "indeterminate 1.5s infinite ease-in-out",
                  }}
                />
              </div>
              <div className="text-center text-sm">{currentStatusText}</div>
            </div>
          ) : (
            // Normal progress tracking for image processing
            <div className="space-y-2">
              <Progress
                value={
                  (processingProgress.processed / processingProgress.total) *
                  100
                }
                className="h-2 w-full"
              />
              <div className="text-center text-sm">
                {processingProgress.processed} of {processingProgress.total}{" "}
                images processed (
                {Math.round(
                  (processingProgress.processed / processingProgress.total) *
                    100,
                )}
                %)
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleDetailsView}
              className="text-xs"
            >
              {processingProgress.showingDetails
                ? "Hide Details"
                : "Show Details"}
            </Button>
          </div>

          {processingProgress.showingDetails &&
            processingProgress.details.length > 0 && (
              <ScrollArea className="h-40 rounded-md border p-2">
                <div className="space-y-1.5">
                  {processingProgress.details
                    .slice(-MAX_DETAILS_SHOWN)
                    .map((detail, index) => (
                      <div
                        key={`${detail.image}-${index}`}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="max-w-[200px] truncate">
                          {detail.image}
                        </span>
                        <span
                          className={`ml-2 ${detail.status === "done" ? "text-green-600" : "text-amber-600"}`}
                        >
                          {detail.status}
                        </span>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}
        </div>
      </AlertDialogContent>
    );

    return (
      <AlertDialog
        open={processingProgress.isPolling}
        onOpenChange={(isOpen) => {
          // Prevent user from manually closing while processing
          if (
            !isOpen &&
            processingProgress.processed !== processingProgress.total
          ) {
            toast.error(
              "Processing in progress, please wait until completion.",
            );
            return;
          }

          // Only update the state if we're actually changing the value
          if (processingProgress.isPolling !== isOpen) {
            setProcessingProgress((prev) => ({ ...prev, isPolling: isOpen }));
          }
        }}
      >
        {dialogContent}
      </AlertDialog>
    );
  }, [
    processingProgress.processed,
    processingProgress.total,
    processingProgress.showingDetails,
    processingProgress.details,
    processingProgress.isPolling,
    toggleDetailsView,
    statusTextIndex,
    resultStatusTexts,
  ]);

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
      {ProgressDialog}
    </>
  );
}
