import { ChangeEvent, DragEvent, useRef, useEffect } from "react";
import { BaseImageRequirementsDialog } from "./requirements-dialog";
import { Button } from "../ui/button";
import { ArrowLeft, Upload, Folder } from "lucide-react";

interface UploadViewProps {
  currentStep: string;
  isDragging: boolean;
  showDialog: boolean;
  dontShowAgain: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onFileUpload: (files: File[]) => Promise<void>;
  onDialogClose: () => void;
  onDontShowChange: (checked: boolean) => void;
  onBack: () => void;
}

export const UploadView = ({
  currentStep,
  isDragging,
  showDialog,
  dontShowAgain,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileUpload,
  onDialogClose,
  onDontShowChange,
  onBack,
}: UploadViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Set directory attributes after component mounts
  useEffect(() => {
    if (folderInputRef.current) {
      // Set the webkitdirectory attribute
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await onFileUpload(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const getArchiveText = () => {
    return currentStep === "targetUpload" ? "archive (ZIP/RAR)" : "images";
  };

  return (
    <div
      className="flex h-[calc(100vh-9rem)] w-full flex-col items-center justify-center space-y-4 text-center"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {currentStep !== "targetUpload" && showDialog && (
        <BaseImageRequirementsDialog
          open={showDialog}
          onClose={onDialogClose}
          dontShowAgain={dontShowAgain}
          onDontShowChange={onDontShowChange}
        />
      )}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${
          isDragging ? "bg-blue-500/20" : "pointer-events-none bg-transparent"
        }`}
      >
        {isDragging && (
          <h2 className="text-3xl font-bold md:text-5xl">
            Drop the {getArchiveText()} anywhere
          </h2>
        )}
      </div>
      {currentStep === "targetUpload" && (
        <Button
          variant="link"
          className="absolute left-4 top-20"
          onClick={onBack}
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
          {currentStep === "upload"
            ? "Upload Base Images"
            : "Upload Target Images (ZIP/RAR)"}
        </h1>
        <p className="max-w-md text-sm text-gray-600">
          {currentStep === "upload"
            ? "Upload base images for reference. You can select individual files or a folder. You'll add labels in the next step."
            : "Upload target images in a supported archive format for processing. Each archive should contain the images you want to analyze."}
        </p>
        <div className="flex flex-col items-center space-y-4">
          {currentStep === "upload" ? (
            <div className="flex flex-row space-x-2">
              <Button
                size="lg"
                className="flex items-center space-x-2 bg-lime-green text-black hover:bg-lime-green/80"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                <span>Choose Images</span>
              </Button>
              <Button
                size="lg"
                className="flex items-center space-x-2 bg-lime-green text-black hover:bg-lime-green/80"
                onClick={() => folderInputRef.current?.click()}
              >
                <Folder className="h-4 w-4" />
                <span>Choose Folder</span>
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="flex items-center space-x-2 bg-lime-green text-black hover:bg-lime-green/80"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>Choose Archive</span>
            </Button>
          )}

          <p className="text-sm text-gray-500">
            or drop {getArchiveText()} here
          </p>

          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept={
              currentStep === "targetUpload" ? ".zip,.rar,.ZIP,.RAR" : "image/*"
            }
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {currentStep === "upload" && (
            <input
              ref={folderInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
