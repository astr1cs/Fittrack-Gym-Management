'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const classSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  trainer_id: z.string().min(1, 'Please select a trainer'),
  schedule: z.string().min(1, 'Schedule is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
})

type ClassForm = z.infer<typeof classSchema>

interface Props {
  trainers: any[]
}

export default function CreateClassModal({ trainers }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [serverError, setServerError] = useState('')

  if (user?.role !== 'admin') return null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassForm>({
    resolver: zodResolver(classSchema),
  })

  const onSubmit = async (data: ClassForm) => {
    try {
      setServerError('')
      await api.post('/classes', {
        ...data,
        schedule: new Date(data.schedule).toISOString(),
      })
      reset()
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Failed to create class')
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Class</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Class">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Class Title"
            type="text"
            placeholder="e.g. Morning Yoga"
            error={errors.title}
            {...register('title')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Short description of the class"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Trainer</label>
            <select
              {...register('trainer_id')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a trainer</option>
              {trainers.map((trainer: any) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.user?.name} ({trainer.specialization})
                </option>
              ))}
            </select>
            {errors.trainer_id && (
              <p className="text-xs text-red-500">{errors.trainer_id.message}</p>
            )}
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
            placeholder="e.g. 20"
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
              Create Class
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}