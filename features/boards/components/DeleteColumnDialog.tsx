"use client";

import { Button } from "@/components/ui/button";
import { BaseDialog } from "@/components/common/BaseDialog";

interface DeleteColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteColumnDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteColumnDialogProps) {
  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Column"
      description="Are you sure you want to delete this column?"
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