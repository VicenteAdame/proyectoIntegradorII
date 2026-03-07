import { Injectable } from '@angular/core';
import {Firestore, collection, collectionData}from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmpleadoModel } from '../models/empleado.model';


@Injectable({
  providedIn: 'root',
})


export class EmpleadoBaseService {
  constructor(private firestore: Firestore) {}

  getEmpleados(): Observable<EmpleadoModel[]> {
    const empleadosRef = collection(this.firestore, 'empleados');
    return collectionData(empleadosRef, { idField: 'id' }) as Observable<EmpleadoModel[]>;
  }





}
