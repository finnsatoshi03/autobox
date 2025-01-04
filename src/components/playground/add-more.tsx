import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export const AddMoreButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => (
  <Button
    variant="outline"
    className="flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed"
    onClick={onClick}
    disabled={disabled}
  >
    <Plus className="h-6 w-6" />
    <span className="text-xs">{disabled ? "Max 5 images" : "Add More"}</span>
  </Button>
);
