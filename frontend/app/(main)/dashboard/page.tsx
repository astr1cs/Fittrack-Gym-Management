import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import MemberDashboard from './MemberDashboard'
import TrainerDashboard from './TrainerDashboard'

async function getMe(token: string) {
  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
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