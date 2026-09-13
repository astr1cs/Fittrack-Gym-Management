import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

async function getMember(id: string, token: string) {
  const res = await fetch(`${process.env.API_URL}/members/${id}`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) return null
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

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const user = await getMe(token)
  if (user?.role !== 'admin') redirect('/dashboard')

  const member = await getMember(id, token)
  if (!member) notFound()

  const activeMembership = member.memberships?.find((m: any) => m.status === 'active')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{member.user?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{member.user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/members/${member.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Member
          </Link>
          <Link
            href="/members"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Personal Information">
          <dl className="flex flex-col gap-4">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Full Name</dt>
              <dd className="text-sm font-medium text-gray-800">{member.user?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-800">{member.user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Phone</dt>
              <dd className="text-sm font-medium text-gray-800">{member.phone || 'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Date of Birth</dt>
              <dd className="text-sm font-medium text-gray-800">
                {member.date_of_birth
                  ? new Date(member.date_of_birth).toLocaleDateString()
                  : 'N/A'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Joined</dt>
              <dd className="text-sm font-medium text-gray-800">
                {new Date(member.joined_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Membership Status">
          {activeMembership ? (
            <dl className="flex flex-col gap-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Plan</dt>
                <dd className="text-sm font-medium text-gray-800">
                  {activeMembership.plan?.name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Status</dt>
                <dd>
                  <Badge label="Active" variant="success" />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Start Date</dt>
                <dd className="text-sm font-medium text-gray-800">
                  {new Date(activeMembership.start_date).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">End Date</dt>
                <dd className="text-sm font-medium text-gray-800">
                  {new Date(activeMembership.end_date).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Price</dt>
                <dd className="text-sm font-medium text-gray-800">
                  ${activeMembership.plan?.price}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-sm text-gray-400">No active membership</p>
              <Link
                href="/memberships"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Assign a plan
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}