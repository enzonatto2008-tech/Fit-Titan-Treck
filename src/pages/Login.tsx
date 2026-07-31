import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Flame, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('lucas@fittrack.com')
  const [password, setPassword] = useState('123456')
  const { login } = useFitness()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email)
    navigate('/dashboard')
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-card border border-border p-8 rounded-2xl shadow-elevation">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-2">
          <Flame className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Entrar no FitTrack AI</h1>
        <p className="text-xs text-muted-foreground">
          Acesse suas métricas e plano de evolução diário
        </p>
      </div>

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
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg gap-2"
        >
          Entrar <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-emerald-500 font-semibold hover:underline">
          Cadastre-se gratuitamente
        </Link>
      </div>
    </div>
  )
}
