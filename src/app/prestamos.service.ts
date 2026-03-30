import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones CRUD de Préstamos usando HttpClient
 * Conecta con el endpoint prestamos.json en Firebase Realtime Database
 */
@Injectable({
  providedIn: 'root',
})
export class PrestamosService {

  // URL base de la base de datos
  private url = "https://httpclientproyectointegradorii-default-rtdb.firebaseio.com/";

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los préstamos registrados
   */
  obtenerPrestamos(): Observable<any> {
    return this.http.get(`${this.url}prestamos.json`);
  }

  /**
   * Registra un nuevo préstamo en la base de datos
   */
  agregarPrestamo(prestamo: any) {
    return this.http.post(`${this.url}prestamos.json`, prestamo);
  }

  /**
   * Elimina un préstamo usando su ID
   */
  eliminarPrestamo(id: string) {
    return this.http.delete(`${this.url}prestamos/${id}.json`);
  }

  /**
   * Actualiza un préstamo existente sobrescribiéndolo por completo (PUT)
   */
  actualizarPrestamo(id: string, prestamo: any) {
    return this.http.put(`${this.url}prestamos/${id}.json`, prestamo);
  }
}
