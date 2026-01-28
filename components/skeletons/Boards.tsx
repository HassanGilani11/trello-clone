import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BoardsSkeleton() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
          <div className="h-10 w-26 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-22 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-8 w-full bg-gray-200 rounded animate-pulse mb-4 sm:mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="flex justify-between mt-6">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
