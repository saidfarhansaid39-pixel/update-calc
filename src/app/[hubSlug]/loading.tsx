export default function HubLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton-pulse h-4 w-48 mb-6 rounded" />

        <div className="skeleton-pulse h-40 w-full rounded-3xl mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-pulse h-20 rounded-xl" />
          ))}
        </div>

        <div className="skeleton-pulse h-5 w-40 mb-6 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft">
              <div className="skeleton-pulse h-12 w-12 rounded-xl mb-4" />
              <div className="skeleton-pulse h-5 w-3/4 mb-3" />
              <div className="skeleton-pulse h-4 w-full mb-2" />
              <div className="skeleton-pulse h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
