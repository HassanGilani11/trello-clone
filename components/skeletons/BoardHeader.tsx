export function BoardHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
