import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Table from '@/components/ui/Table'
import { createServerApi } from '@/lib/serverApi'

async function getEnrollments(classId: string, token: string) {
  try {
    const res = await createServerApi(token).get(`/classes/${classId}/enrollments`)
    return res.data
  } catch {
    return []
  }
}

async function getClass(classId: string, token: string) {
  try {
    const res = await createServerApi(token).get(`/classes/${classId}`)
    return res.data
  } catch {
    return null
  }
}

export default async function EnrollmentsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const [enrollments, cls] = await Promise.all([
    getEnrollments(id, token),
    getClass(id, token),
  ])

  if (!cls) notFound()

  const columns = [
    { key: 'name', label: 'Member Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'enrolled_at', label: 'Enrolled At' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Enrollments: {cls.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {enrollments?.length ?? 0} of {cls.capacity} spots filled
          </p>
        </div>
        <Link
          href={`/classes/${id}`}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium"
        >
          Back to Class
        </Link>
      </div>

      <Table columns={columns} empty="No enrollments yet">
        {enrollments?.map((enrollment: any) => (
          <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 font-medium text-gray-800">
              {enrollment.member?.user?.name}
            </td>
            <td className="px-6 py-4 text-gray-500">
              {enrollment.member?.user?.email}
            </td>
            <td className="px-6 py-4 text-gray-500">
              {enrollment.member?.phone || 'N/A'}
            </td>
            <td className="px-6 py-4 text-gray-500">
              {new Date(enrollment.enrolled_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}