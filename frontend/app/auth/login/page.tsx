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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError('')
      await api.post('/auth/login', data)
      router.push('/dashboard')
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Login failed. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">FitTrack</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@fittrack.com"
            error={errors.email}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password}
            {...register('password')}
          />

          {serverError && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {serverError}
            </p>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Do not have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}