import { Injectable, computed, signal } from '@angular/core';
import { Empleado, RolEmpleado } from '../models/empleado.model';

interface Credenciales {
  nomina: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly empleados: Empleado[] = [
    {
      nomina: 'A001',
      nombre: 'Administrador',
      apellidoPaterno: 'Sistema',
      apellidoMaterno: '',
      rol: 'Administrador',
      estado: true,
      contrasena: '123456'
    },
    {
      nomina: 'E001',
      nombre: 'Empleado',
      apellidoPaterno: 'General',
      apellidoMaterno: '',
      rol: 'Empleado',
      estado: true,
      contrasena: '123'
    }
  ];

  private readonly usuarioActualSignal = signal<Empleado | null>(null);

  readonly usuarioActual = computed(() => this.usuarioActualSignal());
  readonly estaAutenticado = computed(() => this.usuarioActualSignal() !== null);

  login(credenciales: Credenciales): Empleado | null {
    const { nomina, contrasena } = credenciales;
    const encontrado = this.empleados.find(
      (e) => e.nomina === nomina && e.contrasena === contrasena && e.estado
    );

    if (!encontrado) {
      this.usuarioActualSignal.set(null);
      return null;
    }

    this.usuarioActualSignal.set(encontrado);
    return encontrado;
  }

  logout(): void {
    this.usuarioActualSignal.set(null);
  }

  obtenerRolActual(): RolEmpleado | null {
    const usuario = this.usuarioActualSignal();
    return usuario ? usuario.rol : null;
  }
}

