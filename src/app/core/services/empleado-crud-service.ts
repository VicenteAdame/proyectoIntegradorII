import { Injectable } from '@angular/core';
import { BaseCudService } from './base-crud-service';
import { Empleado } from '../models/empleadoModelCrud';



@Injectable({
  providedIn: 'root',
})


export class EmpleadoCrudService extends BaseCudService<Empleado> {
  protected collectionName = 'empleados';
}
