'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import Button from '@/components/ui/Button'

interface Props {
  classId: string
  memberId: string
  isEnrolled: boolean
}

export default function EnrollButton({ classId, memberId, isEnrolled }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    try {
      setLoading(true)
      await api.post(`/classes/${classId}/enroll`, { member_id: memberId })
      router.refresh()
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to enroll')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel your enrollment in this class?')) return
    try {
      setLoading(true)
      await api.delete(`/classes/${classId}/enroll`, { data: { member_id: memberId } })
      router.refresh()
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to cancel enrollment')
    } finally {
      setLoading(false)
    }
  }

  return isEnrolled ? (
    <Button variant="danger" loading={loading} onClick={handleCancel}>
      Cancel Enrollment
    </Button>
  ) : (
    <Button loading={loading} onClick={handleEnroll}>
      Enroll Now
    </Button>
  )
}