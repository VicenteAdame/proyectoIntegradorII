import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private url="https://httpclientproyectointegradorii-default-rtdb.firebaseio.com/";
  constructor(private http: HttpClient) { }
// metodo para obtener los alumnos de la base de datos
  obtenerAlumnos(): Observable<any> {
    return this.http.get(`${this.url}alumnos.json`);
  }

  agregarAlumno(alumno: any) {
    return this.http.post(`${this.url}alumnos.json`, alumno);
  }

  eliminarAlumno(id: string) {
    return this.http.delete(`${this.url}alumnos/${id}.json`);
  }

  actualizarAlumno(id:string,alumno:any){
    return this.http.put(`${this.url}alumnos/${id}.json`,alumno);
  }
}
