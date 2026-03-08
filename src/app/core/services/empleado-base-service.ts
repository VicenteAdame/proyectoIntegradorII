import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmpleadoModel } from '../models/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoBaseService {
  constructor(private firestore: Firestore) { }

  getEmpleados(): Observable<EmpleadoModel[]> {
    const empleadosRef = collection(this.firestore, 'empleados');
    return collectionData(empleadosRef, { idField: 'id' }) as Observable<EmpleadoModel[]>;
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
