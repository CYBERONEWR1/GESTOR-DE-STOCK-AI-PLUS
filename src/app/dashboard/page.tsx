"use client"

import React from 'react'
import { 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ARTICULOS_INICIALES, TRABAJADORES_INICIALES, MOVIMIENTOS_INICIALES } from "@/lib/data-mock"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartData = [
  { mes: "Ene", stock: 400 },
  { mes: "Feb", stock: 300 },
  { mes: "Mar", stock: 200 },
  { mes: "Abr", stock: 278 },
  { mes: "May", stock: 189 },
  { mes: "Jun", stock: 239 },
]

const chartConfig = {
  stock: {
    label: "Movimientos",
    color: "hsl(var(--primary))",
  },
}

export default function DashboardPage() {
  const totalStock = ARTICULOS_INICIALES.reduce((acc, art) => acc + art.stockActual, 0)
  const totalTrabajadores = TRABAJADORES_INICIALES.length
  const totalArticulos = ARTICULOS_INICIALES.length
  const ultimosMovimientos = MOVIMIENTOS_INICIALES.length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Panel de Control</h1>
        <p className="text-muted-foreground font-medium">Resumen general del estado de inventario y personal.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Artículos</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalArticulos}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Categorizados en 3 grupos</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Stock Total</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Unidades totales disponibles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Trabajadores</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTrabajadores}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Personal registrado activo</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Movimientos Hoy</CardTitle>
            <ArrowUpRight className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ultimosMovimientos}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Transacciones procesadas hoy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-primary font-bold">Actividad de Stock</CardTitle>
            <CardDescription className="font-medium">Tendencia de movimientos en los últimos meses.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="mes" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="stock" 
                  fill="var(--color-stock)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-primary font-bold">Últimas Transacciones</CardTitle>
            <CardDescription className="font-medium">Entradas y salidas recientes del sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOVIMIENTOS_INICIALES.map((mov) => {
                const articulo = ARTICULOS_INICIALES.find(a => a.id === mov.articuloId)
                return (
                  <div key={mov.id} className="flex items-center">
                    <div className={`mr-4 rounded-full p-2 ${mov.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {mov.tipo === 'entrada' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold leading-none">{articulo?.nombre}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {mov.tipo === 'entrada' ? 'Entrada' : 'Salida'} de {mov.cantidad} {articulo?.unidad}
                      </p>
                    </div>
                    <div className="ml-auto font-bold text-sm">
                      {new Date(mov.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}