'use server';
/**
 * @fileOverview Un agente de IA para analizar los datos del personal.
 *
 * - analizarPersonal - Función para generar un análisis estratégico de los trabajadores.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalizarPersonalInputSchema = z.object({
  trabajadores: z.array(z.object({
    nombre: z.string(),
    rol: z.string(),
    activo: z.boolean(),
    fechaRegistro: z.string(),
  })).describe('La lista de trabajadores registrados en el sistema.'),
});

export type AnalizarPersonalInput = z.infer<typeof AnalizarPersonalInputSchema>;

const AnalizarPersonalOutputSchema = z.object({
  analisis: z.string().describe('El análisis detallado generado por la IA sobre la estructura del personal.'),
  recomendaciones: z.array(z.string()).describe('Lista de recomendaciones basadas en los datos.'),
});

export type AnalizarPersonalOutput = z.infer<typeof AnalizarPersonalOutputSchema>;

export async function analizarPersonal(input: AnalizarPersonalInput): Promise<AnalizarPersonalOutput> {
  return analizarPersonalFlow(input);
}

const promptAnalisisPersonal = ai.definePrompt({
  name: 'promptAnalisisPersonal',
  input: {schema: AnalizarPersonalInputSchema},
  output: {schema: AnalizarPersonalOutputSchema},
  prompt: `Eres un experto en Recursos Humanos y Gestión de Operaciones. Analiza la siguiente lista de trabajadores de un almacén:

Lista de Trabajadores:
{{#each trabajadores}}
- {{{nombre}}}: Rol: {{{rol}}}, Estado: {{#if activo}}Activo{{else}}Inactivo{{/if}}, Registrado desde: {{{fechaRegistro}}}
{{/each}}

Tu tarea es:
1. Proporcionar un resumen ejecutivo de la composición del equipo (distribución de roles y balance de actividad).
2. Identificar posibles riesgos (por ejemplo, pocos supervisores, exceso de inactividad).
3. Sugerir 3 recomendaciones para optimizar la gestión del personal.

Por favor, genera la respuesta en español de forma profesional y concisa.`,
});

const analizarPersonalFlow = ai.defineFlow(
  {
    name: 'analizarPersonalFlow',
    inputSchema: AnalizarPersonalInputSchema,
    outputSchema: AnalizarPersonalOutputSchema,
  },
  async input => {
    const {output} = await promptAnalisisPersonal(input);
    if (!output) {
      throw new Error('No se pudo generar el análisis del personal.');
    }
    return output;
  }
);
