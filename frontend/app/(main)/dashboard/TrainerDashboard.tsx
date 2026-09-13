import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import Link from 'next/link'
import { createServerApi } from '@/lib/serverApi'

async function getTrainerData(token: string) {
  const api = createServerApi(token)

  const trainerRecord = await api.get('/trainers/me').then((res) => res.data).catch(() => null)

  if (!trainerRecord) return { trainer: null, classes: [], announcements: [] }

  const announcements = await api.get('/announcements').then((res) => res.data).catch(() => [])

  return { trainer: trainerRecord, classes: trainerRecord.classes ?? [], announcements }
}

interface Props {
  token: string
  user: any
}

export default async function TrainerDashboard({ token, user }: Props) {
  const data = await getTrainerData(token)

  const upcomingClasses = data.classes
    .filter((cls: any) => new Date(cls.schedule) > new Date())
    .sort((a: any, b: any) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime())

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user.name}. Here is your schedule overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-500">Specialization</p>
          <div className="mt-2">
            <Badge label={data.trainer?.specialization ?? 'N/A'} variant="info" />
          </div>
        </div>

        <StatCard label="Total Classes" value={data.classes.length} />

        <StatCard label="Upcoming Classes" value={upcomingClasses.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Upcoming Classes">
          {upcomingClasses.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming classes scheduled.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcomingClasses.slice(0, 5).map((cls: any) => (
                <li key={cls.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cls.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(cls.schedule).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/classes/${cls.id}`}
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