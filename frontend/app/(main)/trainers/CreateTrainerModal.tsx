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
const trainerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  specialization: z.string().min(2, 'Specialization is required'),
  bio: z.string().optional(),
})

type TrainerForm = z.infer<typeof trainerSchema>

export default function CreateTrainerModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [serverError, setServerError] = useState('')
  const { user } = useAuth()
  if (user?.role !== 'admin') return null
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TrainerForm>({
    resolver: zodResolver(trainerSchema),
  })

  const onSubmit = async (data: TrainerForm) => {
    try {
      setServerError('')
      await api.post('/trainers', data)
      reset()
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Failed to create trainer')
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Trainer</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Trainer"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Smith"
            error={errors.name}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@fittrack.com"
            error={errors.email}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            error={errors.password}
            {...register('password')}
          />
          <Input
            label="Specialization"
            type="text"
            placeholder="e.g. Cardio, Strength, Yoga"
            error={errors.specialization}
            {...register('specialization')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Short trainer bio"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {serverError && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {serverError}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={isSubmitting}>
              Create Trainer
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}