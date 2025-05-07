import { ChangeEvent, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, X, Tag, PlusCircle, Layers } from "lucide-react";
import { Input } from "../ui/input";
import { AddMoreButton } from "./add-more";
import { ImageThumbnail } from "./image-thumbnail";
import { BaseImage } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

interface BaseImagesViewProps {
  images: BaseImage[];
  selectedImageId: string | null;
  onImageSelect: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onImageRemove: (id: string) => void;
  onAddMore: (files: File[]) => Promise<void>;
  onProceed: () => void;
  onBack: () => void;
  onAssignIncrementalLabels?: (baseLabel: string) => void;
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
  onAssignIncrementalLabels,
}: BaseImagesViewProps) => {
  const [baseLabel, setBaseLabel] = useState<string>("");
  const [showAppendDialog, setShowAppendDialog] = useState(false);
  const [appendBaseLabel, setAppendBaseLabel] = useState<string>("");
  const [startIndex, setStartIndex] = useState<number>(1);
  const [prevImagesLength, setPrevImagesLength] = useState<number>(0);
  const [pendingLabelBatch, setPendingLabelBatch] = useState<{
    prefix: string;
    startIndex: number;
    count: number;
  } | null>(null);

  // Helper to check if a label prefix already exists in the images
  const getLabelPrefixes = () => {
    const prefixes = new Set<string>();
    images.forEach((image) => {
      if (image.label) {
        // Extract the prefix (e.g., "apple" from "apple-1")
        const prefix = image.label.split("-")[0];
        prefixes.add(prefix);
      }
    });
    return Array.from(prefixes);
  };

  // Track image array changes and apply pending labels
  useEffect(() => {
    // Only run when images length increases and we have pending labels
    if (images.length > prevImagesLength && pendingLabelBatch) {
      const { prefix, startIndex, count } = pendingLabelBatch;
      const startPos = prevImagesLength;
      const endPos = Math.min(startPos + count, images.length);

      // Get existing label prefixes
      const existingPrefixes = getLabelPrefixes();
      const prefixExists = existingPrefixes.includes(
        prefix.trim().toLowerCase(),
      );

      // Display which class value is being assigned
      const classValue = prefixExists ? 0 : 1;
      toast.success(
        `Applying ${prefix} labels with class value: ${classValue}`,
      );

      // Apply the labels to just the new images
      for (let i = startPos; i < endPos; i++) {
        const image = images[i];
        const index = i - startPos;
        const incrementalLabel = `${prefix.trim().toLowerCase()}-${startIndex + index}`;
        onLabelChange(image.id, incrementalLabel);
      }

      // Clear the pending label batch
      setPendingLabelBatch(null);
    }

    // Update previous length
    setPrevImagesLength(images.length);
  }, [images, pendingLabelBatch, prevImagesLength, onLabelChange]);

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

  const handleApplyIncrementalLabels = () => {
    if (onAssignIncrementalLabels && baseLabel.trim()) {
      onAssignIncrementalLabels(baseLabel);
    }
  };

  const handleAppendFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const filesToAdd = Array.from(e.target.files);
      const fileCount = filesToAdd.length;

      // Set up the pending label batch before adding files
      if (appendBaseLabel.trim()) {
        setPendingLabelBatch({
          prefix: appendBaseLabel,
          startIndex: startIndex,
          count: fileCount,
        });
      }

      // Add the files
      await onAddMore(filesToAdd);
      e.target.value = "";
      setShowAppendDialog(false);
    }
  };

  const showAutoLabelingOption = images.length >= 5;

  // Get the current unique label prefixes for the dialog
  const currentPrefixes = getLabelPrefixes();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <Button
        variant="link"
        className="absolute left-4 top-24"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="flex h-full flex-col items-center justify-between">
        <div className="flex h-full flex-col items-center px-8">
          <h2 className="mb-4 text-2xl font-bold">Add Labels to Base Images</h2>

          <div className="w-full max-w-2xl flex-1 space-y-4">
            <div className="relative aspect-video h-2/3 w-full overflow-hidden rounded-lg border border-gray-400">
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

            {showAutoLabelingOption && (
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Base label (e.g. 'apple')"
                  value={baseLabel}
                  onChange={(e) => setBaseLabel(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyIncrementalLabels}
                  variant="outline"
                  className="whitespace-nowrap border-lime-green hover:bg-lime-green/10"
                  disabled={!baseLabel.trim()}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Auto-label ({baseLabel || "base"}-1,2,3...)
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col px-8 pb-6 pt-4">
          <div className="flex w-full items-center justify-between pb-2">
            <div className="text-sm text-gray-500">
              {images.length} image{images.length !== 1 ? "s" : ""} uploaded
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAppendDialog(true)}
              className="border-lime-green hover:bg-lime-green/10"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Append Batch
            </Button>
          </div>

          <div className="flex w-full gap-4 overflow-x-auto pb-4">
            <AddMoreButton
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={false}
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
              className="mt-4"
              disabled={!hasAllLabels || images.length === 0}
            >
              Process and Continue
            </Button>
          </div>
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

      <input
        id="append-file-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAppendFileChange}
      />

      <Dialog open={showAppendDialog} onOpenChange={setShowAppendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Append New Batch of Images</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="append-base-label">Batch Label Prefix</Label>
              <Input
                id="append-base-label"
                placeholder="Enter base label (e.g. 'banana')"
                value={appendBaseLabel}
                onChange={(e) => setAppendBaseLabel(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Images will be auto-labeled as {appendBaseLabel || "batch"}-
                {startIndex}, {appendBaseLabel || "batch"}-{startIndex + 1},
                etc.
              </p>
              {currentPrefixes.length > 0 && (
                <div className="mt-2 text-xs">
                  <span className="font-semibold">Current prefixes: </span>
                  {currentPrefixes.join(", ")}
                  <p className="mt-1 text-gray-600">
                    Same prefix = class value 0, new prefix = class value 1
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-index">Starting Index</Label>
              <Input
                id="start-index"
                type="number"
                min="1"
                value={startIndex}
                onChange={(e) => setStartIndex(parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>

            <div className="flex justify-center rounded-md border border-dashed border-gray-300 px-6 py-10">
              <div className="text-center">
                <Layers className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex text-sm">
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("append-file-upload")?.click()
                    }
                  >
                    Select images to append
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Images will be added to your current batch
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAppendDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
