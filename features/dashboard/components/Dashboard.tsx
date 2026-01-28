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
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import { ErrorState } from "@/components/common/Error";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { Workspace } from "@/lib/supabase/models";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Folders, Plus, Grid3X3, List, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";

export default function Dashboard() {
  const { createBoard, boards, loading: boardsLoading, error: boardsError, refetch: refetchBoards } = useBoards();
  const { workspaces, createWorkspace, loading: workspacesLoading, error: workspacesError } = useWorkspaces();
  const { isFreeUser } = usePlan();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | undefined>(undefined);

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

  const handleCreateWorkspace = async (data: { name: string; slug: string }) => {
    await createWorkspace(data);
  };

  const openCreateBoardForWorkspace = (workspaceId?: string) => {
    setActiveWorkspaceId(workspaceId);
    handleCreateBoardClick();
  };

  const handleCreateBoardSubmitWithWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    await createBoard({
      title: newBoardTitle,
      description: newBoardDescription,
      color: newBoardColor,
      workspaceId: activeWorkspaceId,
    });
    setIsCreateDialogOpen(false);
    setActiveWorkspaceId(undefined);
  };

  if (boardsError || (workspacesError && !workspaces.length && workspacesLoading === false)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <ErrorState
            title="Error loading dashboard"
            message={boardsError || workspacesError || "An error occurred"}
            onRetry={() => {
              refetchBoards();
              // useWorkspaces refetch is not exported but useEffect handles it
            }}
            retryText="Reload Dashboard"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <DashboardHeader
          onCreateBoard={handleCreateBoardClick}
          onCreateWorkspace={() => setIsCreateWorkspaceOpen(true)}
          loading={boardsLoading || workspacesLoading}
        />

        <StatsSection boards={boards} loading={boardsLoading} />

        <div className="mt-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    All Boards
                  </TabsTrigger>
                  <TabsTrigger value="workspaces" className="flex items-center gap-2">
                    <Folders className="w-4 h-4" />
                    Workspaces
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border dark:border-gray-700 p-1 rounded-md h-9">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-7 w-8 p-0 cursor-pointer"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-7 w-8 p-0 cursor-pointer"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 h-9"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1 min-w-[20px] justify-center text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Global Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search across all boards..."
                  className="pl-10 h-11 bg-white dark:bg-gray-800/50"
                  value={filters.search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="all" className="mt-0 space-y-8">
              <BoardsSection
                boards={filteredBoards}
                loading={boardsLoading}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onCreateBoard={() => openCreateBoardForWorkspace()}
                activeFilterCount={activeFilterCount}
                isFreeUser={isFreeUser}
                onSearchChange={handleSearchChange}
                searchValue={filters.search}
              />
            </TabsContent>

            <TabsContent value="workspaces" className="mt-0 space-y-12">
              {workspaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Folders className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Workspaces Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Create a workspace to group your boards and collaborate.</p>
                  <Button onClick={() => setIsCreateWorkspaceOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Workspace
                  </Button>
                </div>
              ) : (
                <div className="space-y-12">
                  {workspaces.map((ws) => {
                    const wsBoards = filteredBoards.filter(b => b.workspace_id === ws.id);
                    return (
                      <div key={ws.id} className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{ws.name}</h2>
                            <p className="text-sm text-gray-500">{wsBoards.length} boards in this workspace</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCreateBoardForWorkspace(ws.id)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Board
                          </Button>
                        </div>
                        <BoardsSection
                          boards={wsBoards}
                          loading={boardsLoading}
                          viewMode={viewMode}
                          onViewModeChange={setViewMode}
                          onFilterClick={() => setIsFilterOpen(true)}
                          onCreateBoard={() => openCreateBoardForWorkspace(ws.id)}
                          activeFilterCount={activeFilterCount}
                          isFreeUser={isFreeUser}
                          onSearchChange={handleSearchChange}
                          searchValue={filters.search}
                          showHeader={false}
                          emptyMessage="This workspace doesn't have any boards yet."
                        />
                      </div>
                    );
                  })}

                  {/* Personal Boards Section (Boards with no workspace) */}
                  {filteredBoards.some(b => !b.workspace_id) && (
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Boards</h2>
                          <p className="text-sm text-gray-500">Boards not assigned to any workspace</p>
                        </div>
                      </div>
                      <BoardsSection
                        boards={filteredBoards.filter(b => !b.workspace_id)}
                        loading={boardsLoading}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        onFilterClick={() => setIsFilterOpen(true)}
                        onCreateBoard={() => openCreateBoardForWorkspace()}
                        activeFilterCount={activeFilterCount}
                        isFreeUser={isFreeUser}
                        onSearchChange={handleSearchChange}
                        searchValue={filters.search}
                        showHeader={false}
                        emptyMessage="You don't have any personal boards."
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
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

      <CreateWorkspaceDialog
        isOpen={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        onSubmit={handleCreateWorkspace}
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
        onSubmit={handleCreateBoardSubmitWithWorkspace}
      />
    </div>
  );
}
