import { Injectable } from '@angular/core';
import { BaseCudService } from './base-crud-service';
import { Empleado1 } from '../models/empleadoModelCrud';



@Injectable({
  providedIn: 'root',
})


export class EmpleadoCrudService extends BaseCudService<Empleado1> {
  protected collectionName = 'empleados';
}
