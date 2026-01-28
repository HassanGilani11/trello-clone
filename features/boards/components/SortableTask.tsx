"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/lib/supabase/models";
import { Calendar, Trash2, User } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getPriorityColor } from "../utils";

interface SortableTaskProps {
  task: Task;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export function SortableTask({ task, onDeleteTask, onEditTask }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({ id: task.id });

  const styles = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={styles} {...attributes} {...listeners}>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onEditTask(task)}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
              <div
                className="p-1.5 hover:bg-gray-100 rounded-md group"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
              >
                <Trash2 className="text-red-400 cursor-pointer group-hover:text-red-500 w-[15px] h-[15px]" />
              </div>
            </div>
            {task.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 italic">
                {task.description}
              </p>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col space-y-1 min-w-0 flex-1 pr-2">
                {task.assignee && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <User className="size-3.5 flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{task.assignee}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="size-3.5 flex-shrink-0" />
                    <span className="truncate">{new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(
                  task.priority
                )}`}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
