"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDialog } from "@/components/common/BaseDialog";

interface EditColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function EditColumnDialog({
  isOpen,
  onOpenChange,
  title,
  onTitleChange,
  onSubmit,
  onCancel,
}: EditColumnDialogProps) {
  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Column"
      description="Update the title of your column."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label>Column Title</Label>
          <Input
            id="columnTitle"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter Column Title"
            required
          />
        </div>
        <div className="space-x-2 flex justify-end">
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="cursor-pointer">
            Edit Column
          </Button>
        </div>
      </form>
    </BaseDialog>
  );
}