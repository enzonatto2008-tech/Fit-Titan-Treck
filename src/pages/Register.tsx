import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Flame } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { updateUserProfile, login } = useFitness()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile({ name, email })
    login(email)
    navigate('/setup')
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-card border border-border p-8 rounded-2xl shadow-elevation">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-2">
          <Flame className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Criar Conta no FitTitanTrack</h1>
        <p className="text-xs text-muted-foreground">
          Comece sua jornada de evolução corporal inteligente
        </p>
      </div>

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
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg"
        >
          Continuar para Configuração
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        Já possui conta?{' '}
        <Link to="/login" className="text-emerald-500 font-semibold hover:underline">
          Fazer Login
        </Link>
      </div>
    </div>
  )
}
