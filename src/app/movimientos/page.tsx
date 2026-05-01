"use client"

import React, { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, User, Package, Calendar, FileText, CheckCircle2 } from 'lucide-react'
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
        description: "Por favor, completa todos los campos requeridos para registrar el movimiento.",
        variant: "destructive"
      })
      return
    }

    // Aquí iría la lógica de persistencia
    toast({
      title: "Movimiento registrado",
      description: `Se ha registrado una ${tipo} de ${datos.cantidad} unidades correctamente.`,
    })

    // Resetear formulario
    setDatos({ articuloId: '', trabajadorId: '', cantidad: '', notas: '' })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Movimientos de Stock</h1>
        <p className="text-muted-foreground font-medium">Registra entradas y salidas de artículos del almacén.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className={`cursor-pointer transition-all duration-300 border-2 ${tipo === 'entrada' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary/20 bg-white'}`}
          onClick={() => setTipo('entrada')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-full ${tipo === 'entrada' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Entrada</h3>
              <p className="text-xs text-muted-foreground font-medium">Abastecimiento de inventario</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-300 border-2 ${tipo === 'salida' ? 'border-accent bg-accent/5' : 'border-transparent hover:border-accent/20 bg-white'}`}
          onClick={() => setTipo('salida')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-full ${tipo === 'salida' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              <ArrowDownRight className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Salida</h3>
              <p className="text-xs text-muted-foreground font-medium">Retiro para producción o despacho</p>
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:flex flex-col justify-center p-6 bg-white/50 rounded-xl border border-dashed border-muted italic text-sm text-muted-foreground">
          <p>"Cada movimiento registrado mantiene la trazabilidad de nuestro almacén. Asegúrate de asociar al responsable correcto."</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className={`${tipo === 'entrada' ? 'bg-primary/5' : 'bg-accent/5'} border-b`}>
          <div className="flex items-center gap-3">
            {tipo === 'entrada' ? <ArrowUpRight className="h-6 w-6 text-primary" /> : <ArrowDownRight className="h-6 w-6 text-accent" />}
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">Formulario de {tipo === 'entrada' ? 'Entrada' : 'Salida'}</CardTitle>
              <CardDescription className="font-medium">Completa los datos para actualizar el stock.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={manejarSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> Artículo Seleccionado
                  </Label>
                  <Select 
                    value={datos.articuloId} 
                    onValueChange={(val) => setDatos({...datos, articuloId: val})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Busca un artículo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ARTICULOS_INICIALES.map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.nombre} (Stock: {a.stockActual})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Trabajador Responsable
                  </Label>
                  <Select 
                    value={datos.trabajadorId} 
                    onValueChange={(val) => setDatos({...datos, trabajadorId: val})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona al trabajador..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TRABAJADORES_INICIALES.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cantidad" className="font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Cantidad a {tipo === 'entrada' ? 'Ingresar' : 'Retirar'}
                  </Label>
                  <Input 
                    id="cantidad" 
                    type="number" 
                    placeholder="0.00" 
                    className="h-11 text-lg font-bold"
                    value={datos.cantidad}
                    onChange={(e) => setDatos({...datos, cantidad: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas" className="font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Notas Adicionales
                  </Label>
                  <Textarea 
                    id="notas" 
                    placeholder="Ej: Entrega por proveedor X, Pedido #123..." 
                    className="min-h-[105px] resize-none"
                    value={datos.notas}
                    onChange={(e) => setDatos({...datos, notas: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <Button type="submit" size="lg" className={`w-full md:w-auto px-12 font-bold ${tipo === 'entrada' ? 'bg-primary' : 'bg-accent'}`}>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}