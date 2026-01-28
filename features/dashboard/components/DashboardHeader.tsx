"use client";

import { HeaderSkeleton } from "@/components/skeletons/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Plus, Folders } from "lucide-react";

interface DashboardHeaderProps {
  onCreateBoard: () => void;
  onCreateWorkspace: () => void;
  loading: boolean;
}

export function DashboardHeader({
  onCreateBoard,
  onCreateWorkspace,
  loading,
}: DashboardHeaderProps) {
  const { user } = useUser();

  if (loading) {
    return <HeaderSkeleton />;
  }

  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome back, {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
        👋
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Here's what's happening with your boards today.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <Button
          className="w-full sm:w-auto cursor-pointer"
          onClick={onCreateBoard}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Board
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto cursor-pointer"
          onClick={onCreateWorkspace}
        >
          <Folders className="w-4 h-4 mr-2" />
          Create Workspace
        </Button>
      </div>
    </div>
  );
}
