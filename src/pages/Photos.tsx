import { useState } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Plus } from 'lucide-react'

export default function Photos() {
  const { photos, addProgressPhoto } = useFitness()
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    const today = new Date().toISOString().split('T')[0]

    addProgressPhoto({
      date: today,
      type: 'front',
      imageUrl: url,
      notes,
    })

    setUrl('')
    setNotes('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fotos de Evolução Corporal</h1>
        <p className="text-xs text-muted-foreground">
          Acompanhe visualmente as mudanças no seu físico ao longo do tempo.
        </p>
      </div>

      <Card className="p-5 border-border">
        <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">URL da Foto</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Notas da foto</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Físico em jejum de 30 dias"
            />
          </div>
          <Button type="submit" className="bg-emerald-600 text-white gap-2 text-xs">
            <Plus className="h-4 w-4" /> Adicionar Foto
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((p) => (
          <Card key={p.id} className="overflow-hidden border-border bg-card">
            <div className="aspect-[3/4] bg-accent relative overflow-hidden">
              <img src={p.imageUrl} alt="Evolução" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-[10px] text-white font-semibold">
                {p.date}
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold">{p.notes || 'Registro Visual'}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
