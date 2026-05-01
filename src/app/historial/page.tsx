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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Historial de Movimientos</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">Registro detallado de todas las transacciones.</p>
        </div>
        <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary/5 font-bold h-10 text-sm">
          <Download className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6 md:mb-8">
            <div className="flex-1 flex items-center bg-muted/30 rounded-lg px-3 py-1.5 border border-input focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
              <Input 
                placeholder="Buscar artículo o responsable..." 
                className="border-none bg-transparent focus-visible:ring-0 h-8 text-sm w-full"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="h-10 md:h-11 px-4 font-bold text-xs flex-1">
                <CalendarIcon className="mr-2 h-4 w-4" /> Últimos 30 días
              </Button>
              <Button variant="outline" size="sm" className="h-10 md:h-11 px-4 font-bold text-xs flex-1">
                <Filter className="mr-2 h-4 w-4" /> Todos
              </Button>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold py-4 text-xs md:text-sm whitespace-nowrap">Fecha</TableHead>
                    <TableHead className="font-bold text-xs md:text-sm whitespace-nowrap">Artículo</TableHead>
                    <TableHead className="font-bold text-center text-xs md:text-sm whitespace-nowrap">Tipo</TableHead>
                    <TableHead className="font-bold text-center text-xs md:text-sm whitespace-nowrap">Cantidad</TableHead>
                    <TableHead className="font-bold text-xs md:text-sm whitespace-nowrap">Responsable</TableHead>
                    <TableHead className="font-bold text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((mov) => (
                    <TableRow key={mov.id} className="hover:bg-accent/5 transition-colors">
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-[10px] md:text-xs">{new Date(mov.fecha).toLocaleDateString('es-ES')}</span>
                          <span className="text-[9px] md:text-[10px] text-muted-foreground">{new Date(mov.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="font-bold text-xs md:text-sm text-primary">{mov.articulo?.nombre}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`font-bold capitalize px-2 py-0 text-[9px] md:text-[10px] ${mov.tipo === 'entrada' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : 'bg-red-100 text-red-700 hover:bg-red-200 border-none'}`}>
                          {mov.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-black text-xs md:text-sm whitespace-nowrap">
                        {mov.cantidad} <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase">{mov.articulo?.unidad}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="font-bold text-[10px] md:text-xs text-foreground">{mov.trabajador?.nombre}</span>
                      </TableCell>
                      <TableCell className="max-w-[150px] hidden md:table-cell">
                        <p className="text-[10px] text-muted-foreground italic truncate">
                          {mov.notas || "-"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium text-xs">
                        Sin movimientos.
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
