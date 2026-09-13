import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import CreateClassModal from './CreateClassModal'
import DeleteClassButton from './DeleteClassButton'

async function getClasses(token: string) {
  const res = await fetch(`${process.env.API_URL}/classes`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

async function getTrainers(token: string) {
  const res = await fetch(`${process.env.API_URL}/trainers`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

async function getMe(token: string) {
  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ClassesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const [classes, trainers, user] = await Promise.all([
    getClasses(token),
    getTrainers(token),
    getMe(token),
  ])

  const isAdmin = user?.role === 'admin'

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'trainer', label: 'Trainer' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all gym classes</p>
        </div>
        {isAdmin && <CreateClassModal trainers={trainers} />}
      </div>

      <Table columns={columns} empty="No classes found">
        {classes.map((cls: any) => (
          <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 font-medium text-gray-800">{cls.title}</td>
            <td className="px-6 py-4 text-gray-500">{cls.trainer?.user?.name}</td>
            <td className="px-6 py-4 text-gray-500">
              {new Date(cls.schedule).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </td>
            <td className="px-6 py-4 text-gray-500">
              {cls.enrollment_count}/{cls.capacity}
            </td>
            <td className="px-6 py-4">
              {cls.spots_left === 0 ? (
                <Badge label="Full" variant="danger" />
              ) : (
                <Badge label={`${cls.spots_left} spots left`} variant="success" />
              )}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/classes/${cls.id}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View
                </Link>
                {isAdmin && (
                  <Link
                    href={`/classes/${cls.id}/edit`}
                    className="text-sm text-gray-600 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                )}
                <DeleteClassButton classId={cls.id} />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}