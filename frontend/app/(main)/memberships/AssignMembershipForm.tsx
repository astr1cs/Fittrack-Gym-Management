'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/axios'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const assignSchema = z.object({
  member_id: z.string().min(1, 'Please select a member'),
  plan_id: z.string().min(1, 'Please select a plan'),
  start_date: z.string().min(1, 'Start date is required'),
})

type AssignForm = z.infer<typeof assignSchema>

interface Props {
  members: any[]
  plans: any[]
}

export default function AssignMembershipForm({ members, plans }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignForm>({
    resolver: zodResolver(assignSchema),
  })

  const onSubmit = async (data: AssignForm) => {
    try {
      setServerError('')
      setSuccess('')
      await api.post('/memberships/assign', data)
      setSuccess('Membership assigned successfully')
         reset()
      router.refresh()
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Failed to assign membership')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Member</label>
        <select
          {...register('member_id')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a member</option>
          {members.map((member: any) => (
            <option key={member.id} value={member.id}>
              {member.user?.name} ({member.user?.email})
            </option>
          ))}
        </select>
        {errors.member_id && (
          <p className="text-xs text-red-500">{errors.member_id.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Plan</label>
        <select
          {...register('plan_id')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a plan</option>
          {plans.map((plan: any) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} — ${plan.price} / {plan.duration_days} days
            </option>
          ))}
        </select>
        {errors.plan_id && (
          <p className="text-xs text-red-500">{errors.plan_id.message}</p>
        )}
      </div>

      <Input
        label="Start Date"
        type="date"
        error={errors.start_date}
        {...register('start_date')}
      />

      {serverError && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{success}</p>
      )}

      <Button type="submit" loading={isSubmitting}>
        Assign Membership
      </Button>
    </form>
  )
}