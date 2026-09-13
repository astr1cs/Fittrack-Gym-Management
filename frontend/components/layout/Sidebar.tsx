'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const allLinks = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'member', 'trainer'] },
  { href: '/members', label: 'Members', roles: ['admin'] },
  { href: '/trainers', label: 'Trainers', roles: ['admin'] },
  { href: '/memberships', label: 'Memberships', roles: ['admin'] },
  { href: '/classes', label: 'Classes', roles: ['admin', 'member', 'trainer'] },
  { href: '/announcements', label: 'Announcements', roles: ['admin', 'member', 'trainer'] },
  { href: '/notifications', label: 'Notifications', roles: ['member', 'trainer'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const links = allLinks.filter(
    (link) => user?.role && link.roles.includes(user.role)
  )

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white tracking-tight">FitTrack</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
          Gym Management
        </p>
      </div>
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-700">
        {user && (
          <div className="flex flex-col gap-1 mb-3">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        )}
      </div>
    </aside>
  )
}