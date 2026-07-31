import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, Trash2 } from 'lucide-react'

export default function Settings() {
  const { user, logout } = useFitness()

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja redefinir os dados da aplicação?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações da Conta</h1>
        <p className="text-xs text-muted-foreground">
          Gerencie suas preferências de perfil e armazenamento.
        </p>
      </div>

      <Card className="p-6 border-border space-y-4">
        <h2 className="text-sm font-bold">Perfil do Usuário</h2>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>
            <strong>Nome:</strong> {user.name}
          </p>
          <p>
            <strong>E-mail:</strong> {user.email}
          </p>
        </div>

        <div className="pt-4 border-t border-border flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={logout} className="text-xs gap-2">
            <LogOut className="h-4 w-4" /> Encerrar Sessão
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearData}
            className="text-xs gap-2"
          >
            <Trash2 className="h-4 w-4" /> Redefinir Dados
          </Button>
        </div>
      </Card>
    </div>
  )
}
