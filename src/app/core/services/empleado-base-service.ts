import { Injectable } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmpleadoModel } from '../models/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoBaseService {
  constructor(private firestore: Firestore) { }

  getEmpleados(): Observable<EmpleadoModel[]> {
    const empleadosRef = collection(this.firestore, 'empleados');

    return new Observable<EmpleadoModel[]>(subscriber => {
      const unsubscribe = onSnapshot(empleadosRef,
        (snapshot) => {
          const empleados = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as unknown as EmpleadoModel));
          subscriber.next(empleados);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }
}
