"use client"

import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Package, 
  Layers, 
  Sparkles, 
  Trash2, 
  Edit,
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Catálogo de Artículos</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">Gestiona los productos e insumos disponibles en stock.</p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-sm font-bold">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-primary font-bold text-xl">Añadir Nuevo Artículo</DialogTitle>
              <DialogDescription className="font-medium text-xs md:text-sm">
                Completa los detalles del producto para registrarlo en el sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                <Label htmlFor="nombre" className="md:text-right font-bold text-xs">Nombre</Label>
                <Input 
                  id="nombre" 
                  value={nuevoArticulo.nombre}
                  onChange={(e) => setNuevoArticulo({...nuevoArticulo, nombre: e.target.value})}
                  className="md:col-span-3 h-9" 
                  placeholder="Ej: Cable de Cobre"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                <Label htmlFor="categoria" className="md:text-right font-bold text-xs">Categoría</Label>
                <Input 
                  id="categoria" 
                  value={nuevoArticulo.categoria}
                  onChange={(e) => setNuevoArticulo({...nuevoArticulo, categoria: e.target.value})}
                  className="md:col-span-3 h-9" 
                  placeholder="Ej: Ferretería"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                <Label htmlFor="unidad" className="md:text-right font-bold text-xs">Unidad</Label>
                <Select 
                  value={nuevoArticulo.unidad} 
                  onValueChange={(val) => setNuevoArticulo({...nuevoArticulo, unidad: val})}
                >
                  <SelectTrigger className="md:col-span-3 h-9">
                    <SelectValue placeholder="Selecciona unidad" />
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
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="descripcion" className="font-bold text-xs">Descripción</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={manejarGenerarDescripcion}
                    disabled={isCargandoIA}
                    className="h-7 text-[10px] md:text-xs text-accent border-accent/20 hover:bg-accent/10 font-bold"
                  >
                    {isCargandoIA ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                    Sugerir con IA
                  </Button>
                </div>
                <Textarea 
                  id="descripcion" 
                  value={nuevoArticulo.descripcion}
                  onChange={(e) => setNuevoArticulo({...nuevoArticulo, descripcion: e.target.value})}
                  placeholder="Describe las características principales..." 
                  className="min-h-[80px] text-xs md:text-sm"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setOpenDialog(false)} className="w-full sm:w-auto h-9 text-xs">Cancelar</Button>
              <Button onClick={manejarGuardarArticulo} className="w-full sm:w-auto bg-primary font-bold h-9 text-xs">Guardar Artículo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center bg-white rounded-lg px-3 py-1.5 border shadow-sm w-full md:max-w-md focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
        <Input 
          placeholder="Filtrar por nombre o categoría..." 
          className="border-none bg-transparent focus-visible:ring-0 h-8 text-sm w-full"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filtrados.map((articulo) => (
          <Card key={articulo.id} className="group hover:shadow-lg transition-all duration-300 border-none bg-white flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Package className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-3 text-lg md:text-xl font-bold group-hover:text-primary transition-colors truncate">{articulo.nombre}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Layers className="h-3 w-3" /> {articulo.categoria}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs md:text-sm text-muted-foreground font-medium line-clamp-2 min-h-[32px] md:min-h-[40px]">
                {articulo.descripcion}
              </p>
              
              <div className="pt-4 border-t flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Stock Actual</span>
                  <span className={`text-xl md:text-2xl font-black ${articulo.stockActual < 5 ? 'text-destructive' : 'text-primary'}`}>
                    {articulo.stockActual}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Unidad</span>
                  <div className="text-xs md:text-sm font-bold capitalize">{articulo.unidad}</div>
                </div>
              </div>
              
              {articulo.stockActual < 5 && (
                <div className="bg-red-50 text-red-700 px-3 py-2 mt-3 rounded-md flex items-center gap-2 text-[10px] font-bold animate-pulse">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  Stock Crítico: Reponer
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-muted">
            <Package className="h-10 w-10 text-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-muted-foreground">No se encontraron artículos</h3>
            <p className="text-xs text-muted-foreground">Intenta con otros términos de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
