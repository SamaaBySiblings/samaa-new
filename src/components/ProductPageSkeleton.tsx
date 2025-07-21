export default function ProductPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-72 bg-gray-200 rounded" />
      <div className="h-6 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="space-y-2 pt-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="h-8 w-32 bg-gray-300 rounded mt-6" />
    </div>
  );
}
