import { BaseImage } from "@/lib/types";

export const ImageThumbnail = ({
  image,
  isSelected,
  onClick,
}: {
  image: BaseImage;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
      isSelected ? "border-blue-500" : "border-transparent"
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
);
