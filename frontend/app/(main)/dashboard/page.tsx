import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerApi } from '@/lib/serverApi'
import AdminDashboard from './AdminDashboard'
import MemberDashboard from './MemberDashboard'
import TrainerDashboard from './TrainerDashboard'

async function getMe(token: string) {
  try {
    const res = await createServerApi(token).get('/auth/me')
    return res.data
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const user = await getMe(token)
  if (!user) redirect('/auth/login')

  if (user.role === 'admin') return <AdminDashboard token={token} user={user} />
  if (user.role === 'member') return <MemberDashboard token={token} user={user} />
  if (user.role === 'trainer') return <TrainerDashboard token={token} user={user} />

  redirect('/auth/login')
}