import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Card from '@/components/ui/Card'
import CreateAnnouncementForm from './CreateAnnouncementForm'
import DeleteAnnouncementButton from './DeleteAnnouncementButton'

async function getAnnouncements(token: string) {
  const res = await fetch(`${process.env.API_URL}/announcements`, {
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

export default async function AnnouncementsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const [announcements, user] = await Promise.all([
    getAnnouncements(token),
    getMe(token),
  ])

  const isAdmin = user?.role === 'admin'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gym-wide announcements for all members
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${isAdmin ? 'lg:grid-cols-3' : ''}`}>
        <div className={`flex flex-col gap-4 ${isAdmin ? 'lg:col-span-2' : ''}`}>
          {announcements.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-400">No announcements yet.</p>
            </div>
          ) : (
            announcements.map((announcement: any) => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Posted by {announcement.created_by?.name} on{' '}
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <DeleteAnnouncementButton announcementId={announcement.id} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {announcement.content}
                </p>
              </div>
            ))
          )}
        </div>

        {isAdmin && (
          <div>
            <Card title="Post Announcement">
              <CreateAnnouncementForm />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}