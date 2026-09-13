import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}