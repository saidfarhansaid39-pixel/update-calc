export function MethodologyNote({ lastReviewed }: { lastReviewed: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
      <strong>Methodology:</strong> Calculations follow standard industry formulas.
      Last medically/financially reviewed: {lastReviewed}.
    </div>
  )
}
