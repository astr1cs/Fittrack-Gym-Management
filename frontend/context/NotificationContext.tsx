'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import api from '@/lib/axios'
import pusher from '@/lib/pusher'
import { useAuth } from '@/context/AuthContext'

interface NotificationContextType {
  unreadCount: number
  refreshUnreadCount: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => {},
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/notifications/unread-count')
      setUnreadCount(res.data.unread_count)
    } catch {
      // keep showing the last known count if the refetch fails
    }
  }, [])

  useEffect(() => {
    if (!user) return
    refreshUnreadCount()
  }, [user, refreshUnreadCount])

  useEffect(() => {
    if (!user) return

    const announcementChannel = pusher.subscribe('announcements')
    announcementChannel.bind('new-announcement', refreshUnreadCount)

    let trainerChannelName: string | null = null
    if (user.role === 'trainer') {
      api
        .get('/trainers/me')
        .then((res) => {
          trainerChannelName = `trainer-${res.data.id}`
          const trainerChannel = pusher.subscribe(trainerChannelName)
          trainerChannel.bind('new-enrollment', refreshUnreadCount)
        })
        .catch(() => {})
    }

    return () => {
      announcementChannel.unbind('new-announcement', refreshUnreadCount)
      if (trainerChannelName) {
        pusher.channel(trainerChannelName)?.unbind('new-enrollment', refreshUnreadCount)
      }
    }
  }, [user, refreshUnreadCount])

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
