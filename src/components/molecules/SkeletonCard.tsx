export const SkeletonCard = () => (
  <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 animate-pulse">
    <div className="h-5 bg-neutral-700/80 rounded-md w-3/4 mb-4"></div>
    <div className="h-4 bg-neutral-700/80 rounded-md w-1/2 mb-6"></div>
    <div className="flex justify-between items-center">
      <div className="h-8 bg-neutral-700/80 rounded-full w-24"></div>
      <div className="h-8 bg-neutral-700/80 rounded-full w-8"></div>
    </div>
  </div>
);