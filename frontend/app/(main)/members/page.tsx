import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Table from '@/components/ui/Table'
import DeleteMemberButton from './DeleteMemberButton'

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

export default async function MembersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/auth/login')

  const user = await getMe(token)
  if (user?.role !== 'admin') redirect('/dashboard')

  const members = await getMembers(token)

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'joined', label: 'Joined' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all gym members</p>
        </div>
      </div>

      <Table columns={columns} empty="No members found">
        {members.map((member: any) => (
          <tr key={member.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 font-medium text-gray-800">{member.user?.name}</td>
            <td className="px-6 py-4 text-gray-500">{member.user?.email}</td>
            <td className="px-6 py-4 text-gray-500">{member.phone || 'N/A'}</td>
            <td className="px-6 py-4 text-gray-500">
              {new Date(member.joined_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/members/${member.id}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  View
                </Link>
                <Link
                  href={`/members/${member.id}/edit`}
                  className="text-sm text-gray-600 hover:underline font-medium"
                >
                  Edit
                </Link>
                <DeleteMemberButton memberId={member.id} />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}