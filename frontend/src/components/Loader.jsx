export function Spinner({ className = "" }) {
  return (
    <div className={`flex justify-center items-center py-20 ${className}`}>
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass overflow-hidden animate-pulse">
      <div className="h-60 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-12 bg-white/5 rounded" />
        <div className="h-8 bg-white/10 rounded w-1/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
