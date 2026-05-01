export type RolTrabajador = 'administrador' | 'operario' | 'supervisor';

export interface Trabajador {
  id: string;
  nombre: string;
  correo: string;
  rol: RolTrabajador;
  activo: boolean;
  fechaRegistro: string;
}

export interface Articulo {
  id: string;
  nombre: string;
  descripcion: string;
  unidad: string; // kg, unidades, litros, etc.
  categoria: string;
  stockActual: number;
}

export type TipoMovimiento = 'entrada' | 'salida';

export interface Movimiento {
  id: string;
  articuloId: string;
  trabajadorId: string;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  notas?: string;
}