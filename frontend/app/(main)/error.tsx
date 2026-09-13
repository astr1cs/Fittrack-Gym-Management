'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-4">
      <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}