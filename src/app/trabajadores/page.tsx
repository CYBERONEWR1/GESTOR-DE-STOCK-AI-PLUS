"use client"

import React, { useState } from 'react'
import { Plus, Search, UserRound, Mail, Shield, MoreHorizontal, CheckCircle2, XCircle, PenLine, UserMinus, ShieldAlert } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TRABAJADORES_INICIALES } from '@/lib/data-mock'
import { Trabajador } from '@/lib/types'

export default function TrabajadoresPage() {
  const [busqueda, setBusqueda] = useState('')
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(TRABAJADORES_INICIALES)

  const filtrados = trabajadores.filter(t => 
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    t.correo.toLowerCase().includes(busqueda.toLowerCase())
  )

  const getBadgeVariant = (rol: string) => {
    switch (rol) {
      case 'administrador': return 'default'
      case 'supervisor': return 'secondary'
      case 'operario': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <UserRound strokeWidth={1.5} className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Gestión de Personal</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium pl-12">Administra los accesos y perfiles de los trabajadores.</p>
        </div>
        <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-sm font-bold h-11 px-6 rounded-xl">
          <Plus strokeWidth={2.5} className="mr-2 h-4 w-4" /> Registrar Trabajador
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center bg-muted/30 rounded-xl px-4 py-2 mb-6 w-full md:max-w-md border-none focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search strokeWidth={1.5} className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
            <Input 
              placeholder="Buscar por nombre o correo..." 
              className="border-none bg-transparent focus-visible:ring-0 h-8 text-sm w-full font-medium"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-muted/50 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground py-4">Trabajador</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Rol</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Estado</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Registro</TableHead>
                    <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest text-muted-foreground pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((t) => (
                    <TableRow key={t.id} className="hover:bg-primary/5 transition-colors border-muted/50">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
                            <UserRound strokeWidth={1.5} className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm truncate">{t.nombre}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium truncate">
                              <Mail strokeWidth={1.5} className="h-3 w-3 flex-shrink-0" /> {t.correo}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(t.rol)} className="capitalize font-bold px-3 py-1 text-[10px] rounded-full border-none shadow-sm">
                          <Shield strokeWidth={1.5} className="mr-1.5 h-3 w-3" />
                          {t.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {t.activo ? (
                          <span className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] whitespace-nowrap bg-green-50 px-2 py-1 rounded-full w-fit">
                            <CheckCircle2 strokeWidth={2} className="h-3 w-3" /> Activo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-500 font-bold text-[10px] whitespace-nowrap bg-red-50 px-2 py-1 rounded-full w-fit">
                            <XCircle strokeWidth={2} className="h-3 w-3" /> Inactivo
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-bold text-[10px] hidden sm:table-cell whitespace-nowrap">
                        {new Date(t.fechaRegistro).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-muted/50">
                              <MoreHorizontal strokeWidth={1.5} className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-none shadow-xl p-2">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">Opciones</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs font-bold rounded-lg cursor-pointer flex gap-2 items-center px-2 py-2">
                              <PenLine strokeWidth={1.5} className="h-4 w-4 text-primary" /> Editar Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold rounded-lg cursor-pointer flex gap-2 items-center px-2 py-2">
                              <ShieldAlert strokeWidth={1.5} className="h-4 w-4 text-accent" /> Gestionar Permisos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-muted/50" />
                            <DropdownMenuItem className="text-destructive text-xs font-bold rounded-lg cursor-pointer flex gap-2 items-center px-2 py-2 hover:bg-red-50">
                              <UserMinus strokeWidth={1.5} className="h-4 w-4" /> Suspender Cuenta
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-bold text-sm">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <UserRound strokeWidth={1} className="h-12 w-12" />
                          No se hallaron resultados.
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
