"use client";

import { Button } from "@/components/ui/button";
import { BoardMember, ColumnWithTasks, Task } from "@/lib/supabase/models";
import { Plus } from "lucide-react";
import { BoardColumnsSkeleton } from "@/components/skeletons/BoardColumns";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DroppableColumn } from "./DroppableColumn";
import { SortableTask } from "./SortableTask";

interface BoardColumnsProps {
  columns: ColumnWithTasks[];
  loading: boolean;
  members: BoardMember[];
  onCreateTask: (task: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
  onDeleteColumn: (columnId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateColumn: () => void;
  onEditTask: (task: Task) => void;
}

export function BoardColumns({
  columns,
  loading,
  members,
  onCreateTask,
  onEditColumn,
  onDeleteColumn,
  onDeleteTask,
  onCreateColumn,
  onEditTask,
}: BoardColumnsProps) {
  if (loading) {
    return <BoardColumnsSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full space-y-4 lg:space-y-0">
      {columns.map((column, key) => (
        <DroppableColumn
          key={key}
          column={column}
          members={members}
          onCreateTask={onCreateTask}
          onEditColumn={onEditColumn}
          onDeleteColumn={onDeleteColumn}
        >
          <SortableContext
            items={column.tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {column.tasks.map((task, key) => (
                <SortableTask
                  key={key}
                  task={task}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          </SortableContext>
        </DroppableColumn>
      ))}
      <div className="w-full lg:flex-shrink-0 lg:w-80">
        <Button
          variant="outline"
          className="w-full h-[130px] border-dashed border-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onCreateColumn}
        >
          <Plus />
          Add another list
        </Button>
      </div>
    </div>
  );
}
