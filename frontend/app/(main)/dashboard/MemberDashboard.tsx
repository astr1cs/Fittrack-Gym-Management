import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import Link from 'next/link'
import { createServerApi } from '@/lib/serverApi'

async function getMemberData(token: string) {
  const api = createServerApi(token)

  const memberRecord = await api.get('/members/me').then((res) => res.data).catch(() => null)

  if (!memberRecord) return { member: null, enrollments: [], announcements: [] }

  const [enrollments, announcements] = await Promise.all([
    api.get(`/classes/member/${memberRecord.id}`).then((res) => res.data).catch(() => []),
    api.get('/announcements').then((res) => res.data).catch(() => []),
  ])

  return { member: memberRecord, enrollments, announcements }
}

interface Props {
  token: string
  user: any
}

export default async function MemberDashboard({ token, user }: Props) {
  const data = await getMemberData(token)
  const activeMembership = data.member?.memberships?.find((m: any) => m.status === 'active')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user.name}. Here is your membership overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Membership Status</p>
          <div className="mt-2">
            {activeMembership ? (
              <Badge label="Active" variant="success" />
            ) : (
              <Badge label="No Active Plan" variant="danger" />
            )}
          </div>
          {activeMembership && (
            <p className="text-xs text-gray-400 mt-2">
              {activeMembership.plan?.name} plan, expires{' '}
              {new Date(activeMembership.end_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <StatCard label="Classes Enrolled" value={data.enrollments.length} />

        <StatCard label="Announcements" value={data.announcements.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Enrolled Classes">
          {data.enrollments.length === 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-400">You are not enrolled in any classes yet.</p>
              <Link href="/classes" className="text-sm text-blue-600 hover:underline font-medium">
                Browse classes
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.enrollments.slice(0, 5).map((enrollment: any) => (
                <li key={enrollment.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {enrollment.class?.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(enrollment.class?.schedule).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/classes/${enrollment.class?.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent Announcements">
          {data.announcements.length === 0 ? (
            <p className="text-sm text-gray-400">No announcements yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.announcements.slice(0, 4).map((announcement: any) => (
                <li key={announcement.id} className="py-3 flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-800">{announcement.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{announcement.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}