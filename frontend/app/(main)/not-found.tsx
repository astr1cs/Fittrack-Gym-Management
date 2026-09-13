import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <h2 className="text-4xl font-bold text-gray-800">404</h2>
      <p className="text-gray-500">The page you are looking for does not exist.</p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}