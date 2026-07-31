import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { ArrowRight, AlertCircle, KeyRound, Mail } from 'lucide-react'
import logoImg from '@/assets/d3267126-5516-47b1-a617-7fde37c12841-f18a4.jpeg'

export default function Login() {
  const [email, setEmail] = useState('lucas@fittrack.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const { login } = useFitness()
  const navigate = useNavigate()

  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [recoveryStep, setRecoveryStep] = useState(1)
  const [recoveryMsg, setRecoveryMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = authService.login(email, password)
    if (result.success) {
      login(email)
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  const handleRequestRecovery = (e: React.FormEvent) => {
    e.preventDefault()
    const result = authService.requestRecovery(recoveryEmail)
    if (result.success && result.recoveryCode) {
      setRecoveryCode(result.recoveryCode)
      setRecoveryStep(2)
      setRecoveryMsg(`Código de verificação: ${result.recoveryCode}`)
    } else {
      setRecoveryMsg(result.message)
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    const result = authService.resetPassword(recoveryEmail, enteredCode, newPassword)
    if (result.success) {
      setRecoveryMsg('Senha alterada! Faça login com a nova senha.')
      setRecoveryStep(3)
    } else {
      setRecoveryMsg(result.message)
    }
  }

  const resetRecovery = () => {
    setRecoveryOpen(false)
    setRecoveryStep(1)
    setRecoveryEmail('')
    setRecoveryCode('')
    setEnteredCode('')
    setNewPassword('')
    setRecoveryMsg('')
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-card border border-border p-8 rounded-2xl shadow-elevation">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center mb-2">
          <div className="h-20 w-20 rounded-2xl overflow-hidden bg-black p-1 border border-purple-500/30 shadow-lg flex items-center justify-center">
            <img
              src={logoImg}
              alt="FitTitanTrack Logo"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Entrar no FitTitanTrack</h1>
        <p className="text-xs text-muted-foreground">
          Acesse suas métricas e plano de evolução diário
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs">E-mail</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg gap-2"
        >
          Entrar <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <Dialog open={recoveryOpen} onOpenChange={(o) => !o && resetRecovery()}>
        <DialogTrigger asChild>
          <button className="text-xs text-violet-500 hover:underline mx-auto block">
            Esqueci minha senha
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5 text-violet-500" /> Recuperar Senha
            </DialogTitle>
            <DialogDescription className="text-xs">
              {recoveryStep === 1 && 'Digite seu email para receber o código de recuperação.'}
              {recoveryStep === 2 && 'Insira o código e sua nova senha.'}
              {recoveryStep === 3 && 'Senha alterada com sucesso!'}
            </DialogDescription>
          </DialogHeader>
          {recoveryMsg && (
            <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-600 dark:text-violet-400">
              {recoveryMsg}
            </div>
          )}
          {recoveryStep === 1 && (
            <form onSubmit={handleRequestRecovery} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Email cadastrado</Label>
                <Input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-violet-600 text-white text-xs gap-2">
                <Mail className="h-4 w-4" /> Enviar código
              </Button>
            </form>
          )}
          {recoveryStep === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Código de verificação</Label>
                <Input
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  required
                  placeholder="XXXXXX"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nova senha</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-violet-600 text-white text-xs">
                Alterar senha
              </Button>
            </form>
          )}
          {recoveryStep === 3 && (
            <Button onClick={resetRecovery} className="w-full bg-violet-600 text-white text-xs">
              Voltar ao login
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-violet-500 font-semibold hover:underline">
          Cadastre-se gratuitamente
        </Link>
      </div>
    </div>
  )
}
