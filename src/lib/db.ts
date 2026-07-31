const DB_CONNECTION_KEY = 'fittrack_db_connected'
const DB_SERVER_KEY = 'fittrack_db_server'
const DB_BACKUP_KEY = 'fittrack_db_last_backup'

export interface DbConnectionInfo {
  connected: boolean
  serverUrl: string
  lastBackup: string | null
}

export function encrypt(data: string): string {
  try {
    return btoa(encodeURIComponent(data))
  } catch {
    return data
  }
}

export function decrypt(data: string): string {
  try {
    return decodeURIComponent(atob(data))
  } catch {
    return data
  }
}

export function withTimestamps<T extends Record<string, unknown>>(
  record: T,
  userId: string,
): T & { createdAt: string; updatedAt: string; userId: string } {
  const now = new Date().toISOString()
  return {
    ...record,
    userId,
    createdAt: (record.createdAt as string) || now,
    updatedAt: now,
  }
}

export const db = {
  isConnected(): boolean {
    return localStorage.getItem(DB_CONNECTION_KEY) === 'true'
  },
  connect(serverUrl: string): void {
    localStorage.setItem(DB_CONNECTION_KEY, 'true')
    localStorage.setItem(DB_SERVER_KEY, serverUrl)
    localStorage.setItem(DB_BACKUP_KEY, new Date().toISOString())
  },
  disconnect(): void {
    localStorage.setItem(DB_CONNECTION_KEY, 'false')
  },
  getInfo(): DbConnectionInfo {
    return {
      connected: this.isConnected(),
      serverUrl: localStorage.getItem(DB_SERVER_KEY) || '',
      lastBackup: localStorage.getItem(DB_BACKUP_KEY),
    }
  },
  saveCollection(userId: string, collection: string, data: unknown[]): void {
    const key = `fittrack_db_${userId}_${collection}`
    const serialized = JSON.stringify(data)
    const stored = this.isConnected() ? encrypt(serialized) : serialized
    localStorage.setItem(key, stored)
  },
  loadCollection<T>(userId: string, collection: string): T[] | null {
    const key = `fittrack_db_${userId}_${collection}`
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T[]
    } catch {
      try {
        return JSON.parse(decrypt(raw)) as T[]
      } catch {
        return null
      }
    }
  },
  backup(userId: string): void {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(`fittrack_db_${userId}_`))
    const backup: Record<string, string> = {}
    keys.forEach((k) => {
      backup[k] = localStorage.getItem(k) || ''
    })
    localStorage.setItem(`fittrack_backup_${userId}`, JSON.stringify(backup))
    localStorage.setItem(DB_BACKUP_KEY, new Date().toISOString())
  },
}
