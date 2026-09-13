import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerApi } from '@/lib/serverApi'
import NotificationList from './NotificationList'

async function getNotifications(token: string) {
  try {
    const res = await createServerApi(token).get('/notifications')
    return res.data
  } catch {
    return []
  }
}

export default async function NotificationsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const notifications = await getNotifications(token)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your recent notifications and real-time updates
        </p>
      </div>

      <NotificationList initialNotifications={notifications} />
    </div>
  )
}