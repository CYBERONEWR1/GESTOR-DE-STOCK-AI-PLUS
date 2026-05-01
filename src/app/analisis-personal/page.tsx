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
        description: "La IA ha procesado los datos de tu equipo exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el análisis inteligente.",
        variant: "destructive"
      })
    } finally {
      setIsCargandoIA(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Análisis de Personal</h1>
          <p className="text-muted-foreground font-medium">Visualización de datos y analítica asistida por IA sobre tu equipo.</p>
        </div>
        <Button 
          onClick={manejarAnalisisIA} 
          disabled={isCargandoIA}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md"
        >
          {isCargandoIA ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
          Generar Insights con IA
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Total Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {TRABAJADORES_INICIALES.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              {stats.activos}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <UserX className="h-6 w-6 text-destructive" />
              {stats.inactivos}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-bold">
              <PieChartIcon className="h-5 w-5" /> Distribución por Roles
            </CardTitle>
            <CardDescription className="font-medium">Proporción de cargos dentro de la organización.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {analisisIA ? (
          <Card className="bg-primary/5 border-dashed border-primary/20 shadow-sm animate-in zoom-in-95 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-5 w-5 text-accent" /> Análisis Inteligente
              </CardTitle>
              <CardDescription className="text-primary/70 font-medium">Observaciones generadas por Genkit AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                {analisisIA.analisis}
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-primary flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Recomendaciones Estratégicas
                </h4>
                <ul className="grid gap-2">
                  {analisisIA.recomendaciones.map((rec, i) => (
                    <li key={i} className="text-sm bg-white p-3 rounded-lg border border-primary/10 shadow-sm flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                      <span className="font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-muted/20">
            <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-muted-foreground">Esperando Análisis</h3>
            <p className="text-sm text-muted-foreground max-w-[280px] mt-2 font-medium">
              Haz clic en el botón superior para que la IA analice los datos de tu equipo.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
