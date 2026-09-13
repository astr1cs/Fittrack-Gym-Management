'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'

export default function DeleteTrainerButton({ trainerId }: { trainerId: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (user?.role !== 'admin') return null

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trainer?')) return
    try {
      setLoading(true)
      await api.delete(`/trainers/${trainerId}`)
      router.refresh()
    } catch {
      alert('Failed to delete trainer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 hover:underline font-medium disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}