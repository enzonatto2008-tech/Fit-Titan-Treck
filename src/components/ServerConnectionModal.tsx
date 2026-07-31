import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Database, Check, Loader2, Shield, Wifi } from 'lucide-react'
import { db } from '@/lib/db'

export function ServerConnectionModal() {
  const [open, setOpen] = useState(false)
  const [serverUrl, setServerUrl] = useState('https://api.fittrack.local')
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(db.isConnected())

  const handleConnect = () => {
    setConnecting(true)
    setTimeout(() => {
      db.connect(serverUrl)
      setConnected(true)
      setConnecting(false)
      setTimeout(() => setOpen(false), 800)
    }, 1500)
  }

  const handleDisconnect = () => {
    db.disconnect()
    setConnected(false)
  }

  const info = db.getInfo()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          title="Conexão com Banco de Dados"
        >
          <Database
            className={connected ? 'h-5 w-5 text-green-500' : 'h-5 w-5 text-muted-foreground'}
          />
          {connected && (
            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-green-500 border border-background" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-violet-500" />
            Conexão com Banco de Dados
          </DialogTitle>
          <DialogDescription className="text-xs">
            Conecte-se a um servidor persistente para salvar seus dados com segurança.
          </DialogDescription>
        </DialogHeader>

        {connected ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-2">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                <span className="text-sm font-semibold">Conectado e sincronizado</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wifi className="h-3 w-3" />
                Servidor: {info.serverUrl}
              </div>
              <p className="text-xs text-muted-foreground">
                Último backup:{' '}
                {info.lastBackup ? new Date(info.lastBackup).toLocaleString('pt-BR') : 'Agora'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-violet-500" />
              Dados criptografados e com backup automático ativo
            </div>
            <Button onClick={handleDisconnect} variant="outline" className="w-full text-xs">
              Desconectar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Modo temporário ativo. Seus dados serão perdidos ao recarregar a página.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">URL do Servidor</Label>
              <Input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2"
            >
              {connecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Conectando...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" /> Conectar
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
