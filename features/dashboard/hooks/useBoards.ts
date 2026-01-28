"use client";

import { boardDataService, boardService } from "@/lib/services";
import { Board } from "@/lib/supabase/models";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useBoards() {
  const { user } = useUser();
  const { supabase, isLoaded } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isLoaded && supabase) {
      loadBoards();
    }
  }, [user, isLoaded]);

  async function loadBoards() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      console.error("Error loading boards:", err);
      setError((err as any).message || "Failed to load boards.");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
    workspaceId?: string;
  }) {
    if (!user) throw new Error("User not authenticated");

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          description: boardData.description,
          userId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress || user.id,
        }
      );
      setBoards((prev) => [newBoard, ...prev]);
      toast.success("Board created successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create board.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  const refetch = () => {
    loadBoards();
  };

  return { boards, loading, error, createBoard, refetch };
}
