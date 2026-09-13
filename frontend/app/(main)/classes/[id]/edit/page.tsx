'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/axios'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'

const classSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  schedule: z.string().min(1, 'Schedule is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
})

type ClassForm = z.infer<typeof classSchema>

export default function EditClassPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassForm>({
    resolver: zodResolver(classSchema),
  })

  useEffect(() => {
    api.get(`/classes/${id}`).then((res) => {
      const cls = res.data
      reset({
        title: cls.title,
        description: cls.description ?? '',
        schedule: new Date(cls.schedule).toISOString().slice(0, 16),
        capacity: cls.capacity,
      })
      setLoading(false)
    })
  }, [id, reset])
const { user } = useAuth()

useEffect(() => {
  if (user && user.role !== 'admin') {
    router.push('/dashboard')
  }
}, [user, router])
  const onSubmit = async (data: ClassForm) => {
    try {
      setServerError('')
      await api.patch(`/classes/${id}`, {
        ...data,
        schedule: new Date(data.schedule).toISOString(),
      })
      router.push(`/classes/${id}`)
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Update failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Class</h1>
        <p className="text-sm text-gray-500 mt-1">Update class information</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Class Title"
            type="text"
            error={errors.title}
            {...register('title')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <Input
            label="Schedule"
            type="datetime-local"
            error={errors.schedule}
            {...register('schedule')}
          />

          <Input
            label="Capacity"
            type="number"
            error={errors.capacity}
            {...register('capacity')}
          />

          {serverError && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {serverError}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/classes/${id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}