import { useState, useEffect, useCallback } from 'react'
import { AppNotification } from '@/types/fitness'

const NOTIFS_KEY = 'fittrack_notifications'
const EVENT = 'fittrack:notifications'

export function getNotifications(): AppNotification[] {
  const saved = localStorage.getItem(NOTIFS_KEY)
  return saved ? JSON.parse(saved) : []
}

function saveNotifications(notifs: AppNotification[]): void {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs))
  window.dispatchEvent(new Event(EVENT))
}

export function addNotification(title: string, body: string): void {
  const notifs = getNotifications()
  const newNotif: AppNotification = {
    id: `n_${Date.now()}`,
    title,
    body,
    timestamp: new Date().toISOString(),
    read: false,
  }
  saveNotifications([newNotif, ...notifs].slice(0, 50))
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body })
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(getNotifications)

  useEffect(() => {
    const handler = () => setNotifications(getNotifications())
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [])

  const markAllRead = useCallback(() => {
    saveNotifications(notifications.map((n) => ({ ...n, read: true })))
  }, [notifications])

  const clearAll = useCallback(() => {
    saveNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, unreadCount, markAllRead, clearAll }
}
