"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDialog } from "@/components/common/BaseDialog";

interface CreateColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateColumnDialog({
  isOpen,
  onOpenChange,
  title,
  onTitleChange,
  onSubmit,
}: CreateColumnDialogProps) {
  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create New Column"
      description="Add new column to organize your tasks."
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="cursor-pointer">
            Create Column
          </Button>
        </div>
      </form>
    </BaseDialog>
  );
}