import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BaseDialog } from "@/components/common/BaseDialog";
import { colors } from "../constants";

interface EditBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function EditBoardDialog({
  isOpen,
  onOpenChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  color,
  onColorChange,
  onSubmit,
}: EditBoardDialogProps) {

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Board"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="boardTitle">Board Title</Label>
          <Input
            id="boardTitle"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter board title..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="boardDescription">Description</Label>
          <Textarea
            id="boardDescription"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter board description..."
            className="resize-none"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Board Color</Label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {colors.map((colorClass, key) => (
              <button
                key={key}
                type="button"
                className={`w-8 h-8 cursor-pointer rounded-full ${colorClass} ${colorClass === color
                    ? "ring-2 ring-offset-2 ring-gray-900"
                    : ""
                  }`}
                onClick={() => onColorChange(colorClass)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="cursor-pointer">
            Save Changes
          </Button>
        </div>
      </form>
    </BaseDialog>
  );
}