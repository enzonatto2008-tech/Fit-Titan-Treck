import { useState, useEffect, useCallback } from 'react'
import { Reminder } from '@/types/fitness'
import { addNotification } from '@/hooks/use-notifications'

const REMINDERS_KEY = 'fittrack_reminders'
const EVENT = 'fittrack:reminders'

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'rm_water',
    type: 'water',
    title: 'Hora de beber água!',
    time: '10:00',
    days: [1, 2, 3, 4, 5],
    enabled: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'rm_meal',
    type: 'meal',
    title: 'Hora do almoço',
    time: '12:00',
    days: [1, 2, 3, 4, 5],
    enabled: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'rm_workout',
    type: 'workout',
    title: 'Hora do treino!',
    time: '18:00',
    days: [1, 2, 3, 4, 5],
    enabled: false,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'rm_sleep',
    type: 'sleep',
    title: 'Hora de dormir',
    time: '22:30',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: false,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'rm_weigh',
    type: 'weigh_in',
    title: 'Hora de se pesar',
    time: '07:00',
    days: [1],
    enabled: false,
    createdAt: '',
    updatedAt: '',
  },
]

function getReminders(): Reminder[] {
  const saved = localStorage.getItem(REMINDERS_KEY)
  return saved ? JSON.parse(saved) : DEFAULT_REMINDERS
}

function saveReminders(reminders: Reminder[]): void {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders))
  window.dispatchEvent(new Event(EVENT))
}

export function useReminderChecker() {
  useEffect(() => {
    const check = () => {
      const reminders = getReminders()
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const currentDay = now.getDay()
      const lastKey = `fittrack_last_reminder_${currentTime}`
      reminders.forEach((r) => {
        if (!r.enabled || !r.days.includes(currentDay) || r.time !== currentTime) return
        if (localStorage.getItem(lastKey) === r.id) return
        localStorage.setItem(lastKey, r.id)
        addNotification(r.title, `Lembrete ativo: ${r.type}`)
      })
    }
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(getReminders)

  useEffect(() => {
    const handler = () => setReminders(getReminders())
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [])

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    const updated = getReminders().map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r,
    )
    saveReminders(updated)
  }, [])

  const toggleReminder = useCallback((id: string) => {
    const updated = getReminders().map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled, updatedAt: new Date().toISOString() } : r,
    )
    saveReminders(updated)
  }, [])

  return { reminders, updateReminder, toggleReminder }
}
