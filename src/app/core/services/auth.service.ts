import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EmpleadoModel, RolEmpleado } from '../models/empleado.model';

interface Credenciales {
  nomina: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usuarioActualSignal = signal<EmpleadoModel | null>(null);
  private readonly url = "https://httpclientproyectointegradorii-default-rtdb.firebaseio.com/";

  readonly usuarioActual = computed(() => this.usuarioActualSignal());
  readonly estaAutenticado = computed(() => this.usuarioActualSignal() !== null);

  constructor(private http: HttpClient) { }

  async login(credenciales: Credenciales): Promise<EmpleadoModel | null> {
    const { nomina, contrasena } = credenciales;

    try {
      const resp = await firstValueFrom(this.http.get<{ [key: string]: any }>(`${this.url}empleados.json`));
      
      if (!resp) {
        this.usuarioActualSignal.set(null);
        return null;
      }

      const empleadosArray = Object.keys(resp).map(key => ({
        id: key,
        ...resp[key]
      })) as unknown as EmpleadoModel[];

      const empleadoLogueado = empleadosArray.find(
        (emp) => emp.nomina === nomina && emp.contrasena === contrasena && emp.estado === true
      );

      if (empleadoLogueado) {
        this.usuarioActualSignal.set(empleadoLogueado);
        return empleadoLogueado;
      }

      this.usuarioActualSignal.set(null);
      return null;

    } catch (error) {
      console.error('Error durante la autenticación:', error);
      this.usuarioActualSignal.set(null);
      return null;
    }
  }

  logout(): void {
    this.usuarioActualSignal.set(null);
  }

  obtenerRolActual(): RolEmpleado | null {
    const usuario = this.usuarioActualSignal();
    return usuario ? usuario.rol : null;
  }
}

