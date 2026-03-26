import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {

  private url="https://httpclientproyectointegradorii-default-rtdb.firebaseio.com/";
  constructor(private http: HttpClient) { }

  obtenerEmpleados(): Observable<any> {
    return this.http.get(`${this.url}empleados.json`);
  }

  agregarEmpleado(empleado: any) {
    return this.http.post(`${this.url}empleados.json`, empleado);
  }

  eliminarEmpleado(id: string) {
    return this.http.delete(`${this.url}empleados/${id}.json`);
  }

  actualizarEmpleado(id:string,empleado:any){
    return this.http.put(`${this.url}empleados/${id}.json`,empleado);
  }

  

}
