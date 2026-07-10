export default function CalculatorLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton-pulse h-4 w-64 mb-6 rounded" />

        <div className="skeleton-pulse h-8 w-2/3 mb-3 rounded" />
        <div className="skeleton-pulse h-4 w-full max-w-2xl mb-8 rounded" />

        <div className="skeleton-pulse h-10 w-full max-w-xl mb-8 rounded-2xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="skeleton-pulse h-5 w-1/3 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-pulse h-10 w-full rounded" />
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm space-y-3 flex flex-col justify-center">
            <div className="skeleton-pulse h-5 w-1/4 rounded" />
            <div className="skeleton-pulse h-24 w-full rounded" />
            <div className="skeleton-pulse h-4 w-1/2 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
