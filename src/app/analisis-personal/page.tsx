"use client"

import React, { useState, useMemo } from 'react'
import { 
  Users, 
  ShieldCheck, 
  UserX, 
  Sparkles, 
  Loader2, 
  PieChart as PieChartIcon,
  TrendingUp,
  BrainCircuit
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TRABAJADORES_INICIALES } from "@/lib/data-mock"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { analizarPersonal, type AnalizarPersonalOutput } from '@/ai/flows/analizar-personal-flow'
import { useToast } from '@/hooks/use-toast'

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))'];

export default function AnalisisPersonalPage() {
  const { toast } = useToast()
  const [isCargandoIA, setIsCargandoIA] = useState(false)
  const [analisisIA, setAnalisisIA] = useState<AnalizarPersonalOutput | null>(null)

  const stats = useMemo(() => {
    const activos = TRABAJADORES_INICIALES.filter(t => t.activo).length
    const inactivos = TRABAJADORES_INICIALES.length - activos
    const roles = TRABAJADORES_INICIALES.reduce((acc: any, t) => {
      acc[t.rol] = (acc[t.rol] || 0) + 1
      return acc
    }, {})

    const chartData = Object.keys(roles).map(rol => ({
      name: rol.charAt(0).toUpperCase() + rol.slice(1),
      value: roles[rol]
    }))

    return { activos, inactivos, chartData }
  }, [])

  const manejarAnalisisIA = async () => {
    setIsCargandoIA(true)
    try {
      const resultado = await analizarPersonal({
        trabajadores: TRABAJADORES_INICIALES.map(t => ({
          nombre: t.nombre,
          rol: t.rol,
          activo: t.activo,
          fechaRegistro: t.fechaRegistro
        }))
      })
      setAnalisisIA(resultado)
      toast({
        title: "Análisis completado",
        description: "Insights generados exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el análisis.",
        variant: "destructive"
      })
    } finally {
      setIsCargandoIA(false)
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Análisis de Personal</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">Métricas asistidas por IA sobre tu equipo.</p>
        </div>
        <Button 
          onClick={manejarAnalisisIA} 
          disabled={isCargandoIA}
          className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md h-10 md:h-11"
        >
          {isCargandoIA ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
          Insights con IA
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-l-4 border-l-primary py-1">
          <CardHeader className="pb-1 px-4">
            <CardTitle className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Total Personal</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {TRABAJADORES_INICIALES.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 py-1">
          <CardHeader className="pb-1 px-4">
            <CardTitle className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Activos</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              {stats.activos}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive py-1">
          <CardHeader className="pb-1 px-4">
            <CardTitle className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">Inactivos</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <UserX className="h-5 w-5 text-destructive" />
              {stats.inactivos}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-primary font-bold text-base md:text-lg">
              <PieChartIcon className="h-5 w-5" /> Distribución Roles
            </CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium">Proporción de cargos.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] md:h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {analisisIA ? (
          <Card className="bg-primary/5 border-dashed border-primary/20 shadow-sm animate-in zoom-in-95 duration-500 overflow-hidden">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-primary font-bold text-base md:text-lg">
                <Sparkles className="h-5 w-5 text-accent" /> Análisis Inteligente
              </CardTitle>
              <CardDescription className="text-primary/70 font-medium text-xs">Generado por Genkit AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
              <div className="text-xs md:text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                {analisisIA.analisis}
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-xs md:text-sm text-primary flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Recomendaciones
                </h4>
                <ul className="grid gap-2">
                  {analisisIA.recomendaciones.map((rec, i) => (
                    <li key={i} className="text-[10px] md:text-xs bg-white p-2.5 rounded-lg border border-primary/10 shadow-sm flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0">{i+1}</span>
                      <span className="font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 md:p-12 text-center border-dashed border-2 bg-muted/20">
            <BrainCircuit className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-base md:text-lg font-bold text-muted-foreground">Esperando Análisis</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground max-w-[240px] mt-2 font-medium">
              Usa el botón superior para procesar los datos con IA.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
