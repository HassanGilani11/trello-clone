"use client";

import { BoardsSkeleton } from "@/components/skeletons/Boards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Board } from "@/lib/supabase/models";
import { Filter, Grid3X3, List, Plus, Search } from "lucide-react";
import Link from "next/link";

interface BoardsSectionProps {
  boards: Board[];
  loading: boolean;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilterClick?: () => void;
  onCreateBoard: () => void;
  activeFilterCount: number;
  isFreeUser: boolean;
  onSearchChange: (value: string) => void;
  searchValue: string;
  showHeader?: boolean;
  emptyMessage?: string;
}

export function BoardsSection({
  boards,
  loading,
  viewMode,
  onViewModeChange,
  onFilterClick,
  onCreateBoard,
  activeFilterCount,
  isFreeUser,
  onSearchChange,
  searchValue,
  showHeader = true,
  emptyMessage = "No boards yet",
}: BoardsSectionProps) {
  if (loading) {
    return <BoardsSkeleton />;
  }
  return (
    <div className="mb-6 sm:mb-8">
      {showHeader && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your Boards
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your projects and tasks</p>
              {isFreeUser && (
                <p className="text-sm text-gray-500 mt-1">
                  Free Plan: {boards.length}/1 boards used
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border dark:border-gray-700 p-1 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("grid")}
                  className="cursor-pointer"
                >
                  <Grid3X3 />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("list")}
                  className="cursor-pointer"
                >
                  <List />
                </Button>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="py-5 cursor-pointer"
                onClick={onFilterClick}
              >
                <Filter />
                Filter
                {activeFilterCount > 0 && (
                  <Badge variant={"outline"}>{activeFilterCount}</Badge>
                )}
              </Button>
              <Button onClick={onCreateBoard} className="py-5 cursor-pointer" id="create-board-btn">
                <Plus />
                Create Board
              </Button>
            </div>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search Boards..."
              className="pl-10"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Boards Grids/List */}
      {boards.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 italic">{emptyMessage}</p>
          {!showHeader && (
            <Button
              variant="link"
              size="sm"
              onClick={onCreateBoard}
              className="mt-2 text-blue-600 dark:text-blue-400"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create board in this workspace
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {boards.map((board, key) => (
            <Link href={`/boards/${board.id}`} key={key}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-4 h-4 rounded ${board.color} `} />
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {board.title}
                  </CardTitle>
                  <CardDescription className="text-sm mb-4">
                    {board.description}
                  </CardDescription>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500 space-y-1 sm:space-y-0">
                    <span>
                      Created {new Date(board.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      Updated {new Date(board.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Card
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group bg-transparent"
            onClick={onCreateBoard}
          >
            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[150px] box-border">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500 mb-2" />
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Create new board
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          {boards.map((board, key) => (
            <div key={key} className={key > 0 ? "mt-4" : ""}>
              <Link href={`/boards/${board.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-4 h-4 rounded ${board.color} `} />
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {board.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-4">
                      {board.description}
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500 space-y-1 sm:space-y-0">
                      <span>
                        Created{" "}
                        {new Date(board.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        Updated{" "}
                        {new Date(board.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
          <Card
            className="mt-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group"
            onClick={onCreateBoard}
          >
            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
              <p className="text-sm sm:text-base text-gray-600 font-medium group-hover:text-blue-600">
                Create new board
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
