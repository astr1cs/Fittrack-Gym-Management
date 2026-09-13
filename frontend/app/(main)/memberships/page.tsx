import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import AssignMembershipForm from './AssignMembershipForm'
import CreatePlanForm from './CreatePlanForm'

async function getPlans(token: string) {
  const res = await fetch(`${process.env.API_URL}/memberships/plans`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

async function getMembers(token: string) {
  const res = await fetch(`${process.env.API_URL}/members`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

async function getMe(token: string) {
  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function MembershipsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const user = await getMe(token)
  if (user?.role !== 'admin') redirect('/dashboard')

  const [plans, members] = await Promise.all([
    getPlans(token),
    getMembers(token),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
        <p className="text-sm text-gray-500 mt-1">Manage membership plans and assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan: any) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <Badge label={`$${plan.price}`} variant="info" />
            </div>
            <p className="text-sm text-gray-500">{plan.duration_days} days</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Create New Plan">
          <CreatePlanForm />
        </Card>

        <Card title="Assign Membership to Member">
          <AssignMembershipForm members={members} plans={plans} />
        </Card>
      </div>
    </div>
  )
}