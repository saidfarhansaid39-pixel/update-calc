export const dynamic = 'force-static'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a href="/" className="mt-6 inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity">
        Go Home
      </a>
    </div>
  )
}
