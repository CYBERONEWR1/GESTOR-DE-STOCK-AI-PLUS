"use client"

import React, { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, UserRound, Box, Calendar, FileText, CheckCircle2, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ARTICULOS_INICIALES, TRABAJADORES_INICIALES } from '@/lib/data-mock'
import { useToast } from '@/hooks/use-toast'

export default function MovimientosPage() {
  const { toast } = useToast()
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada')
  const [datos, setDatos] = useState({
    articuloId: '',
    trabajadorId: '',
    cantidad: '',
    notas: ''
  })

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!datos.articuloId || !datos.trabajadorId || !datos.cantidad) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos requeridos.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Movimiento registrado",
      description: `Se ha registrado una ${tipo} exitosamente.`,
    })

    setDatos({ articuloId: '', trabajadorId: '', cantidad: '', notas: '' })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <History strokeWidth={1.5} className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Movimientos de Stock</h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground font-medium pl-12">Registra entradas y salidas de artículos del almacén.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all duration-300 border-none rounded-2xl ${tipo === 'entrada' ? 'ring-2 ring-primary bg-primary/5 shadow-lg' : 'bg-white hover:bg-muted/20'}`}
          onClick={() => setTipo('entrada')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-2xl transition-all ${tipo === 'entrada' ? 'bg-primary text-primary-foreground scale-110 shadow-md' : 'bg-muted text-muted-foreground'}`}>
              <ArrowUpRight strokeWidth={2.5} className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Entrada</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Abastecimiento</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-300 border-none rounded-2xl ${tipo === 'salida' ? 'ring-2 ring-accent bg-accent/5 shadow-lg' : 'bg-white hover:bg-muted/20'}`}
          onClick={() => setTipo('salida')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-2xl transition-all ${tipo === 'salida' ? 'bg-accent text-accent-foreground scale-110 shadow-md' : 'bg-muted text-muted-foreground'}`}>
              <ArrowDownRight strokeWidth={2.5} className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Salida</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Despacho / Uso</p>
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:flex flex-col justify-center p-6 bg-white rounded-2xl border-2 border-dashed border-muted/30 italic text-sm text-muted-foreground text-center">
          <p className="font-medium leading-relaxed">"La precisión hoy evita descuadres mañana. Verifica siempre las unidades."</p>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-white rounded-3xl">
        <CardHeader className={`${tipo === 'entrada' ? 'bg-primary/5' : 'bg-accent/5'} border-b border-muted/50 p-6 md:p-8`}>
          <div className="flex items-center gap-4">
             <div className={`p-3 rounded-2xl ${tipo === 'entrada' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                {tipo === 'entrada' ? <ArrowUpRight strokeWidth={1.5} className="h-6 w-6" /> : <ArrowDownRight strokeWidth={1.5} className="h-6 w-6" />}
             </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Registro de {tipo}</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Actualización inmediata del stock</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-10">
          <form onSubmit={manejarSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <Box strokeWidth={1.5} className="h-4 w-4" /> Seleccionar Artículo
                  </Label>
                  <Select 
                    value={datos.articuloId} 
                    onValueChange={(val) => setDatos({...datos, articuloId: val})}
                  >
                    <SelectTrigger className="h-12 text-sm rounded-xl font-medium">
                      <SelectValue placeholder="Busca un artículo..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      {ARTICULOS_INICIALES.map(a => (
                        <SelectItem key={a.id} value={a.id} className="text-sm font-medium py-3">{a.nombre} <span className="text-[10px] text-muted-foreground ml-2">(S: {a.stockActual})</span></SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <UserRound strokeWidth={1.5} className="h-4 w-4" /> Responsable
                  </Label>
                  <Select 
                    value={datos.trabajadorId} 
                    onValueChange={(val) => setDatos({...datos, trabajadorId: val})}
                  >
                    <SelectTrigger className="h-12 text-sm rounded-xl font-medium">
                      <SelectValue placeholder="Selecciona trabajador..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      {TRABAJADORES_INICIALES.map(t => (
                        <SelectItem key={t.id} value={t.id} className="text-sm font-medium py-3">{t.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="cantidad" className="font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <Calendar strokeWidth={1.5} className="h-4 w-4" /> Cantidad a procesar
                  </Label>
                  <Input 
                    id="cantidad" 
                    type="number" 
                    placeholder="0.00" 
                    className="h-12 text-xl font-black rounded-xl"
                    value={datos.cantidad}
                    onChange={(e) => setDatos({...datos, cantidad: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notas" className="font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <FileText strokeWidth={1.5} className="h-4 w-4" /> Observaciones
                  </Label>
                  <Textarea 
                    id="notas" 
                    placeholder="Escribe detalles adicionales..." 
                    className="min-h-[120px] resize-none text-sm rounded-xl font-medium p-4"
                    value={datos.notas}
                    onChange={(e) => setDatos({...datos, notas: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-muted/50 flex justify-end">
              <Button type="submit" size="lg" className={`w-full md:w-auto px-12 font-bold h-14 rounded-2xl shadow-lg transition-all active:scale-95 ${tipo === 'entrada' ? 'bg-primary hover:bg-primary/90' : 'bg-accent hover:bg-accent/90'}`}>
                <CheckCircle2 strokeWidth={2.5} className="mr-2 h-5 w-5" /> Confirmar Registro
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
