"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface BaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function BaseDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  className = "w-[95vw] max-w-[425px] mx-auto",
}: BaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}