'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'

export default function DeleteAnnouncementButton({
  announcementId,
}: {
  announcementId: string
}) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (user?.role !== 'admin') return null

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    try {
      setLoading(true)
      await api.delete(`/announcements/${announcementId}`)
      router.refresh()
    } catch {
      alert('Failed to delete announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 hover:underline font-medium disabled:opacity-50 shrink-0"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}