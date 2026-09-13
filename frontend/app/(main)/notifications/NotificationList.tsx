'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import pusher from '@/lib/pusher'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Notification {
  id: string
  message: string
  is_read: boolean
  created_at: string
}

interface Props {
  initialNotifications: Notification[]
}

export default function NotificationList({ initialNotifications }: Props) {
  const { user } = useAuth()
  const { refreshUnreadCount } = useNotifications()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [markingAll, setMarkingAll] = useState(false)

  const refresh = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch {
      // keep showing the last known list if the refetch fails
    }
  }

  useEffect(() => {
    if (!user) return

    const announcementChannel = pusher.subscribe('announcements')
    announcementChannel.bind('new-announcement', refresh)

    let trainerChannelName: string | null = null
    if (user.role === 'trainer') {
      api
        .get('/trainers/me')
        .then((res) => {
          trainerChannelName = `trainer-${res.data.id}`
          const trainerChannel = pusher.subscribe(trainerChannelName)
          trainerChannel.bind('new-enrollment', refresh)
        })
        .catch(() => {})
    }

    return () => {
      announcementChannel.unbind('new-announcement', refresh)
      if (trainerChannelName) {
        pusher.channel(trainerChannelName)?.unbind('new-enrollment', refresh)
      }
    }
  }, [user])

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      await refreshUnreadCount()
    } catch {
      alert('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true)
      await api.patch('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      await refreshUnreadCount()
    } catch {
      alert('Failed to mark all as read')
    } finally {
      setMarkingAll(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-800">
            All Notifications
          </h2>
          {unreadCount > 0 && (
            <Badge label={`${unreadCount} unread`} variant="info" />
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" loading={markingAll} onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl border shadow-sm p-4 flex items-start justify-between gap-4 transition-all
                ${notification.is_read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
            >
              <div className="flex flex-col gap-1">
                <p className={`text-sm ${notification.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {!notification.is_read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-blue-600 hover:underline font-medium shrink-0"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}