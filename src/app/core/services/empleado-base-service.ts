import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmpleadoModel } from '../models/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoBaseService {
  private empleados$: Observable<EmpleadoModel[]>;

  constructor(private firestore: Firestore) {
    // Inicializar dentro del constructor asegura estar dentro del "Injection Context" de Angular
    // evitando el error "warnOutsideInjectionContext"
    const empleadosRef = collection(this.firestore, 'empleados');
    const empleadosQuery = query(empleadosRef, orderBy('nomina'));

    this.empleados$ = new Observable<EmpleadoModel[]>(subscriber => {
      const unsubscribe = onSnapshot(empleadosQuery,
        (snapshot) => {
          const empleados = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          } as unknown as EmpleadoModel));
          subscriber.next(empleados);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  getEmpleados(): Observable<EmpleadoModel[]> {
    return this.empleados$;
  }

  async crear(empleado: any): Promise<any> {
    const empleadosRef = collection(this.firestore, 'empleados');
    const dataToSave = { ...empleado };
    Object.keys(dataToSave).forEach(key => dataToSave[key] === undefined && delete dataToSave[key]);
    return addDoc(empleadosRef, dataToSave);
  }

  async actualizar(id: string, empleado: any): Promise<void> {
    const empleadoDocRef = doc(this.firestore, `empleados/${id}`);
    const dataToSave = { ...empleado };
    Object.keys(dataToSave).forEach(key => dataToSave[key] === undefined && delete dataToSave[key]);
    return updateDoc(empleadoDocRef, dataToSave);
  }

  async eliminar(id: string): Promise<void> {
    const empleadoDocRef = doc(this.firestore, `empleados/${id}`);
    return deleteDoc(empleadoDocRef);
  }
}
