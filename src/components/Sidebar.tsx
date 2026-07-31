import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  LineChart,
  Target,
  FileText,
  Sparkles,
  Flame,
  Droplet,
  Moon,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Refeições', path: '/refeicoes', icon: Utensils },
  { label: 'Treinos', path: '/treinos', icon: Dumbbell },
  { label: 'Histórico', path: '/treinos/historico', icon: History },
  { label: 'Peso', path: '/evolucao/peso', icon: LineChart },
  { label: 'Água', path: '/agua', icon: Droplet },
  { label: 'Sono', path: '/sono', icon: Moon },
  { label: 'Metas', path: '/metas', icon: Target },
  { label: 'Relatórios', path: '/relatorios', icon: FileText },
  { label: 'AI Coach', path: '/ai', icon: Sparkles, badge: 'IA' },
]

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card min-h-screen sticky top-0 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight">
              FitTrack <span className="text-emerald-500">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Evolução Inteligente</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-500 font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-black">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border text-xs text-center text-muted-foreground">
          FitTrack AI v0.0.1
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around py-2 px-1 backdrop-blur-lg">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors',
                isActive ? 'text-emerald-500 font-semibold' : 'text-muted-foreground',
              )
            }
          >
            <item.icon className="h-5 w-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
