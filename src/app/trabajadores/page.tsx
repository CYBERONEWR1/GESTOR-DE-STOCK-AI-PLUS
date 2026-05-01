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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Personal</h1>
          <p className="text-muted-foreground font-medium">Administra los accesos y perfiles de los trabajadores.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm font-bold">
          <Plus className="mr-2 h-4 w-4" /> Registrar Trabajador
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center bg-muted/50 rounded-lg px-3 py-1 mb-6 max-w-md border border-input focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input 
              placeholder="Buscar por nombre o correo..." 
              className="border-none bg-transparent focus-visible:ring-0"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Trabajador</TableHead>
                  <TableHead className="font-bold">Rol</TableHead>
                  <TableHead className="font-bold">Estado</TableHead>
                  <TableHead className="font-bold">Registro</TableHead>
                  <TableHead className="text-right font-bold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((t) => (
                  <TableRow key={t.id} className="hover:bg-accent/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <UserCircle className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold">{t.nombre}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {t.correo}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(t.rol)} className="capitalize font-bold px-3">
                        <Shield className="mr-1.5 h-3 w-3" />
                        {t.rol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {t.activo ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                          <CheckCircle2 className="h-4 w-4" /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 font-bold text-sm">
                          <XCircle className="h-4 w-4" /> Inactivo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">
                      {new Date(t.fechaRegistro).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar Permisos</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Suspender Cuenta</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-medium">
                      No se encontraron trabajadores con ese criterio.
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