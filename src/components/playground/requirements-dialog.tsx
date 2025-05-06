import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const BaseImageRequirementsDialog = ({
  open,
  onClose,
  dontShowAgain,
  onDontShowChange,
}: {
  open: boolean;
  onClose: () => void;
  dontShowAgain: boolean;
  onDontShowChange: (checked: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-normal">
          Important: Base Image Requirements
        </DialogTitle>
        <DialogDescription className="space-y-4 pt-4">
          <p>Please ensure your base images meet these requirements:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Images should be cropped to focus solely on the reference object
            </li>
            <li>Remove any unnecessary background or surrounding elements</li>
            <li>Ensure consistent lighting and clear visibility</li>
            <li>Use high-quality images for better results</li>
          </ul>
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                onDontShowChange(checked as boolean)
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
);
