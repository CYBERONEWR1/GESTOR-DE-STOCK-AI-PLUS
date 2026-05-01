"use client"

import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Box, 
  Layers, 
  Sparkles, 
  Trash2, 
  PenLine,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ARTICULOS_INICIALES } from '@/lib/data-mock'
import { Articulo } from '@/lib/types'
import { generarDescripcionArticuloInventario } from '@/ai/flows/generate-inventory-item-description-flow'
import { useToast } from '@/hooks/use-toast'

export default function InventarioPage() {
  const { toast } = useToast()
  const [busqueda, setBusqueda] = useState('')
  const [articulos, setArticulos] = useState<Articulo[]>(ARTICULOS_INICIALES)
  const [isCargandoIA, setIsCargandoIA] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  
  const [nuevoArticulo, setNuevoArticulo] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    unidad: 'unidades'
  })

  const filtrados = articulos.filter(a => 
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    a.categoria.toLowerCase().includes(busqueda.toLowerCase())
  )

  const manejarGenerarDescripcion = async () => {
    if (!nuevoArticulo.nombre) {
      toast({
        title: "Nombre requerido",
        description: "Ingresa el nombre del artículo para que la IA pueda generar una descripción.",
        variant: "destructive"
      })
      return
    }

    setIsCargandoIA(true)
    try {
      const resultado = await generarDescripcionArticuloInventario({
        nombreArticulo: nuevoArticulo.nombre,
        categoriaArticulo: nuevoArticulo.categoria
      })
      setNuevoArticulo(prev => ({ ...prev, descripcion: resultado.descripcionGenerada }))
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la descripción asistida por IA.",
        variant: "destructive"
      })
    } finally {
      setIsCargandoIA(false)
    }
  }

  const manejarGuardarArticulo = () => {
    const articulo: Articulo = {
      id: `a${articulos.length + 1}`,
      nombre: nuevoArticulo.nombre,
      categoria: nuevoArticulo.categoria,
      descripcion: nuevoArticulo.descripcion,
      unidad: nuevoArticulo.unidad,
      stockActual: 0
    }
    setArticulos([articulo, ...articulos])
    setOpenDialog(false)
    setNuevoArticulo({ nombre: '', categoria: '', descripcion: '', unidad: 'unidades' })
    toast({
      title: "Artículo guardado",
      description: "El nuevo artículo se ha añadido al catálogo exitosamente.",
    })
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Box strokeWidth={1.5} className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Catálogo de Artículos</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium pl-12">Gestiona los productos e insumos disponibles en stock.</p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-sm font-bold h-11 px-6 rounded-xl">
              <Plus strokeWidth={2.5} className="mr-2 h-4 w-4" /> Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary font-bold text-xl flex items-center gap-2">
                <Plus strokeWidth={1.5} className="h-5 w-5" /> Añadir Nuevo Artículo
              </DialogTitle>
              <DialogDescription className="font-medium text-xs md:text-sm">
                Completa los detalles del producto para registrarlo en el sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre" className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Nombre del Producto</Label>
                <Input 
                  id="nombre" 
                  value={nuevoArticulo.nombre}
                  onChange={(e) => setNuevoArticulo({...nuevoArticulo, nombre: e.target.value})}
                  className="h-11 rounded-lg" 
                  placeholder="Ej: Cable de Cobre"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoria" className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Categoría</Label>
                  <Input 
                    id="categoria" 
                    value={nuevoArticulo.categoria}
                    onChange={(e) => setNuevoArticulo({...nuevoArticulo, categoria: e.target.value})}
                    className="h-11 rounded-lg" 
                    placeholder="Ej: Ferretería"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unidad" className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Unidad</Label>
                  <Select 
                    value={nuevoArticulo.unidad} 
                    onValueChange={(val) => setNuevoArticulo({...nuevoArticulo, unidad: val})}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unidades">Unidades (u)</SelectItem>
                      <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                      <SelectItem value="metros">Metros (m)</SelectItem>
                      <SelectItem value="litros">Litros (L)</SelectItem>
                      <SelectItem value="baldes">Baldes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="descripcion" className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Descripción Técnica</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={manejarGenerarDescripcion}
                    disabled={isCargandoIA}
                    className="h-7 text-[10px] text-accent border-accent/20 hover:bg-accent/10 font-bold px-3 rounded-full"
                  >
                    {isCargandoIA ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles strokeWidth={1.5} className="mr-1 h-3 w-3" />}
                    Sugerir con IA
                  </Button>
                </div>
                <Textarea 
                  id="descripcion" 
                  value={nuevoArticulo.descripcion}
                  onChange={(e) => setNuevoArticulo({...nuevoArticulo, descripcion: e.target.value})}
                  placeholder="Describe las características principales..." 
                  className="min-h-[100px] text-xs md:text-sm rounded-lg resize-none"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button variant="ghost" onClick={() => setOpenDialog(false)} className="w-full sm:w-auto h-11 font-bold">Cancelar</Button>
              <Button onClick={manejarGuardarArticulo} className="w-full sm:w-auto bg-primary font-bold h-11 px-8 rounded-xl">Guardar Artículo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center bg-white rounded-xl px-4 py-2 border-none shadow-sm w-full md:max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search strokeWidth={1.5} className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
        <Input 
          placeholder="Buscar artículos..." 
          className="border-none bg-transparent focus-visible:ring-0 h-8 text-sm w-full font-medium"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filtrados.map((articulo) => (
          <Card key={articulo.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none bg-white flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-2xl bg-primary/5 text-primary flex-shrink-0 transition-colors group-hover:bg-primary/10">
                  <Box strokeWidth={1.5} className="h-6 w-6" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full">
                    <PenLine strokeWidth={1.5} className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full">
                    <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4 text-lg md:text-xl font-bold group-hover:text-primary transition-colors truncate">{articulo.nombre}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 rounded-md">
                  <Layers strokeWidth={1.5} className="h-3 w-3" /> {articulo.categoria}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs md:text-sm text-muted-foreground font-medium line-clamp-2 min-h-[32px] md:min-h-[40px] leading-relaxed">
                {articulo.descripcion}
              </p>
              
              <div className="pt-4 border-t border-muted/50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Existencias</span>
                  <span className={`text-xl md:text-2xl font-black ${articulo.stockActual < 5 ? 'text-destructive' : 'text-primary'}`}>
                    {articulo.stockActual} <span className="text-xs font-bold uppercase text-muted-foreground ml-0.5">{articulo.unidad.slice(0, 3)}</span>
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                   <div className="h-8 w-8 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                      <Sparkles strokeWidth={1.5} className="h-4 w-4" />
                   </div>
                </div>
              </div>
              
              {articulo.stockActual < 5 && (
                <div className="bg-red-50 text-red-600 px-3 py-2.5 mt-3 rounded-xl flex items-center gap-3 text-[10px] font-bold animate-pulse border border-red-100">
                  <AlertCircle strokeWidth={2} className="h-4 w-4 flex-shrink-0" />
                  STOCK BAJO: REPONER PRONTO
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-muted/30">
            <Box strokeWidth={1} className="h-16 w-16 text-muted/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">Sin resultados</h3>
            <p className="text-sm text-muted-foreground/60 font-medium">Prueba con otros términos o categorías.</p>
          </div>
        )}
      </div>
    </div>
  )
}
