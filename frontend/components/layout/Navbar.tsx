'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'

export default function Navbar() {
  const router = useRouter()
  const { user } = useAuth()
  const { unreadCount } = useNotifications()

  const handleLogout = async () => {
    await api.post('/auth/logout')
    router.push('/auth/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <p className="text-sm text-gray-500">
        Welcome back,{' '}
        <span className="font-medium text-gray-800">{user?.name ?? '...'}</span>
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="relative text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <div className="w-px h-4 bg-gray-300" />
        <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full">
          {user?.role}
        </span>
        <div className="w-px h-4 bg-gray-300" />
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}