import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EmpleadoModel } from '../../core/models/empleado.model';
import { EmpleadoBaseService } from '../../core/services/empleado-base-service';


@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empleado.html',
  styleUrl: './empleado.css',
})


export class Empleado {
  empleados$: Observable<EmpleadoModel[]>;

  constructor(private empleadobaseService: EmpleadoBaseService) {
    this.empleados$ = this.empleadobaseService.getEmpleados();
  }


}
