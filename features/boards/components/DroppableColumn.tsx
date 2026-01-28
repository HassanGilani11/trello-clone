"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BoardMember, ColumnWithTasks } from "@/lib/supabase/models";
import { Plus, Trash2, MoreHorizontal } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { useState } from "react";

interface DroppableColumnProps {
  column: ColumnWithTasks;
  children: React.ReactNode;
  members: BoardMember[];
  onCreateTask: (task: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function DroppableColumn({
  column,
  children,
  members,
  onCreateTask,
  onEditColumn,
  onDeleteColumn,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    onCreateTask(e);
    setIsCreatingTask(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-full lg:flex-shrink-0 lg:w-80 ${isOver ? "bg-blue-50 rounded-lg" : ""
        }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 ${isOver ? "ring-2 ring-blue-300 dark:ring-blue-500" : ""
          }`}
      >
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                {column.title}
              </h3>
              <Badge variant="secondary" className="flex-shrink-0">
                {column.tasks.length}
              </Badge>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 cursor-pointer"
                onClick={() => onDeleteColumn(column.id)}
              >
                <Trash2 className="text-red-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 cursor-pointer"
                onClick={() => onEditColumn(column)}
              >
                <MoreHorizontal />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-2">
          {children}
          <div className="w-full">
            <Button
              variant="ghost"
              className="cursor-pointer w-full mt-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsCreatingTask(true)}
            >
              <Plus />
              Add Task
            </Button>
          </div>
          <CreateTaskDialog
            isOpen={isCreatingTask}
            onOpenChange={setIsCreatingTask}
            onSubmit={handleCreateTask}
            columnId={column.id}
            members={members}
          />
        </div>
      </div>
    </div>
  );
}
