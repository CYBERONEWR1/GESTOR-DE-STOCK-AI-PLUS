"use client"

import React, { useState } from 'react'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Download, 
  Calendar,
  Filter,
  ClipboardList,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOVIMIENTOS_INICIALES, ARTICULOS_INICIALES, TRABAJADORES_INICIALES } from '@/lib/data-mock'

export default function HistorialPage() {
  const [busqueda, setBusqueda] = useState('')

  const historialConDetalles = MOVIMIENTOS_INICIALES.map(mov => ({
    ...mov,
    articulo: ARTICULOS_INICIALES.find(a => a.id === mov.articuloId),
    trabajador: TRABAJADORES_INICIALES.find(t => t.id === mov.trabajadorId)
  }))

  const filtrados = historialConDetalles.filter(h => 
    h.articulo?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    h.trabajador?.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <ClipboardList strokeWidth={1.5} className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Historial de Movimientos</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium pl-12">Registro cronológico de todas las operaciones.</p>
        </div>
        <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary/5 font-bold h-11 px-6 rounded-xl">
          <Download strokeWidth={1.5} className="mr-2 h-4 w-4" /> Exportar Reporte
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-8">
            <div className="flex-1 flex items-center bg-muted/30 rounded-xl px-4 py-2 border-none focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search strokeWidth={1.5} className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
              <Input 
                placeholder="Buscar por artículo o responsable..." 
                className="border-none bg-transparent focus-visible:ring-0 h-8 text-sm w-full font-medium"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="ghost" size="sm" className="h-11 px-6 font-bold text-xs rounded-xl hover:bg-muted/50">
                <Calendar strokeWidth={1.5} className="mr-2 h-4 w-4" /> Último mes
              </Button>
              <Button variant="ghost" size="sm" className="h-11 px-6 font-bold text-xs rounded-xl hover:bg-muted/50">
                <Filter strokeWidth={1.5} className="mr-2 h-4 w-4" /> Filtros
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-muted/50 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-6">Registro</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Artículo</TableHead>
                    <TableHead className="font-bold text-center text-[10px] uppercase tracking-widest text-muted-foreground">Operación</TableHead>
                    <TableHead className="font-bold text-center text-[10px] uppercase tracking-widest text-muted-foreground">Volumen</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Responsable</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground hidden md:table-cell">Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((mov) => (
                    <TableRow key={mov.id} className="hover:bg-primary/5 transition-colors border-muted/50">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
                            <Clock strokeWidth={1.5} className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs">{new Date(mov.fecha).toLocaleDateString('es-ES')}</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{new Date(mov.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-sm text-primary">{mov.articulo?.nombre}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`font-black uppercase px-3 py-1 text-[9px] rounded-full border-none shadow-sm ${mov.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {mov.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-black text-sm">{mov.cantidad}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase ml-1.5">{mov.articulo?.unidad.slice(0, 3)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-xs text-foreground bg-muted/30 px-2 py-1 rounded-md">{mov.trabajador?.nombre}</span>
                      </TableCell>
                      <TableCell className="max-w-[150px] hidden md:table-cell">
                        <p className="text-[10px] text-muted-foreground font-medium italic truncate">
                          {mov.notas || "Sin observaciones."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center text-muted-foreground font-bold">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <ClipboardList strokeWidth={1} className="h-12 w-12" />
                          No se encontraron movimientos registrados.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
