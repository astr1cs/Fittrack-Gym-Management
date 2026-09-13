'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/axios'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
})

type AnnouncementForm = z.infer<typeof announcementSchema>

export default function CreateAnnouncementForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
  })

  if (user?.role !== 'admin') return null

  const onSubmit = async (data: AnnouncementForm) => {
    try {
      setServerError('')
      setSuccess('')
      await api.post('/announcements', data)
      setSuccess('Announcement posted successfully')
      reset()
      router.refresh()
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Failed to post announcement')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Title"
        type="text"
        placeholder="Announcement title"
        error={errors.title}
        {...register('title')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Content</label>
        <textarea
          {...register('content')}
          rows={4}
          placeholder="Write your announcement here..."
          className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none
            ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{success}</p>
      )}

      <Button type="submit" loading={isSubmitting}>
        Post Announcement
      </Button>
    </form>
  )
}