import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmpleadoModel } from '../models/empleado.model';


@Injectable({
  providedIn: 'root',
})


export class EmpleadoBaseService {
  constructor(private firestore: Firestore) { }

  getEmpleados(): Observable<EmpleadoModel[]> {
    const empleadosRef = collection(this.firestore, 'empleados');
    const q = query(empleadosRef);
    return collectionData(q, { idField: 'id' }) as Observable<EmpleadoModel[]>;
  }





}
