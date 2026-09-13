'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import api from '@/lib/axios'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError('')
      const { confirmPassword, ...rest } = data
      await api.post('/auth/register', { ...rest, role: 'member' })
      router.push('/auth/login')
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">FitTrack</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new member account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
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
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword}
            {...register('confirmPassword')}
          />

          {serverError && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {serverError}
            </p>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}