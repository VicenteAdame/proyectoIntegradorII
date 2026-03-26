import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {

  private url="https://httpclientproyectointegradorii-default-rtdb.firebaseio.com/";
  constructor(private http: HttpClient) { }

  obtenerEmpleados(){
    return this.http.get(`${this.url}/.json`);
  }

  agregarEmpleado(empleado: any) {
    return this.http.post(`${this.url}/.json`, empleado);
  }

  eliminarEmpleado(id: string) {
    return this.http.delete(`${this.url}/${id}.json`);
  }

  actualizarEmpleado(id:string,empleado:any){
    return this.http.put(`${this.url}/${id}.json`,empleado);
  }

  

}
