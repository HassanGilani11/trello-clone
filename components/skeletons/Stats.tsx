import { Card, CardContent } from "@/components/ui/card";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}