'use server';
/**
 * @fileOverview Un agente de IA para generar descripciones de artículos de inventario.
 *
 * - generarDescripcionArticuloInventario - Una función que gestiona el proceso de generación de descripciones.
 * - GenerarDescripcionArticuloInventarioInput - El tipo de entrada para la función generarDescripcionArticuloInventario.
 * - GenerarDescripcionArticuloInventarioOutput - El tipo de retorno para la función generarDescripcionArticuloInventario.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Esquema de entrada para la generación de la descripción del artículo.
const GenerarDescripcionArticuloInventarioInputSchema = z.object({
  nombreArticulo: z
    .string()
    .describe('El nombre del artículo de inventario para el que se generará una descripción.'),
  categoriaArticulo: z
    .string()
    .optional()
    .describe('La categoría del artículo de inventario (opcional, para mayor contexto).'),
});

export type GenerarDescripcionArticuloInventarioInput = z.infer<
  typeof GenerarDescripcionArticuloInventarioInputSchema
>;

// Esquema de salida para la descripción generada del artículo.
const GenerarDescripcionArticuloInventarioOutputSchema = z.object({
  descripcionGenerada: z.string().describe('La descripción concisa y relevante generada por la IA.'),
});

export type GenerarDescripcionArticuloInventarioOutput = z.infer<
  typeof GenerarDescripcionArticuloInventarioOutputSchema
>;

/**
 * Genera una descripción concisa y relevante para un artículo de inventario utilizando IA.
 *
 * @param input - Un objeto que contiene el nombre del artículo y, opcionalmente, su categoría.
 * @returns Una promesa que se resuelve en un objeto con la descripción generada.
 */
export async function generarDescripcionArticuloInventario(
  input: GenerarDescripcionArticuloInventarioInput
): Promise<GenerarDescripcionArticuloInventarioOutput> {
  return generarDescripcionArticuloInventarioFlow(input);
}

// Define el prompt para la generación de la descripción del artículo.
const promptGenerarDescripcionArticulo = ai.definePrompt({
  name: 'promptGenerarDescripcionArticulo',
  input: {schema: GenerarDescripcionArticuloInventarioInputSchema},
  output: {schema: GenerarDescripcionArticuloInventarioOutputSchema},
  prompt: `Eres un asistente de IA experto en la gestión de inventarios. Tu tarea es generar una descripción corta, concisa y relevante para un artículo de inventario. La descripción debe capturar los aspectos clave del artículo, facilitando su identificación y gestión.

Información del artículo:
Nombre del artículo: {{{nombreArticulo}}}
{{#if categoriaArticulo}}
Categoría del artículo: {{{categoriaArticulo}}}
{{/if}}

Por favor, genera una descripción adecuada en español.`,
});

// Define el flujo de Genkit para la generación de la descripción del artículo.
const generarDescripcionArticuloInventarioFlow = ai.defineFlow(
  {
    name: 'generarDescripcionArticuloInventarioFlow',
    inputSchema: GenerarDescripcionArticuloInventarioInputSchema,
    outputSchema: GenerarDescripcionArticuloInventarioOutputSchema,
  },
  async input => {
    // Llama al prompt para generar la descripción.
    const {output} = await promptGenerarDescripcionArticulo(input);
    if (!output) {
      throw new Error('No se pudo generar la descripción del artículo.');
    }
    return output;
  }
);
