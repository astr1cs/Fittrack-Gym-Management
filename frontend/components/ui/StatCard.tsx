import Link from 'next/link'

interface StatCardProps {
  label: string
  value: string | number
  href?: string
}

export default function StatCard({ label, value, href }: StatCardProps) {
  const content = (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6${
        href ? ' hover:border-blue-300 transition-all cursor-pointer' : ''
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
