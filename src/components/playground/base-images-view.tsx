import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, X } from "lucide-react";
import { Input } from "../ui/input";
import { AddMoreButton } from "./add-more";
import { ImageThumbnail } from "./image-thumbnail";
import { BaseImage } from "@/lib/types";

interface BaseImagesViewProps {
  images: BaseImage[];
  selectedImageId: string | null;
  onImageSelect: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onImageRemove: (id: string) => void;
  onAddMore: (files: File[]) => Promise<void>;
  onProceed: () => void;
  onBack: () => void;
}

export const BaseImagesView = ({
  images,
  selectedImageId,
  onImageSelect,
  onLabelChange,
  onImageRemove,
  onAddMore,
  onProceed,
  onBack,
}: BaseImagesViewProps) => {
  const selectedImage = selectedImageId
    ? images.find((img) => img.id === selectedImageId)
    : images[images.length - 1];

  const hasAllLabels = images.every(
    (img) => img.label && img.label.trim() !== "",
  );

  const handleLabelChange = (id: string, value: string) => {
    onLabelChange(id, value.toLowerCase());
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await onAddMore(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] w-full flex-col items-center justify-between p-8">
      <Button
        variant="link"
        className="absolute left-4 top-24"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex w-full flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold">Add Labels to Base Images</h2>

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
                  onImageRemove(selectedImage.id);
                  const lastImageId = images[images.length - 2]?.id;
                  onImageSelect(lastImageId || "");
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
              handleLabelChange(selectedImage?.id || "", e.target.value)
            }
            className="w-full"
          />
        </div>
      </div>

      <div className="w-full pt-4">
        <div className="flex w-full gap-4 overflow-x-auto pb-4">
          <AddMoreButton
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={images.length >= 5}
          />
          {images.map((image) => (
            <ImageThumbnail
              key={image.id}
              image={image}
              isSelected={selectedImageId === image.id}
              onClick={() => onImageSelect(image.id)}
            />
          ))}
        </div>

        <div className="flex w-full justify-center">
          <Button
            onClick={onProceed}
            className="mt-6"
            disabled={!hasAllLabels || images.length === 0}
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
};
