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

const memberUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(5, 'Phone must be at least 5 digits'),
  date_of_birth: z.string().optional(),
})

type MemberUpdateForm = z.infer<typeof memberUpdateSchema>

export default function EditMemberPage() {
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
  } = useForm<MemberUpdateForm>({
    resolver: zodResolver(memberUpdateSchema),
  })

  useEffect(() => {
    api.get(`/members/${id}`).then((res) => {
      const m = res.data
      reset({
        name: m.user?.name ?? '',
        phone: m.phone ?? '',
        date_of_birth: m.date_of_birth
          ? new Date(m.date_of_birth).toISOString().split('T')[0]
          : '',
      })
      setLoading(false)
    })
  }, [id, reset])

  const onSubmit = async (data: MemberUpdateForm) => {
    try {
      setServerError('')
      await api.patch(`/members/${id}`, data)
      router.push(`/members/${id}`)
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Member</h1>
        <p className="text-sm text-gray-500 mt-1">Update member profile information</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            error={errors.name}
            {...register('name')}
          />
          <Input
            label="Phone"
            type="text"
            error={errors.phone}
            {...register('phone')}
          />
          <Input
            label="Date of Birth"
            type="date"
            error={errors.date_of_birth}
            {...register('date_of_birth')}
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
              onClick={() => router.push(`/members/${id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}