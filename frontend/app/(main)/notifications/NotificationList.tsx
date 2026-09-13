'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import pusher from '@/lib/pusher'
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
  userId: string
  trainerId?: string
}

export default function NotificationList({
  initialNotifications,
  userId,
  trainerId,
}: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [markingAll, setMarkingAll] = useState(false)



  
  useEffect(() => {
    if (!trainerId) return

    const channel = pusher.subscribe(`trainer-${trainerId}`)

    channel.bind('new-enrollment', (data: { className: string; memberName: string }) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: `${data.memberName} enrolled in ${data.className}`,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      setNotifications((prev) => [newNotification, ...prev])
    })

    const announcementChannel = pusher.subscribe('announcements')

    announcementChannel.bind('new-announcement', (data: { title: string }) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: `New announcement: ${data.title}`,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      setNotifications((prev) => [newNotification, ...prev])
    })

    return () => {
      pusher.unsubscribe(`trainer-${trainerId}`)
      pusher.unsubscribe('announcements')
    }
  }, [trainerId])

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    } catch {
      alert('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true)
      await api.patch('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
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
                <p
                  className={`text-sm ${
                    notification.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'
                  }`}
                >
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