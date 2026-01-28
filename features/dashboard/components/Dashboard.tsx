"use client";

import Navbar from "@/components/layout/Navbar";
import { Board } from "@/lib/supabase/models";
import { useState } from "react";
import { useBoards } from "../hooks/useBoards";
import { usePlan } from "../hooks/usePlan";
import { UpgradeDialog } from "./UpgradeDialog";
import { FilterDialog } from "./FilterDialog";
import { BoardsSection } from "./BoardsSection";
import { StatsSection } from "./StatsSection";
import { DashboardHeader } from "./DashboardHeader";
import { CreateBoardDialog } from "../../boards/components/CreateBoardDialog";
import { ErrorState } from "@/components/common/Error";

export default function Dashboard() {
  const { createBoard, boards, loading, error, refetch } = useBoards();
  const { isFreeUser } = usePlan();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [newBoardColor, setNewBoardColor] = useState("bg-blue-500");

  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
    taskCount: {
      min: null as number | null,
      max: null as number | null,
    },
  });

  const canCreateBoard = !isFreeUser || boards.length < 1;

  function clearFilters() {
    setFilters({
      search: "",
      dateRange: {
        start: null as string | null,
        end: null as string | null,
      },
      taskCount: {
        min: null as number | null,
        max: null as number | null,
      },
    });
  }

  const handleCreateBoardClick = () => {
    if (!canCreateBoard) {
      setShowUpgradeDialog(true);
      return;
    }
    setNewBoardTitle("");
    setNewBoardDescription("");
    setNewBoardColor("bg-blue-500");
    setIsCreateDialogOpen(true);
  };

  const handleCreateBoardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    await createBoard({
      title: newBoardTitle,
      description: newBoardDescription,
      color: newBoardColor,
    });
    setIsCreateDialogOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const filteredBoards = boards.filter((board: Board) => {
    const taskCount = board.totalTasks ?? 0;
    const matchesSearch = board.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesDateRange =
      (!filters.dateRange.start ||
        new Date(board.created_at) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end ||
        new Date(board.created_at) <= new Date(filters.dateRange.end));
    const matchesTaskCount =
      (!filters.taskCount.min || taskCount >= filters.taskCount.min) &&
      (!filters.taskCount.max || taskCount <= filters.taskCount.max);

    return matchesSearch && matchesDateRange && matchesTaskCount;
  });

  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.dateRange.start ? 1 : 0,
    filters.dateRange.end ? 1 : 0,
    filters.taskCount.min !== null ? 1 : 0,
    filters.taskCount.max !== null ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <ErrorState
            title="Error loading boards"
            message={error}
            onRetry={refetch}
            retryText="Reload boards"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <DashboardHeader onCreateBoard={handleCreateBoardClick} loading={loading} />

        <StatsSection boards={boards} loading={loading} />

        <BoardsSection
          boards={filteredBoards}
          loading={loading}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFilterClick={() => setIsFilterOpen(true)}
          onCreateBoard={handleCreateBoardClick}
          activeFilterCount={activeFilterCount}
          isFreeUser={isFreeUser}
          onSearchChange={handleSearchChange}
          searchValue={filters.search}
        />
      </main>
      <FilterDialog
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      <UpgradeDialog
        isOpen={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
      />

      <CreateBoardDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title={newBoardTitle}
        onTitleChange={setNewBoardTitle}
        description={newBoardDescription}
        onDescriptionChange={setNewBoardDescription}
        color={newBoardColor}
        onColorChange={setNewBoardColor}
        onSubmit={handleCreateBoardSubmit}
      />
    </div>
  );
}
