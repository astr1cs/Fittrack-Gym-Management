import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
}

interface TableProps {
  columns: Column[]
  children: ReactNode
  empty?: string
}

export default function Table({ columns, children, empty = 'No data found' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {children ?? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}