import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { createServerApi } from '@/lib/serverApi'
import EnrollButton from './EnrollButton'

async function getClass(id: string, token: string) {
  try {
    const res = await createServerApi(token).get(`/classes/${id}`)
    return res.data
  } catch {
    return null
  }
}

async function getMe(token: string) {
  try {
    const res = await createServerApi(token).get('/auth/me')
    return res.data
  } catch {
    return null
  }
}

async function getMemberRecord(token: string) {
  try {
    const res = await createServerApi(token).get('/members/me')
    return res.data
  } catch {
    return null
  }
}

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const [cls, user] = await Promise.all([
    getClass(id, token),
    getMe(token),
  ])

  if (!cls) notFound()

  const isAdmin = user?.role === 'admin'
  const isMember = user?.role === 'member'

let memberRecord = null
if (isMember) {
  memberRecord = await getMemberRecord(token)
}

  const isEnrolled = cls.enrollments?.some(
    (e: any) => e.member?.user?.id === user?.id
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cls.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {cls.description || 'No description provided'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href={`/classes/${cls.id}/enrollments`}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium"
            >
              View Enrollments
            </Link>
          )}
          <Link
            href="/classes"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Class Information">
          <dl className="flex flex-col gap-4">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Trainer</dt>
              <dd className="text-sm font-medium text-gray-800">
                {cls.trainer?.user?.name}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Specialization</dt>
              <dd>
                <Badge label={cls.trainer?.specialization} variant="info" />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Schedule</dt>
              <dd className="text-sm font-medium text-gray-800">
                {new Date(cls.schedule).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Capacity</dt>
              <dd className="text-sm font-medium text-gray-800">
                {cls.enrollment_count}/{cls.capacity} enrolled
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Availability</dt>
              <dd>
                {cls.spots_left === 0 ? (
                  <Badge label="Full" variant="danger" />
                ) : (
                  <Badge label={`${cls.spots_left} spots left`} variant="success" />
                )}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Enrollment">
          <div className="flex flex-col gap-4">
            {isMember && (
              <>
                {isEnrolled ? (
                  <p className="text-sm text-green-600 font-medium">
                    You are currently enrolled in this class.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    You are not enrolled in this class yet.
                  </p>
                )}
                {memberRecord && (
                  <EnrollButton
                    classId={cls.id}
                    memberId={memberRecord.id}
                    isEnrolled={isEnrolled}
                  />
                )}
              </>
            )}

            {isAdmin && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Total enrolled: {cls.enrollment_count} of {cls.capacity}
                </p>
                <Link
                  href={`/classes/${cls.id}/enrollments`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View all enrollments
                </Link>
              </div>
            )}

            {user?.role === 'trainer' && (
              <p className="text-sm text-gray-500">
                This class has {cls.enrollment_count} enrolled members.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}