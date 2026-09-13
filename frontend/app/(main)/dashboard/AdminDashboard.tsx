import Card from '@/components/ui/Card'
import Link from 'next/link'

async function getAdminData(token: string) {
  const baseUrl = process.env.API_URL

  const [membersRes, trainersRes, classesRes, plansRes] = await Promise.all([
    fetch(`${baseUrl}/members`, { headers: { Cookie: `token=${token}` }, cache: 'no-store' }),
    fetch(`${baseUrl}/trainers`, { headers: { Cookie: `token=${token}` }, cache: 'no-store' }),
    fetch(`${baseUrl}/classes`, { headers: { Cookie: `token=${token}` }, cache: 'no-store' }),
    fetch(`${baseUrl}/memberships/plans`, { headers: { Cookie: `token=${token}` }, cache: 'no-store' }),
  ])

  const members = membersRes.ok ? await membersRes.json() : []
  const trainers = trainersRes.ok ? await trainersRes.json() : []
  const classes = classesRes.ok ? await classesRes.json() : []
  const plans = plansRes.ok ? await plansRes.json() : []

  return { members, trainers, classes, plans }
}

interface Props {
  token: string
  user: any
}

export default async function AdminDashboard({ token, user }: Props) {
  const data = await getAdminData(token)

  const stats = [
    { label: 'Total Members', value: data.members.length, href: '/members' },
    { label: 'Total Trainers', value: data.trainers.length, href: '/trainers' },
    { label: 'Total Classes', value: data.classes.length, href: '/classes' },
    { label: 'Membership Plans', value: data.plans.length, href: '/memberships' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user.name}. Here is your gym overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.label}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 transition-all cursor-pointer">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Members">
          {data.members.length === 0 ? (
            <p className="text-sm text-gray-400">No members yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.members.slice(0, 5).map((member: any) => (
                <li key={member.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{member.user?.name}</p>
                    <p className="text-xs text-gray-400">{member.user?.email}</p>
                  </div>
                  <Link
                    href={`/members/${member.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent Classes">
          {data.classes.length === 0 ? (
            <p className="text-sm text-gray-400">No classes yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.classes.slice(0, 5).map((cls: any) => (
                <li key={cls.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cls.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(cls.schedule).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {cls.enrollment_count}/{cls.capacity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}