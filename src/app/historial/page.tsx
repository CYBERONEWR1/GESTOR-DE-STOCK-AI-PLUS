"use client"

import React, { useState } from 'react'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Download, 
  Calendar as CalendarIcon,
  Filter
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
  const [filtro, setFiltro] = useState('')

  const historialConDetalles = MOVIMIENTOS_INICIALES.map(mov => ({
    ...mov,
    articulo: ARTICULOS_INICIALES.find(a => a.id === mov.articuloId),
    trabajador: TRABAJADORES_INICIALES.find(t => t.id === mov.trabajadorId)
  }))

  const filtrados = historialConDetalles.filter(h => 
    h.articulo?.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    h.trabajador?.nombre.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Historial de Movimientos</h1>
          <p className="text-muted-foreground font-medium">Registro detallado y cronológico de todas las transacciones.</p>
        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-bold">
          <Download className="mr-2 h-4 w-4" /> Exportar a Excel
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="flex-1 flex items-center bg-muted/30 rounded-lg px-3 py-1 border border-input focus-within:ring-2 focus-within:ring-primary/20 transition-all w-full md:max-w-md">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                placeholder="Buscar por artículo o responsable..." 
                className="border-none bg-transparent focus-visible:ring-0 h-9"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="h-11 px-4 font-bold flex-1 md:flex-none">
                <CalendarIcon className="mr-2 h-4 w-4" /> Últimos 30 días
              </Button>
              <Button variant="outline" size="sm" className="h-11 px-4 font-bold flex-1 md:flex-none">
                <Filter className="mr-2 h-4 w-4" /> Todos los tipos
              </Button>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold py-4">Fecha y Hora</TableHead>
                  <TableHead className="font-bold">Artículo</TableHead>
                  <TableHead className="font-bold text-center">Tipo</TableHead>
                  <TableHead className="font-bold text-center">Cantidad</TableHead>
                  <TableHead className="font-bold">Responsable</TableHead>
                  <TableHead className="font-bold">Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((mov) => (
                  <TableRow key={mov.id} className="hover:bg-accent/5 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold">{new Date(mov.fecha).toLocaleDateString('es-ES')}</span>
                        <span className="text-xs text-muted-foreground">{new Date(mov.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{mov.articulo?.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`font-bold capitalize px-3 ${mov.tipo === 'entrada' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : 'bg-red-100 text-red-700 hover:bg-red-200 border-none'}`}>
                        {mov.tipo === 'entrada' ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                        {mov.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-black">
                      {mov.cantidad} <span className="text-[10px] text-muted-foreground uppercase">{mov.articulo?.unidad}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm text-foreground">{mov.trabajador?.nombre}</span>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-xs text-muted-foreground italic truncate">
                        {mov.notas || "Sin observaciones registradas."}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium">
                      No se registran movimientos que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}