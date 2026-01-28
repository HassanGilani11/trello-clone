"use client";

import { StatsSkeleton } from "@/components/skeletons/Stats";
import { Card, CardContent } from "@/components/ui/card";
import { Board } from "@/lib/supabase/models";
import { ChartLine, Rocket, Trello } from "lucide-react";

interface StatsSectionProps {
  boards: Board[];
  loading: boolean;
}

export function StatsSection({ boards, loading }: StatsSectionProps) {
  if (loading) {
    return <StatsSkeleton />;
  }

  const recentActivityCount = boards.filter((board) => {
    const updatedAt = new Date(board.updated_at);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return updatedAt >= oneWeekAgo;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Boards
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {boards.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Trello className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Projects
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {boards.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Recent Activity
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {recentActivityCount}
              </p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <ChartLine className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Boards
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {boards.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Trello className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
