"use client";

import { Button } from "@/components/ui/button";
import { BaseDialog } from "@/components/common/BaseDialog";

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteTaskDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteTaskDialogProps) {
  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Task"
      description="Are you sure you want to delete this task?"
    >
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </BaseDialog>
  );
}