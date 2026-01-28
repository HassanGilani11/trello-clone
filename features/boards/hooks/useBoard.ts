"use client";

import {
  boardDataService,
  boardService,
  columnService,
  memberService,
  taskService,
  activityService,
} from "@/lib/services";
import { Board, BoardMember, ColumnWithTasks, Task } from "@/lib/supabase/models";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useBoard(boardId: string) {
  const { supabase, isLoaded } = useSupabase();
  const { user } = useUser();

  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (boardId && isLoaded && supabase) {
      loadBoard();
    }
  }, [boardId, isLoaded]);

  async function logActivity(
    taskId: string,
    actionType: "move" | "update" | "create" | "delete" | "mention",
    details: any = {}
  ) {
    if (!user || !supabase) return;
    try {
      // Find task title if possible
      let taskTitle = "";
      for (const col of columns) {
        const t = col.tasks.find((task) => task.id === taskId);
        if (t) {
          taskTitle = t.title;
          break;
        }
      }

      await activityService.createLog(supabase, {
        task_id: taskId,
        user_id: user.id,
        action_type: actionType,
        details: {
          ...details,
          user_email: user.primaryEmailAddress?.emailAddress || "Someone",
        },
        entity_title: taskTitle,
      });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  }

  async function loadBoard() {
    if (!boardId) return;

    try {
      setLoading(true);
      setError(null);
      const [boardData, membersData] = await Promise.all([
        boardDataService.getBoardWithColumns(supabase!, boardId),
        memberService.getMembers(supabase!, boardId).catch((err) => {
          console.warn("Failed to load members, possibly missing migration:", err);
          return [];
        }),
      ]);

      setBoard(boardData.board);
      setColumns(boardData.columnsWithTasks);

      // Ensure owner is in members list even if not in DB yet
      let finalMembers = [...membersData];
      const ownerExists = membersData.some(m => m.user_id === boardData.board.user_id);
      if (!ownerExists && user && boardData.board.user_id === user.id) {
        finalMembers.push({
          id: 'owner-virtual',
          board_id: boardId,
          user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || 'Owner',
          role: 'owner',
          created_at: new Date().toISOString()
        });
      }
      setMembers(finalMembers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load boards.");
    } finally {
      setLoading(false);
    }
  }

  async function updateBoard(boardId: string, updates: Partial<Board>) {
    try {
      const updatedBoard = await boardService.updateBoard(
        supabase!,
        boardId,
        updates
      );
      setBoard(updatedBoard);
      toast.success("Board updated");
      return updatedBoard;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update the board.";
      setError(msg);
      toast.error(msg);
    }
  }

  async function createRealTask(
    columnId: string,
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      dueDate?: string;
      priority?: "low" | "medium" | "high";
    }
  ) {
    try {
      const newTask = await taskService.createTask(supabase!, {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate || null,
        column_id: columnId,
        sort_order:
          columns.find((col) => col.id === columnId)?.tasks.length || 0,
        priority: taskData.priority || "medium",
      });

      setColumns((prev) =>
        prev.map((col) =>
          col.id == columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );

      toast.success("Task created");
      logActivity(newTask.id, "create", { title: newTask.title });
      return newTask;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create the task.";
      setError(msg);
      toast.error(msg);
    }
  }

  async function moveTask(
    taskId: string,
    newColumnId: string,
    newOrder: number
  ) {
    const prevColumns = structuredClone(columns);
    try {
      setColumns((prev) => {
        const newColumns = [...prev];

        // Find and remove task from the old column
        let taskToMove: Task | null = null;
        for (const col of newColumns) {
          const taskIndex = col.tasks.findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = col.tasks[taskIndex];
            col.tasks.splice(taskIndex, 1);
            break;
          }
        }

        if (taskToMove) {
          // Add task to new column
          const targetColumn = newColumns.find((col) => col.id === newColumnId);
          if (targetColumn) {
            targetColumn.tasks.splice(newOrder, 0, taskToMove);
          }
        }

        return newColumns;
      });
      await taskService.moveTask(supabase!, taskId, newColumnId, newOrder);

      const fromCol = prevColumns.find(c => c.tasks.some(t => t.id === taskId));
      const toCol = columns.find(c => c.id === newColumnId); // This might be stale? No, columns state isn't updated instantly in var, but 'columns' var is closure.
      // Actually, 'columns' in closure is old state. 'setColumns' updates state.
      // So I should use 'prevColumns' and 'newColumnId'.
      const targetColName = prevColumns.find(c => c.id === newColumnId)?.title;
      const sourceColName = fromCol?.title;

      if (fromCol && fromCol.id !== newColumnId) {
        logActivity(taskId, "move", { from: sourceColName, to: targetColName });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to move task.";
      setError(msg);
      toast.error(msg);
      // Rollback UI to previous state
      console.log("columns", columns);
      console.log("prev", prevColumns);
      setColumns(prevColumns);
    }
  }

  async function createColumn(title: string) {
    if (!board || !user) throw new Error("Board not loaded");

    try {
      const newColumn = await columnService.createColumn(supabase!, {
        title,
        board_id: board.id,
        sort_order: columns.length,
        user_id: user.id,
      });

      setColumns((prev) => [...prev, { ...newColumn, tasks: [] }]);
      toast.success("Column created");
      return newColumn;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create column.";
      setError(msg);
      toast.error(msg);
    }
  }

  async function updateColumn(columnId: string, title: string) {
    try {
      const updatedColumn = await columnService.updateColumnTitle(
        supabase!,
        columnId,
        title
      );

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, ...updatedColumn } : col
        )
      );

      return updatedColumn;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update column.";
      setError(msg);
      toast.error(msg);
    }
  }

  async function deleteRealTask(taskId: string) {
    const prevColumns = structuredClone(columns);
    try {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        }))
      );
      await taskService.deleteTask(supabase!, taskId);
      toast.success("Task deleted");
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task");
      setColumns(prevColumns);
    }
  }

  async function deleteRealColumn(columnId: string) {
    const prevColumns = structuredClone(columns);
    try {
      setColumns((prev) => prev.filter((c) => c.id !== columnId));
      await columnService.deleteColumn(supabase!, columnId);
      toast.success("Column deleted");
    } catch (err) {
      console.error("Failed to delete column:", err);
      toast.error("Failed to delete column");
      setColumns(prevColumns);
    }
  }

  async function updateRealTask(
    taskId: string,
    updates: Partial<Task>
  ) {
    try {
      const updatedTask = await taskService.updateTask(
        supabase!,
        taskId,
        updates
      );

      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ),
        }))
      );

      toast.success("Task updated");

      // Log update
      const oldTask = columns.flatMap(c => c.tasks).find(t => t.id === taskId);
      if (oldTask) {
        const changedFields = Object.keys(updates).filter(k => k !== 'updated_at');
        if (changedFields.length > 0) {
          // Log specific values for important fields
          const details: any = { fields: changedFields };
          if (updates.priority) details.new_priority = updates.priority;
          if (updates.assignee) details.new_assignee = updates.assignee;
          if (updates.title) details.new_title = updates.title;
          if (updates.due_date) details.new_due_date = updates.due_date;

          logActivity(taskId, "update", details);
        }

        // Check for mentions
        if (updates.description && updates.description !== oldTask.description) {
          const mentions = updates.description.match(/@\w+/g);
          if (mentions) {
            logActivity(taskId, "mention", { mentions });
          }
        }
      }

      return updatedTask;
    } catch (err: any) {
      console.error("Failed to update task:", err);
      if (err) {
        console.error("Error Message:", err.message);
        console.error("Error Code:", err.code);
        console.error("Error Details:", err.details);
        console.error("Error Hint:", err.hint);
      }
      toast.error(err?.message || "Failed to update task");
      throw err;
    }
  }

  async function addMember(email: string, role: "owner" | "admin" | "member" | "viewer") {
    if (!board) return;
    try {
      const newMember = await memberService.addMember(supabase!, {
        board_id: board.id,
        user_id: email, // Placeholder for demo
        email: email,
        role: role,
      });
      setMembers((prev) => [...prev, newMember]);
      toast.success("Member added");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add member.";
      setError(msg);
      toast.error(msg);
      throw err;
    }
  }

  async function updateMemberRole(memberId: string, role: "owner" | "admin" | "member" | "viewer") {
    try {
      const updatedMember = await memberService.updateMemberRole(supabase!, memberId, role);
      setMembers((prev) => prev.map(m => m.id === memberId ? updatedMember : m));
      toast.success("Member role updated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update member role.";
      setError(msg);
      toast.error(msg);
      throw err;
    }
  }

  async function removeMember(memberId: string) {
    try {
      await memberService.removeMember(supabase!, memberId);
      setMembers((prev) => prev.filter(m => m.id !== memberId));
      toast.success("Member removed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to remove member.";
      setError(msg);
      toast.error(msg);
      throw err;
    }
  }

  return {
    board,
    columns,
    members,
    setMembers,
    setColumns,
    loading,
    error,
    updateBoard,
    createRealTask,
    moveTask,
    createColumn,
    updateColumn,
    deleteRealTask,
    deleteRealColumn,
    updateRealTask,
    addMember,
    updateMemberRole,
    removeMember,
  };
}
