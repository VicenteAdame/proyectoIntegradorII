export type RolEmpleado = 'Administrador' | 'Empleado';

export interface EmpleadoModel {
  nomina: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: RolEmpleado;
  estado: boolean;
  contrasena: string;
}

