import { TargetImage } from "@/lib/types";
import { Button } from "../ui/button";
import { ArrowLeft, FileArchive, Loader2, X } from "lucide-react";

interface TargetImagesViewProps {
  images: TargetImage[];
  onImageRemove: (index: number) => void;
  onProceed: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const getFileExtension = (filename: string): string => {
  const ext = filename.split(".").pop()?.toUpperCase() || "";
  return ext;
};

export const TargetImagesView = ({
  images,
  onImageRemove,
  onProceed,
  onBack,
  isLoading,
}: TargetImagesViewProps) => (
  <div className="flex h-[calc(100vh-9rem)] w-full flex-col items-center justify-between p-8">
    <Button
      variant="link"
      className="absolute left-4 top-24"
      onClick={onBack}
      disabled={isLoading}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>

    <div className="mt-4 flex w-full flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold">Uploaded Target Images</h2>

      <div className="w-full max-w-4xl">
        {images.map((archive, index) => (
          <div key={index} className="rounded-lg border border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gray-100 p-2">
                  <FileArchive />
                </div>
                <div>
                  <p className="max-w-full truncate text-sm">{archive.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <p>{getFileExtension(archive.name)}</p>
                    <p>&#x2022;</p>
                    <p>{(archive.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-300"
                onClick={() => onImageRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex w-full justify-center">
      <Button onClick={onProceed} className="mt-6" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="size-2 animate-spin" />
        ) : (
          "Process Images"
        )}
      </Button>
    </div>
  </div>
);
