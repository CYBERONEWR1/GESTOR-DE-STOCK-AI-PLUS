import type { Trabajador, Articulo, Movimiento } from './types';

export const TRABAJADORES_INICIALES: Trabajador[] = [
  {
    id: 't1',
    nombre: 'Juan Pérez',
    correo: 'juan.perez@empresa.com',
    rol: 'administrador',
    activo: true,
    fechaRegistro: '2023-01-15',
  },
  {
    id: 't2',
    nombre: 'María García',
    correo: 'maria.garcia@empresa.com',
    rol: 'operario',
    activo: true,
    fechaRegistro: '2023-02-20',
  },
  {
    id: 't3',
    nombre: 'Carlos Ruiz',
    correo: 'carlos.ruiz@empresa.com',
    rol: 'supervisor',
    activo: true,
    fechaRegistro: '2023-03-10',
  },
];

export const ARTICULOS_INICIALES: Articulo[] = [
  {
    id: 'a1',
    nombre: 'Martillo de Acero 16oz',
    descripcion: 'Martillo forjado en una sola pieza con mango ergonómico.',
    unidad: 'unidades',
    categoria: 'Herramientas Manuales',
    stockActual: 25,
  },
  {
    id: 'a2',
    nombre: 'Pintura Blanca 5 Galones',
    descripcion: 'Pintura látex acrílica de alta cobertura.',
    unidad: 'baldes',
    categoria: 'Construcción',
    stockActual: 10,
  },
  {
    id: 'a3',
    nombre: 'Cable Eléctrico THHN 12AWG',
    descripcion: 'Cable de cobre con aislamiento termoplástico.',
    unidad: 'metros',
    categoria: 'Electricidad',
    stockActual: 500,
  },
];

export const MOVIMIENTOS_INICIALES: Movimiento[] = [
  {
    id: 'm1',
    articuloId: 'a1',
    trabajadorId: 't2',
    tipo: 'entrada',
    cantidad: 10,
    fecha: '2024-05-10T10:00:00Z',
    notas: 'Reposición de stock mensual',
  },
  {
    id: 'm2',
    articuloId: 'a3',
    trabajadorId: 't2',
    tipo: 'salida',
    cantidad: 50,
    fecha: '2024-05-12T14:30:00Z',
    notas: 'Proyecto de oficinas centrales',
  },
];