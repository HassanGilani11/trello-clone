import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BoardColumnsSkeleton() {
  const taskCounts = [0, 2, 1, 0];

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full space-y-4 lg:space-y-0">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="w-full lg:flex-shrink-0 lg:w-80 mt-1">
          <Card className="py-3 gap-2">
            <CardHeader className="border-b py-0">
              <div className="flex items-center justify-between">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-3">
                {Array.from({ length: 0 }).map(
                  (_, taskIndex) => (
                    <Card key={taskIndex}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="space-y-2.5">
                          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                          <div className="flex justify-between">
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
                {/* Show tasks only on large screens */}
                <div className="hidden lg:block">
                  {Array.from({ length: taskCounts[index] }).map(
                    (_, taskIndex) => (
                      <Card key={taskIndex}>
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-2.5">
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                            <div className="flex justify-between">
                              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                              <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
              <div className="h-7 w-24 mx-auto bg-gray-200 rounded animate-pulse mt-3.5" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
