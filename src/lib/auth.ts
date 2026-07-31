import { db } from '@/lib/db'

export interface UserAccount {
  id: string
  name: string
  email: string
  passwordHash: string
  emailVerified: boolean
  verificationCode: string | null
  recoveryCode: string | null
  createdAt: string
  updatedAt: string
}

const USERS_KEY = 'fittrack_accounts'
const SESSION_KEY = 'fittrack_session_user'

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return btoa(String(hash) + '_' + password.length)
}

function genCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function getUsers(): UserAccount[] {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as UserAccount[]
  } catch {
    try {
      return JSON.parse(db.decrypt(raw)) as UserAccount[]
    } catch {
      return []
    }
  }
}

function saveUsers(users: UserAccount[]): void {
  const serialized = JSON.stringify(users)
  const stored = db.isConnected() ? db.encrypt(serialized) : serialized
  localStorage.setItem(USERS_KEY, stored)
}

function createSession(user: UserAccount): void {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, email: user.email, name: user.name }),
  )
}

function ensureDefaultAccount(): void {
  const users = getUsers()
  if (users.length === 0) {
    users.push({
      id: 'u1',
      name: 'Lucas Silva',
      email: 'lucas@fittrack.com',
      passwordHash: hashPassword('123456'),
      emailVerified: true,
      verificationCode: null,
      recoveryCode: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    saveUsers(users)
  }
}
ensureDefaultAccount()

export const authService = {
  register(name: string, email: string, password: string) {
    const users = getUsers()
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'Email já cadastrado' }
    }
    const code = genCode()
    const user: UserAccount = {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash: hashPassword(password),
      emailVerified: false,
      verificationCode: code,
      recoveryCode: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(user)
    saveUsers(users)
    return { success: true, verificationCode: code, message: 'Conta criada!' }
  },
  verifyEmail(email: string, code: string) {
    const users = getUsers()
    const user = users.find((u) => u.email === email)
    if (!user) return { success: false, message: 'Usuário não encontrado' }
    if (user.verificationCode !== code) return { success: false, message: 'Código inválido' }
    user.emailVerified = true
    user.verificationCode = null
    user.updatedAt = new Date().toISOString()
    saveUsers(users)
    return { success: true, message: 'Email verificado!' }
  },
  login(email: string, password: string) {
    const users = getUsers()
    const user = users.find((u) => u.email === email)
    if (!user) return { success: false, message: 'Email não encontrado' }
    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, message: 'Senha incorreta' }
    }
    createSession(user)
    return { success: true, user, message: 'Login realizado!' }
  },
  requestRecovery(email: string) {
    const users = getUsers()
    const user = users.find((u) => u.email === email)
    if (!user) return { success: false, message: 'Email não encontrado' }
    const code = genCode()
    user.recoveryCode = code
    user.updatedAt = new Date().toISOString()
    saveUsers(users)
    return { success: true, recoveryCode: code, message: 'Código enviado!' }
  },
  resetPassword(email: string, code: string, newPassword: string) {
    const users = getUsers()
    const user = users.find((u) => u.email === email)
    if (!user) return { success: false, message: 'Usuário não encontrado' }
    if (user.recoveryCode !== code) return { success: false, message: 'Código inválido' }
    user.passwordHash = hashPassword(newPassword)
    user.recoveryCode = null
    user.updatedAt = new Date().toISOString()
    saveUsers(users)
    return { success: true, message: 'Senha alterada!' }
  },
  getSession(): { id: string; email: string; name: string } | null {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  },
  logout(): void {
    localStorage.removeItem(SESSION_KEY)
  },
}
