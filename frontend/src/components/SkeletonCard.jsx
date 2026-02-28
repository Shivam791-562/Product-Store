function SkeletonCard() {
  return (
    <div className="card w-full bg-base-100 shadow-xl p-4 space-y-4">
      {/* Image Skeleton */}
      <div className="skeleton h-48 w-full rounded-xl"></div>
      
      {/* Content Skeleton */}
      <div className="space-y-2 mt-4">
        <div className="skeleton h-6 w-3/4"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="skeleton h-8 w-1/4"></div>
          <div className="flex space-x-2">
            <div className="skeleton h-10 w-10 rounded-full"></div>
            <div className="skeleton h-10 w-10 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;