"use client"

import React, { useState, useMemo } from 'react'
import { 
  UserRound, 
  ShieldCheck, 
  UserX, 
  Sparkles, 
  Loader2, 
  PieChart as PieChartIcon,
  TrendingUp,
  BrainCircuit,
  Target
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
        description: "Insights generados exitosamente por la IA.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con el motor de IA.",
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <PieChartIcon strokeWidth={1.5} className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Análisis de Personal</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium pl-12">Métricas avanzadas y recomendaciones con Inteligencia Artificial.</p>
        </div>
        <Button 
          onClick={manejarAnalisisIA} 
          disabled={isCargandoIA}
          className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg h-12 rounded-2xl px-6"
        >
          {isCargandoIA ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BrainCircuit strokeWidth={1.5} className="mr-2 h-5 w-5" />}
          Analizar con IA
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-none bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 px-6 pt-6">
             <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dotación Total</CardTitle>
                <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                    <UserRound strokeWidth={1.5} className="h-4 w-4" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-black text-primary">
              {TRABAJADORES_INICIALES.length}
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Colaboradores</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 px-6 pt-6">
             <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Actividad</CardTitle>
                <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                    <ShieldCheck strokeWidth={1.5} className="h-4 w-4" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-black text-green-600">
              {stats.activos}
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Personal en activo</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 px-6 pt-6">
             <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inactivos</CardTitle>
                <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                    <UserX strokeWidth={1.5} className="h-4 w-4" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-3xl font-black text-red-600">
              {stats.inactivos}
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Cuentas suspendidas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="bg-white border-none shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-primary font-bold text-lg">
              <PieChartIcon strokeWidth={1.5} className="h-5 w-5" /> Distribución de Roles
            </CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium">Composición jerárquica del equipo actual.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] md:h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-none" />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {analisisIA ? (
          <Card className="bg-primary/5 border-none shadow-xl animate-in zoom-in-95 duration-500 overflow-hidden rounded-3xl ring-1 ring-primary/10">
            <CardHeader className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-primary font-black text-lg">
                  <Sparkles strokeWidth={1.5} className="h-6 w-6 text-accent" /> Insights Estratégicos
                </CardTitle>
                <div className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  AI Powered
                </div>
              </div>
              <CardDescription className="text-primary/70 font-bold text-xs uppercase tracking-widest mt-2">Generado por Genkit AI v1.0</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6 md:p-8 pt-0">
              <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap bg-white/50 p-6 rounded-2xl border border-primary/5">
                {analisisIA.analisis}
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                  <Target strokeWidth={2} className="h-4 w-4" /> Recomendaciones Clave
                </h4>
                <div className="grid gap-3">
                  {analisisIA.recomendaciones.map((rec, i) => (
                    <div key={i} className="text-xs bg-white p-4 rounded-xl border border-primary/5 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
                      <span className="bg-primary text-primary-foreground h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">{i+1}</span>
                      <span className="font-bold text-foreground/70 leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-none bg-white rounded-2xl shadow-sm">
            <div className="p-6 rounded-full bg-muted/20 mb-6">
                <BrainCircuit strokeWidth={1} className="h-16 w-16 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-black text-muted-foreground">Motor de IA en espera</h3>
            <p className="text-xs text-muted-foreground/60 max-w-[280px] mt-3 font-bold uppercase tracking-widest leading-loose">
              Pulsa el botón superior para procesar los datos y obtener recomendaciones tácticas.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
