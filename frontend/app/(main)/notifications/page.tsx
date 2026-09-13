import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NotificationList from './NotificationList'

async function getNotifications(token: string) {
  const res = await fetch(`${process.env.API_URL}/notifications`, {
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

async function getTrainerByUserId(userId: string, token: string) {
  const res = await fetch(`${process.env.API_URL}/trainers`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const trainers = await res.json()
  return trainers.find((t: any) => t.user?.id === userId) ?? null
}

export default async function NotificationsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const user = await getMe(token)
  const notifications = await getNotifications(token)

  let trainerId: string | undefined = undefined
  if (user?.role === 'trainer') {
    const trainer = await getTrainerByUserId(user.id, token)
    trainerId = trainer?.id
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your recent notifications and real-time updates
        </p>
      </div>

      <NotificationList
        initialNotifications={notifications}
        userId={user?.id}
        trainerId={trainerId}
      />
    </div>
  )
}