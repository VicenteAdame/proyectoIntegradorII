import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Alumno } from '../alumno/alumno';
import { Empleado } from '../empleado/empleado';
import { Herramienta } from '../herramienta/herramienta';

@Component({
    selector: 'app-tah',
    standalone: true,
    imports: [CommonModule, RouterModule, Alumno, Empleado, Herramienta,RouterLink],
    templateUrl: './tah.component.html',
    styleUrl: './tah.css'
})
export class TahComponent {

}
