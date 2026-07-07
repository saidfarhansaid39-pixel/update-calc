'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Something went wrong</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-[#1a3a8a] text-white rounded-lg hover:bg-[#0a1d4f] transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
