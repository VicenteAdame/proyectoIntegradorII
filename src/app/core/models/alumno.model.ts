export type RolAlumno = 'Administrador' | 'Empleado';

export interface AlumnoModel {
  id?: string;
  matricula: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  carrera: string;
  estado: boolean;
}