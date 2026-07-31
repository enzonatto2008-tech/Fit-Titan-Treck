import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { useFitness } from '@/hooks/use-fitness'
import { useReminderChecker } from '@/hooks/use-reminders'

export default function Layout() {
  const { isAuthenticated, dbConnected } = useFitness()
  const location = useLocation()
  useReminderChecker()

  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />
  }

  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/dashboard" replace />
  }

  if (isPublicRoute) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Outlet />
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {!dbConnected && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Modo temporário — seus dados não serão salvos. Conecte-se ao banco de dados pelo
              ícone no cabeçalho.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
