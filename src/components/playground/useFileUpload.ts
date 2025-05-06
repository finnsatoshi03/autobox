import { DragEvent, useState } from "react";

export const useFileUpload = (
  onFileUpload: (files: File[]) => Promise<void>,
) => {
  const [isDragging, setIsDragging] = useState(false);

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
    await onFileUpload(files);
  };

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
};
