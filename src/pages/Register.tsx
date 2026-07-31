import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logoImg from '@/assets/d3267126-5516-47b1-a617-7fde37c12841-f18a4.jpeg'

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
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg"
        >
          Continuar para Configuração
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        Já possui conta?{' '}
        <Link to="/login" className="text-violet-500 font-semibold hover:underline">
          Fazer Login
        </Link>
      </div>
    </div>
  )
}
