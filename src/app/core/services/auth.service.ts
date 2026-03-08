import { Injectable, computed, signal } from '@angular/core';
import { EmpleadoModel, RolEmpleado } from '../models/empleado.model';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

interface Credenciales {
  nomina: string;
  contrasena: string;
}


@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private readonly usuarioActualSignal = signal<EmpleadoModel | null>(null);

  readonly usuarioActual = computed(() => this.usuarioActualSignal());
  readonly estaAutenticado = computed(() => this.usuarioActualSignal() !== null);

  constructor(private firestore: Firestore) { }

  async login(credenciales: Credenciales): Promise<EmpleadoModel | null> {
    const { nomina, contrasena } = credenciales;

    // Consulta a la colección empleados
    const empleadosRef = collection(this.firestore, 'empleados');
    const q = query(
      empleadosRef,
      where('nomina', '==', nomina),
      where('contrasena', '==', contrasena),
      where('estado', '==', true)
    );

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        this.usuarioActualSignal.set(null);
        return null;
      }

      // Tomamos el primer documento que coincida
      const doc = querySnapshot.docs[0];
      const empleadoLogueado = { id: doc.id, ...doc.data() } as unknown as EmpleadoModel;

      this.usuarioActualSignal.set(empleadoLogueado);
      return empleadoLogueado;

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

