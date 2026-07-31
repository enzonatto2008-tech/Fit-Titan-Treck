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
  DialogDescription,
} from '@/components/ui/dialog'
import { AlertCircle, MailCheck, ArrowRight } from 'lucide-react'
import logoImg from '@/assets/d3267126-5516-47b1-a617-7fde37c12841-f18a4.jpeg'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [verifyMsg, setVerifyMsg] = useState('')

  const { updateUserProfile, login } = useFitness()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    const result = authService.register(name, email, password)
    if (result.success && result.verificationCode) {
      setVerificationCode(result.verificationCode)
      setVerifyOpen(true)
    } else {
      setError(result.message)
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const result = authService.verifyEmail(email, enteredCode)
    if (result.success) {
      updateUserProfile({ name, email })
      login(email)
      navigate('/setup')
    } else {
      setVerifyMsg(result.message)
    }
  }

  const handleSkip = () => {
    updateUserProfile({ name, email })
    login(email)
    navigate('/setup')
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
        <h1 className="text-2xl font-bold tracking-tight">Criar Conta no FitTitanTrack</h1>
        <p className="text-xs text-muted-foreground">
          Comece sua jornada de evolução corporal inteligente
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs">Nome Completo</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg gap-2"
        >
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <MailCheck className="h-5 w-5 text-violet-500" /> Verificar Email
            </DialogTitle>
            <DialogDescription className="text-xs">
              Enviamos um código de verificação para seu email. Insira-o abaixo para confirmar sua
              conta.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-600 dark:text-violet-400">
            Código de verificação (simulação): <strong>{verificationCode}</strong>
          </div>
          {verifyMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {verifyMsg}
            </div>
          )}
          <form onSubmit={handleVerify} className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Código de Verificação</Label>
              <Input
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                required
                placeholder="XXXXXX"
                className="text-center font-mono tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full bg-violet-600 text-white text-xs">
              Verificar e Continuar
            </Button>
          </form>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full text-xs text-muted-foreground"
          >
            Pular verificação por enquanto
          </Button>
        </DialogContent>
      </Dialog>

      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        Já possui conta?{' '}
        <Link to="/login" className="text-violet-500 font-semibold hover:underline">
          Fazer Login
        </Link>
      </div>
    </div>
  )
}
