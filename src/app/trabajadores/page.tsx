"use client"

import React, { useState } from 'react'
import { Plus, Search, UserCircle, Mail, Shield, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react'
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Gestión de Personal</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">Administra los accesos y perfiles de los trabajadores.</p>
        </div>
        <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-sm font-bold">
          <Plus className="mr-2 h-4 w-4" /> Registrar Trabajador
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center bg-muted/50 rounded-lg px-3 py-1.5 mb-6 w-full md:max-w-md border border-input focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
            <Input 
              placeholder="Buscar por nombre o correo..." 
              className="border-none bg-transparent focus-visible:ring-0 h-8 text-sm w-full"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="rounded-xl border overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold whitespace-nowrap">Trabajador</TableHead>
                    <TableHead className="font-bold whitespace-nowrap">Rol</TableHead>
                    <TableHead className="font-bold whitespace-nowrap">Estado</TableHead>
                    <TableHead className="font-bold whitespace-nowrap hidden sm:table-cell">Registro</TableHead>
                    <TableHead className="text-right font-bold whitespace-nowrap">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((t) => (
                    <TableRow key={t.id} className="hover:bg-accent/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <UserCircle className="h-5 w-5 md:h-6 md:w-6" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm truncate">{t.nombre}</span>
                            <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3 flex-shrink-0" /> {t.correo}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(t.rol)} className="capitalize font-bold px-2 py-0 text-[10px] md:text-xs">
                          <Shield className="mr-1 h-3 w-3 md:h-3.5 md:w-3.5" />
                          {t.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {t.activo ? (
                          <span className="flex items-center gap-1 text-green-600 font-bold text-[10px] md:text-xs whitespace-nowrap">
                            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" /> Activo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 font-bold text-[10px] md:text-xs whitespace-nowrap">
                            <XCircle className="h-3 w-3 md:h-4 md:w-4" /> Inactivo
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium text-[10px] md:text-xs hidden sm:table-cell whitespace-nowrap">
                        {new Date(t.fechaRegistro).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel className="text-xs">Acciones</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs">Ver Perfil</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">Editar Permisos</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive text-xs">Suspender Cuenta</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-medium text-xs">
                        No se encontraron trabajadores.
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
