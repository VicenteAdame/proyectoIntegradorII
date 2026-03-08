import { inject, Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  DocumentReference 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})


export abstract class BaseCudService<T> {
  protected firestore: Firestore = inject(Firestore);
  protected abstract collectionName: string;


  crear(data: T): Promise<DocumentReference> {
    const ref = collection(this.firestore, this.collectionName);
    // Firebase requiere objetos planos, por eso usamos un cast
    return addDoc(ref, data as any); 
  }

  // 2. READ (Obtener todos)
  obtenerTodos(): Observable<T[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  // 3. UPDATE
  actualizar(id: string, data: Partial<T>): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(ref, data as any);
  }

  // 4. DELETE
  eliminar(id: string): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(ref);
  }

}
