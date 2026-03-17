interface SkeletonCardProps {
  variant?: 'news' | 'event' | 'default';
  className?: string;
}

export default function SkeletonCard({ variant = 'default', className = '' }: SkeletonCardProps) {
  if (variant === 'news') {
    return (
      <div className={`bg-white rounded-xl overflow-hidden shadow-md ${className}`}>
        <div className="animate-pulse bg-gray-200 h-48 w-full" />
        <div className="p-6 space-y-3">
          <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded" />
          <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
          <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded" />
          <div className="flex gap-4 mt-4">
            <div className="animate-pulse bg-gray-200 h-4 w-20 rounded" />
            <div className="animate-pulse bg-gray-200 h-4 w-20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'event') {
    return (
      <div className={`bg-white rounded-xl overflow-hidden shadow-md ${className}`}>
        <div className="animate-pulse bg-gray-200 h-48 w-full" />
        <div className="p-6 space-y-3">
          <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded" />
          <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
          <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded" />
          <div className="flex items-center gap-2 mt-4">
            <div className="animate-pulse bg-gray-200 w-5 h-5 rounded-full" />
            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-md ${className}`}>
      <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded mb-4" />
      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
        <div className="animate-pulse bg-gray-200 h-4 w-5/6 rounded" />
        <div className="animate-pulse bg-gray-200 h-4 w-4/6 rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, variant = 'default' }: { count?: number; variant?: 'news' | 'event' | 'default' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} variant={variant} />
      ))}
    </div>
  );
}
