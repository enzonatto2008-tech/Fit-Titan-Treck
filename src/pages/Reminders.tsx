import { useReminders } from '@/hooks/use-reminders'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Droplet, Utensils, Dumbbell, Moon, Scale, Bell, BellRing } from 'lucide-react'
import { ReminderType } from '@/types/fitness'

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const REMINDER_CONFIG: {
  type: ReminderType
  label: string
  icon: typeof Droplet
  color: string
}[] = [
  { type: 'water', label: 'Hidratação', icon: Droplet, color: 'text-blue-500' },
  { type: 'meal', label: 'Refeições', icon: Utensils, color: 'text-orange-500' },
  { type: 'workout', label: 'Treino', icon: Dumbbell, color: 'text-violet-500' },
  { type: 'sleep', label: 'Sono', icon: Moon, color: 'text-indigo-500' },
  { type: 'weigh_in', label: 'Pesar', icon: Scale, color: 'text-fuchsia-500' },
]

export default function Reminders() {
  const { reminders, updateReminder, toggleReminder } = useReminders()
  const { dbConnected } = useFitness()

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const permission = 'Notification' in window ? Notification.permission : 'denied'

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BellRing className="h-6 w-6 text-violet-500" /> Lembranças Inteligentes
        </h1>
        <p className="text-xs text-muted-foreground">
          Configure lembretes para manter sua rotina fitness em dia.
        </p>
      </div>

      {!dbConnected && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
          ⚠️ Dados temporários. Conecte-se ao banco de dados para salvar suas configurações
          permanentemente.
        </div>
      )}

      <Card className="p-4 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/50 text-violet-500">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Notificações do Navegador</p>
              <p className="text-[11px] text-muted-foreground">
                Status:{' '}
                {permission === 'granted'
                  ? '✓ Ativado'
                  : permission === 'denied'
                    ? 'Negado'
                    : 'Não solicitado'}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={requestNotificationPermission}
            className="text-xs"
          >
            Ativar
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        {REMINDER_CONFIG.map(({ type, label, icon: Icon, color }) => {
          const reminder = reminders.find((r) => r.type === type)
          if (!reminder) return null
          return (
            <Card key={type} className="p-4 border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-accent/50 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{reminder.title}</p>
                  </div>
                </div>
                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
              </div>
              {reminder.enabled && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
                  <div className="flex-1">
                    <Label className="text-xs">Horário</Label>
                    <Input
                      type="time"
                      value={reminder.time}
                      onChange={(e) => updateReminder(reminder.id, { time: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Dias da Semana</Label>
                    <div className="flex gap-1 mt-1">
                      {DAY_LABELS.map((day, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const days = reminder.days.includes(idx)
                              ? reminder.days.filter((d) => d !== idx)
                              : [...reminder.days, idx]
                            updateReminder(reminder.id, { days })
                          }}
                          className={`flex-1 px-1 py-1.5 rounded text-[10px] font-medium transition ${
                            reminder.days.includes(idx)
                              ? 'bg-violet-500 text-white'
                              : 'bg-accent text-muted-foreground hover:bg-accent/80'
                          }`}
                          title={day}
                        >
                          {DAYS[idx]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
