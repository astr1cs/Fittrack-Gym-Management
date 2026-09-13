import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import { createServerApi } from '@/lib/serverApi'
import CreateTrainerModal from './CreateTrainerModal'
import DeleteButton from '@/components/ui/DeleteButton'

async function getTrainers(token: string) {
  try {
    const res = await createServerApi(token).get('/trainers')
    return res.data
  } catch {
    return []
  }
}

async function getMe(token: string) {
  try {
    const res = await createServerApi(token).get('/auth/me')
    return res.data
  } catch {
    return null
  }
}

export default async function TrainersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const user = await getMe(token)
  if (user?.role !== 'admin') redirect('/dashboard')

  const trainers = await getTrainers(token)

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'classes', label: 'Classes' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all gym trainers</p>
        </div>
        <CreateTrainerModal />
      </div>

      <Table columns={columns} empty="No trainers found">
        {trainers.map((trainer: any) => (
          <tr key={trainer.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 font-medium text-gray-800">
              {trainer.user?.name}
            </td>
            <td className="px-6 py-4 text-gray-500">{trainer.user?.email}</td>
            <td className="px-6 py-4">
              <Badge label={trainer.specialization} variant="info" />
            </td>
            <td className="px-6 py-4 text-gray-500">
              {trainer.classes?.length ?? 0} classes
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/trainers/${trainer.id}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View
                </Link>
                <DeleteButton endpoint={`/trainers/${trainer.id}`} resourceLabel="trainer" />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}