import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones CRUD de Herramientas usando HttpClient
 * Conecta con el endpoint herramientas.json en Firebase Realtime Database
 */
@Injectable({
  providedIn: 'root',
})
export class HerramientasService {

  // URL base de la base de datos de Firebase
  private url = "https://httpclientproyectointegradorii-default-rtdb.firebaseio.com/";

  // Inyección de HttpClient para realizar peticiones HTTP
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las herramientas desde Firebase
   * @returns Observable con los datos crudos de Firebase (objeto con claves autogeneradas)
   */
  obtenerHerramientas(): Observable<any> {
    return this.http.get(`${this.url}herramientas.json`);
  }

  /**
   * Agrega una nueva herramienta a la base de datos
   * @param herramienta Objeto con los datos de la herramienta
   * @returns Observable con la respuesta del servidor (id generado)
   */
  agregarHerramienta(herramienta: any) {
    return this.http.post(`${this.url}herramientas.json`, herramienta);
  }

  /**
   * Elimina una herramienta específica por su ID
   * @param id Identificador único de la herramienta en Firebase
   * @returns Observable vacío tras completarse la eliminación
   */
  eliminarHerramienta(id: string) {
    return this.http.delete(`${this.url}herramientas/${id}.json`);
  }

  /**
   * Actualiza los datos de una herramienta existente sobrescribiéndolos (PUT)
   * @param id Identificador único de la herramienta
   * @param herramienta Nuevos datos de la herramienta
   * @returns Observable con la respuesta del servidor
   */
  actualizarHerramienta(id: string, herramienta: any) {
    return this.http.put(`${this.url}herramientas/${id}.json`, herramienta);
  }
}
