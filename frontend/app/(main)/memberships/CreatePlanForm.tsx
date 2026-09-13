'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/axios'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const planSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  duration_days: z.coerce.number().min(1, 'Duration must be at least 1 day'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
})

type PlanForm = z.infer<typeof planSchema>

export default function CreatePlanForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
  })

  const onSubmit = async (data: PlanForm) => {
    try {
      setServerError('')
      setSuccess('')
      await api.post('/memberships/plans', data)
      setSuccess('Plan created successfully')
      reset()
      router.refresh()
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Failed to create plan')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Plan Name"
        type="text"
        placeholder="e.g. Basic, Standard, Premium"
        error={errors.name}
        {...register('name')}
      />
      <Input
        label="Duration (days)"
        type="number"
        placeholder="e.g. 30, 90, 365"
        error={errors.duration_days}
        {...register('duration_days')}
      />
      <Input
        label="Price ($)"
        type="number"
        placeholder="e.g. 29.99"
        error={errors.price}
        {...register('price')}
      />

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{success}</p>
      )}

      <Button type="submit" loading={isSubmitting}>
        Create Plan
      </Button>
    </form>
  )
}