import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones CRUD de Historial de devoluciones usando HttpClient
 * Conecta con el endpoint historiales.json en Firebase Realtime Database
 */
@Injectable({
  providedIn: 'root',
})
export class HistorialesService {

  // URL base de Firebase
  private url = "https://httpclientproyectointegradorii-default-rtdb.firebaseio.com/";

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todo el historial de devoluciones
   */
  obtenerHistoriales(): Observable<any> {
    return this.http.get(`${this.url}historiales.json`);
  }

  /**
   * Documenta una nueva devolución en el historial
   */
  agregarHistorial(historial: any) {
    return this.http.post(`${this.url}historiales.json`, historial);
  }

  /**
   * Elimina un registro del historial por su identificador
   */
  eliminarHistorial(id: string) {
    return this.http.delete(`${this.url}historiales/${id}.json`);
  }

  /**
   * Actualiza un registro del historial (PUT overwrite)
   */
  actualizarHistorial(id: string, historial: any) {
    return this.http.put(`${this.url}historiales/${id}.json`, historial);
  }
}
