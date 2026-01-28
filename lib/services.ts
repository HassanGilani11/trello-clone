import { Board, BoardMember, Column, Task, Comment, ActivityLog } from "./supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export const boardService = {
  async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (error) {
      console.error("getBoard Error:", error);
      throw error;
    }

    return data;
  },

  async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from("boards")
      .select(
        `
        *,
        columns (
          tasks ( count )
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getBoards Error:", error);
      throw error;
    }

    return (data || []).map((board: Board & { columns?: Array<{ tasks?: Array<{ count: number }> }> }) => {
      const totalTasks =
        board.columns?.reduce(
          (sum: number, col: { tasks?: Array<{ count: number }> }) => sum + (col.tasks?.[0]?.count || 0),
          0
        ) || 0;

      const { columns: _columns, ...boardWithoutColumns } = board;
      return {
        ...boardWithoutColumns,
        totalTasks,
      };
    });
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, "id" | "created_at" | "updated_at">
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    boardId: string,
    updates: Partial<Board>
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", boardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const columnService = {
  async getColumns(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Column[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  },

  async createColumn(
    supabase: SupabaseClient,
    column: Omit<Column, "id" | "created_at">
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateColumnTitle(
    supabase: SupabaseClient,
    columnId: string,
    title: string
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .update({ title })
      .eq("id", columnId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteColumn(supabase: SupabaseClient, columnId: string) {
    const { data, error } = await supabase.from("columns").delete().eq("id", columnId);
    if (error) throw error;
    return data;
  },
};

export const taskService = {
  async getTasksByBoard(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        columns!inner(board_id)
        `
      )
      .eq("columns.board_id", boardId)
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async createTask(
    supabase: SupabaseClient,
    task: Omit<Task, "id" | "created_at" | "updated_at">
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async moveTask(
    supabase: SupabaseClient,
    taskId: string,
    newColumnId: string,
    newOrder: number
  ) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        column_id: newColumnId,
        sort_order: newOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) throw error;
    return data;
  },

  async deleteTask(supabase: SupabaseClient, taskId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);
    if (error) throw error;
    return data;
  },

  async updateTask(
    supabase: SupabaseClient,
    taskId: string,
    updates: Partial<Task>
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const boardDataService = {
  async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
    const [board, columns] = await Promise.all([
      boardService.getBoard(supabase, boardId),
      columnService.getColumns(supabase, boardId),
    ]);

    if (!board) throw new Error("Board not found");

    const tasks = await taskService.getTasksByBoard(supabase, boardId);

    const columnsWithTasks = columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.column_id === column.id),
    }));

    return {
      board,
      columnsWithTasks,
    };
  },

  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      description?: string;
      color?: string;
      userId: string;
      userEmail: string;
    }
  ) {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.description || null,
      color: boardData.color || "bg-blue-500",
      user_id: boardData.userId,
    });

    const defaultColumns = [
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 },
    ];

    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumn(supabase, {
          ...column,
          board_id: board.id,
          user_id: boardData.userId,
        })
      )
    );

    // Add owner to board_members
    await memberService.addMember(supabase, {
      board_id: board.id,
      user_id: boardData.userId,
      role: "owner",
      email: boardData.userEmail || "Owner",
    });

    return board;
  },
};

export const memberService = {
  async getMembers(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<BoardMember[]> {
    const { data, error } = await supabase
      .from("board_members")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addMember(
    supabase: SupabaseClient,
    member: Omit<BoardMember, "id" | "created_at">
  ): Promise<BoardMember> {
    const { data, error } = await supabase
      .from("board_members")
      .upsert(member, { onConflict: "board_id, user_id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMemberRole(
    supabase: SupabaseClient,
    memberId: string,
    role: "owner" | "admin" | "member" | "viewer"
  ): Promise<BoardMember> {
    const { data, error } = await supabase
      .from("board_members")
      .update({ role })
      .eq("id", memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeMember(supabase: SupabaseClient, memberId: string) {
    const { error } = await supabase
      .from("board_members")
      .delete()
      .eq("id", memberId);

    if (error) throw error;
  },
};

export const activityService = {
  async getLogs(supabase: SupabaseClient, taskId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createLog(
    supabase: SupabaseClient,
    log: Omit<ActivityLog, "id" | "created_at">
  ) {
    const { data, error } = await supabase
      .from("activity_logs")
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const commentService = {
  async getComments(supabase: SupabaseClient, taskId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createComment(
    supabase: SupabaseClient,
    comment: Omit<Comment, "id" | "created_at">
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(supabase: SupabaseClient, commentId: string) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;
  },

  async updateComment(
    supabase: SupabaseClient,
    commentId: string,
    content: string
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from("comments")
      .update({ content })
      .eq("id", commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
