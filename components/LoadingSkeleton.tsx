export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 animate-pulse">
      <div className="h-48 bg-stone-200 w-full"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-stone-200 rounded w-1/4"></div>
        <div className="h-6 bg-stone-200 rounded w-3/4"></div>
        <div className="h-4 bg-stone-200 rounded w-full"></div>
        <div className="h-4 bg-stone-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailedPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="h-8 bg-stone-200 rounded w-3/4"></div>
      <div className="h-4 bg-stone-200 rounded w-1/4"></div>
      <div className="h-96 bg-stone-200 rounded-xl w-full"></div>
      <div className="space-y-3 pt-4">
        <div className="h-4 bg-stone-200 rounded w-full"></div>
        <div className="h-4 bg-stone-200 rounded w-full"></div>
        <div className="h-4 bg-stone-200 rounded w-5/6"></div>
        <div className="h-4 bg-stone-200 rounded w-4/5"></div>
      </div>
    </div>
  );
}
