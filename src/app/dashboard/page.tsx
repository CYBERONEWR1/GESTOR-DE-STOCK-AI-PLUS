"use client"

import React, { useState, useEffect } from 'react'
import { 
  UserRound, 
  Box, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  LayoutGrid,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ARTICULOS_INICIALES, TRABAJADORES_INICIALES, MOVIMIENTOS_INICIALES } from "@/lib/data-mock"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"

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
  const [barSize, setBarSize] = useState(32)
  
  useEffect(() => {
    const updateBarSize = () => {
      setBarSize(window.innerWidth < 640 ? 16 : 32)
    }
    updateBarSize()
    window.addEventListener('resize', updateBarSize)
    return () => window.removeEventListener('resize', updateBarSize)
  }, [])

  const totalStock = ARTICULOS_INICIALES.reduce((acc, art) => acc + art.stockActual, 0)
  const totalTrabajadores = TRABAJADORES_INICIALES.length
  const totalArticulos = ARTICULOS_INICIALES.length
  const ultimosMovimientos = MOVIMIENTOS_INICIALES.length

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <LayoutGrid strokeWidth={1.5} className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Panel de Control</h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground font-medium pl-12">Resumen general del estado de inventario y personal.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Artículos</CardTitle>
            <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
              <Box strokeWidth={1.5} className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black">{totalArticulos}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Catálogo activo</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stock Actual</CardTitle>
            <div className="p-1.5 rounded-lg bg-accent/5 text-accent">
              <Activity strokeWidth={1.5} className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black">{totalStock}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Unidades totales</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Personal</CardTitle>
            <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
              <UserRound strokeWidth={1.5} className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black">{totalTrabajadores}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Equipo registrado</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-300 border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operaciones</CardTitle>
            <div className="p-1.5 rounded-lg bg-accent/5 text-accent">
              <Clock strokeWidth={1.5} className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black">{ultimosMovimientos}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Hoy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-none bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-primary font-bold flex items-center gap-2">
              <Activity strokeWidth={1.5} className="h-5 w-5" /> Flujo de Stock
            </CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium">Histórico de actividad de los últimos meses.</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="mes" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="stock" 
                    fill="var(--color-stock)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={barSize}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-primary font-bold flex items-center gap-2">
              <Clock strokeWidth={1.5} className="h-5 w-5" /> Recientes
            </CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium">Últimos movimientos del almacén.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {MOVIMIENTOS_INICIALES.map((mov) => {
                const articulo = ARTICULOS_INICIALES.find(a => a.id === mov.articuloId)
                return (
                  <div key={mov.id} className="flex items-center text-sm group">
                    <div className={`mr-3 md:mr-4 rounded-xl p-2.5 flex-shrink-0 transition-colors ${mov.tipo === 'entrada' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {mov.tipo === 'entrada' ? <ArrowUpRight strokeWidth={2} className="h-4 w-4" /> : <ArrowDownRight strokeWidth={2} className="h-4 w-4" />}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="font-bold leading-none truncate group-hover:text-primary transition-colors">{articulo?.nombre}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                        {mov.tipo} • {mov.cantidad} {articulo?.unidad}
                      </p>
                    </div>
                    <div className="ml-2 font-bold text-[10px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                      {new Date(mov.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
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
