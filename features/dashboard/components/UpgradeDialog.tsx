"use client";

import { BaseDialog } from "@/components/common/BaseDialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UpgradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeDialog({ isOpen, onOpenChange }: UpgradeDialogProps) {
  const router = useRouter();

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Upgrade to Create More Boards"
      description="Free users can only create one board. Upgrade to Pro or Enterprise to create unlimited boards."
    >
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={() => router.push("/pricing")}
          className="cursor-pointer"
        >
          View Plans
        </Button>
      </div>
    </BaseDialog>
  );
}
