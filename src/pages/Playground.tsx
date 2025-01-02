import { useState, DragEvent, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Plus, ArrowLeft, FileArchive } from "lucide-react";
import { useAutoBox } from "@/contexts/AutoBoxContent";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const [isDragging, setIsDragging] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showBaseImageDialog, setShowBaseImageDialog] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Load dialog preference from localStorage
  useEffect(() => {
    const shouldShow = localStorage.getItem("showBaseImageDialog") !== "false";
    setShowBaseImageDialog(shouldShow);
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    if (state.currentStep === "upload") {
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      if (state.currentStep === "upload") {
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
      e.target.value = "";
    }
  };

  const handleLabelChange = (id: string, value: string) => {
    addLabel(id, value.toLowerCase());
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

  const handleBack = () => {
    if (state.currentStep === "upload") {
      // Reset everything if we're in the initial upload step
      setState((prev) => ({
        ...prev,
        baseImages: [],
        targetImages: [],
        classValues: { class_values: {} },
        currentStep: "upload",
        labelFile: null,
        processedZip: null,
      }));
    } else if (state.currentStep === "targetUpload") {
      // Just go back to upload step and clear target images
      setState((prev) => ({
        ...prev,
        targetImages: [],
        currentStep: "upload",
      }));
    }
  };

  if (state.baseImages.length > 0 && state.currentStep !== "targetUpload") {
    const selectedImage = selectedImageId
      ? state.baseImages.find((img) => img.id === selectedImageId)
      : state.baseImages[state.baseImages.length - 1];

    return (
      <div className="flex h-[calc(100vh-9rem)] w-full flex-col items-center justify-between p-8">
        {/* Back Button */}
        <Button
          variant="link"
          className="absolute left-4 top-24"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {/* Main Content Area */}
        <div className="flex w-full flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold">Add Labels to Base Images</h2>

          {/* Single Image Preview */}
          <div className="w-full max-w-2xl space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-400">
              <img
                src={selectedImage?.url}
                alt={selectedImage?.originalName}
                className="h-full w-full object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => {
                  if (selectedImage) {
                    removeBaseImage(selectedImage.id);
                    // Select the last remaining image after deletion
                    const lastImageId =
                      state.baseImages[state.baseImages.length - 2]?.id;
                    setSelectedImageId(lastImageId || null);
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Enter label"
              value={selectedImage?.label || ""}
              onChange={(e) =>
                selectedImage &&
                handleLabelChange(selectedImage.id, e.target.value)
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Bottom Image Strip */}
        <div className="w-full pt-4">
          <div className="flex w-full gap-4 overflow-x-auto pb-4">
            {/* Add More Button */}
            <Button
              variant="outline"
              className="flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs">Add More</span>
            </Button>

            {/* Image Thumbnails */}
            {state.baseImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageId(image.id)}
                className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImageId === image.id
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="h-full w-full object-cover"
                />
                {image.label && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                    <p className="truncate text-xs text-white">{image.label}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Process Button */}
          <div className="flex w-full justify-center">
            <Button
              onClick={handleProceedAndContinue}
              className="mt-6"
              disabled={!validateLabels()}
            >
              Process and Continue
            </Button>
          </div>
        </div>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  if (state.currentStep === "targetUpload" && state.targetImages.length > 0) {
    return (
      <div className="flex h-[calc(100vh-9rem)] w-full flex-col items-center justify-between p-8">
        <Button
          variant="link"
          className="absolute left-4 top-24"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mt-4 flex w-full flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold">Uploaded Target Images</h2>

          <div className="w-full max-w-4xl">
            {state.targetImages.map((zip, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-300 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <FileArchive />
                    </div>
                    <div>
                      <p className="max-w-full truncate text-sm">{zip.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <p>ZIP</p>
                        <p>&#x2022;</p>
                        <p>{(zip.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-gray-300"
                    onClick={() => removeTargetImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-center">
          <Button onClick={handleProceedAndContinue} className="mt-6">
            Process Images
          </Button>
        </div>

        <input
          id="file-upload"
          type="file"
          accept=".zip"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-[calc(100vh-9rem)] w-full flex-col items-center justify-center space-y-4 text-center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {state.currentStep !== "targetUpload" && showBaseImageDialog && (
        <Dialog open={showBaseImageDialog} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-normal">
                Important: Base Image Requirements
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <p>Please ensure your base images meet these requirements:</p>
                <ul className="list-inside list-disc space-y-2">
                  <li>
                    Images should be cropped to focus solely on the reference
                    object
                  </li>
                  <li>
                    Remove any unnecessary background or surrounding elements
                  </li>
                  <li>Ensure consistent lighting and clear visibility</li>
                  <li>Use high-quality images for better results</li>
                </ul>
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox
                    id="dontShow"
                    checked={dontShowAgain}
                    onCheckedChange={(checked) =>
                      setDontShowAgain(checked as boolean)
                    }
                  />
                  <label htmlFor="dontShow" className="text-sm">
                    I understand, don't show this again
                  </label>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <div
        className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${
          isDragging ? "bg-blue-500/20" : "pointer-events-none bg-transparent"
        }`}
      >
        {isDragging && (
          <h2 className="text-3xl font-bold md:text-5xl">
            Drop the{" "}
            {state.currentStep === "targetUpload" ? "ZIP file" : "images"}{" "}
            anywhere
          </h2>
        )}
      </div>

      {state.currentStep === "targetUpload" && (
        <Button
          variant="link"
          className="absolute left-4 top-20"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}

      <div
        className={`flex flex-col items-center space-y-4 transition-opacity duration-200 ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <h1 className="text-3xl font-bold md:text-5xl">
          {state.currentStep === "upload"
            ? "Upload Base Images"
            : "Upload Target Images (ZIP)"}
        </h1>
        <p className="max-w-md text-sm text-gray-600">
          {state.currentStep === "upload"
            ? "Upload base images for reference. You'll add labels in the next step."
            : "Upload target images in ZIP format for processing. Each ZIP file should contain the images you want to analyze."}
        </p>
        <div className="flex flex-col items-center space-y-4">
          <Button
            size="lg"
            className="flex items-center space-x-2 bg-lime-green text-black hover:bg-lime-green/80"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="h-4 w-4" />
            <span>
              Choose{" "}
              {state.currentStep === "targetUpload" ? "ZIP File" : "Images"}
            </span>
          </Button>
          <p className="text-sm text-gray-500">
            or drop{" "}
            {state.currentStep === "targetUpload" ? "ZIP files" : "images"} here
          </p>
          <input
            id="file-upload"
            type="file"
            accept={state.currentStep === "targetUpload" ? ".zip" : "image/*"}
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
