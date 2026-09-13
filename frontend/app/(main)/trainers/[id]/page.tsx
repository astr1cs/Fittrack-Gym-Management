import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

async function getTrainer(id: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainers/${id}`, {
    headers: { Cookie: `token=${token}` },
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json()
}

export default async function TrainerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const trainer = await getTrainer(id, token)
  if (!trainer) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{trainer.user?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{trainer.user?.email}</p>
        </div>
        <Link
          href="/trainers"
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium"
        >
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Trainer Information">
          <dl className="flex flex-col gap-4">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Full Name</dt>
              <dd className="text-sm font-medium text-gray-800">{trainer.user?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-800">{trainer.user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Specialization</dt>
              <dd>
                <Badge label={trainer.specialization} variant="info" />
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-gray-500">Bio</dt>
              <dd className="text-sm text-gray-800 mt-1">
                {trainer.bio || 'No bio provided'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Assigned Classes">
          {trainer.classes?.length === 0 ? (
            <p className="text-sm text-gray-400">No classes assigned yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {trainer.classes?.map((cls: any) => (
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
                  <span className="text-xs text-gray-500">Capacity: {cls.capacity}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}