"use client";

import { workspaceService } from "@/lib/services";
import { Workspace } from "@/lib/supabase/models";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useWorkspaces() {
    const { user } = useUser();
    const { supabase, isLoaded } = useSupabase();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && isLoaded && supabase) {
            loadWorkspaces();
        }
    }, [user, isLoaded]);

    async function loadWorkspaces() {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const data = await workspaceService.getWorkspaces(supabase!, user.id);
            setWorkspaces(data);
        } catch (err) {
            console.error("Error loading workspaces:", err);
            setError((err as any).message || "Failed to load workspaces.");
        } finally {
            setLoading(false);
        }
    }

    async function createWorkspace(workspaceData: {
        name: string;
        slug?: string;
    }) {
        if (!user) throw new Error("User not authenticated");

        try {
            const newWorkspace = await workspaceService.createWorkspace(
                supabase!,
                {
                    name: workspaceData.name,
                    slug: workspaceData.slug || null,
                    owner_id: user.id,
                },
                user.primaryEmailAddress?.emailAddress || user.id
            );
            setWorkspaces((prev) => [newWorkspace, ...prev]);
            toast.success("Workspace created successfully");
            return newWorkspace;
        } catch (err) {
            console.error("Error creating workspace:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to create workspace.";
            toast.error(errorMessage);
            throw err;
        }
    }

    const refetch = () => {
        loadWorkspaces();
    };

    return { workspaces, loading, error, createWorkspace, refetch };
}
