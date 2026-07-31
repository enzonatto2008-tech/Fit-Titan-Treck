import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'
import logoImg from '@/assets/d3267126-5516-47b1-a617-7fde37c12841-f18a4.jpeg'

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

      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-violet-500 font-semibold hover:underline">
          Cadastre-se gratuitamente
        </Link>
      </div>
    </div>
  )
}
