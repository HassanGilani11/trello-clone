"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDialog } from "@/components/common/BaseDialog";

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    priority: string[];
    assignee: string[];
    dueDate: string | null;
  };
  onFilterChange: (
    type: "priority" | "assignee" | "dueDate",
    value: string | string[] | null
  ) => void;
  onClearFilters: () => void;
}

export function FilterDialog({
  isOpen,
  onOpenChange,
  filters,
  onFilterChange,
  onClearFilters,
}: FilterDialogProps) {
  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Filter Tasks"
      description="Filter tasks by priority, assignee, or due date"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <div className="flex flex-wrap gap-2">
            {["low", "medium", "high"].map((priority, key) => (
              <Button
                key={key}
                onClick={() => {
                  const newPriorities = filters.priority.includes(priority)
                    ? filters.priority.filter((p) => p !== priority)
                    : [...filters.priority, priority];
                  onFilterChange("priority", newPriorities);
                }}
                variant={
                  filters.priority.includes(priority) ? "default" : "outline"
                }
                className="cursor-pointer"
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Input
            type="date"
            value={filters.dueDate || ""}
            onChange={(e) => onFilterChange("dueDate", e.target.value || null)}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
}
