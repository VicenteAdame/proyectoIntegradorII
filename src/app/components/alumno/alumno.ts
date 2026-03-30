import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlumnosService } from '../../alumnos.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlumnoModel } from '../../core/models/alumno.model';
import { NavegationComponent } from '../navegation-component/navegation-component';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavegationComponent, RouterLink],
  templateUrl: './alumno.html',
  styleUrl: './alumno.css',
})
export class Alumno implements OnInit {

  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private alumnoService = inject(AlumnosService);

  // Observable que contiene la lista de alumnos
  alumnos$!: Observable<AlumnoModel[]>;

  // Variables para controlar el estado de edición
  isEditing = false;
  idAlumnoActual: string | null = null;

  // Formulario reactivo
  alumnoForm = this.fb.nonNullable.group({
    matricula: ['', Validators.required],
    nombre: ['', Validators.required],
    apellidoPaterno: ['', Validators.required],
    apellidoMaterno: ['', Validators.required],
    carrera: ['', Validators.required],
    estado: [true]
  });

  ngOnInit() {
    this.cargarAlumnos();
  }

  /**
   * Carga la lista de alumnos desde Firebase
   */
  cargarAlumnos() {
    this.alumnos$ = this.alumnoService.obtenerAlumnos().pipe(
      map(data => Object.keys(data || {}).map(key => ({
        id: key,
        ...data[key]
      }) as AlumnoModel))
    );
  }

  /**
   * Registra un nuevo alumno o actualiza uno existente
   */
  guardarAlumno() {
    if (this.alumnoForm.invalid) {
      this.alumnoForm.markAllAsTouched();
      return;
    }

    const unAlumno: AlumnoModel = this.alumnoForm.getRawValue();

    try {
      if (this.isEditing && this.idAlumnoActual) {
        this.alumnoService.actualizarAlumno(this.idAlumnoActual, unAlumno).subscribe(() => {
          console.log('¡Alumno actualizado exitosamente!');
          this.cancelarEdicion();
          this.cargarAlumnos();
        });
      } else {
        this.alumnoService.agregarAlumno(unAlumno).subscribe(() => {
          console.log('¡Alumno registrado exitosamente!');
          this.cancelarEdicion();
          this.cargarAlumnos();
        });
      }
    } catch (error) {
      console.error('Error al guardar el alumno:', error);
    }
  }

  /**
   * Prepara el formulario para la edición de un alumno cargando sus datos
   */
  editarAlumno(alumno: AlumnoModel) {
    this.isEditing = true;
    this.idAlumnoActual = alumno.id!;
    
    this.alumnoForm.patchValue({
      matricula: alumno.matricula,
      nombre: alumno.nombre,
      apellidoPaterno: alumno.apellidoPaterno,
      apellidoMaterno: alumno.apellidoMaterno,
      carrera: alumno.carrera,
      estado: alumno.estado
    });

    setTimeout(() => {
      const tabRegistrar = document.getElementById('registrar-tab');
      if (tabRegistrar) {
        tabRegistrar.click();
      }
    }, 100);
  }

  /**
   * Elimina un registro de la base de datos
   */
  eliminarAlumno(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      try {
        this.alumnoService.eliminarAlumno(id).subscribe(() => {
          console.log('¡Alumno eliminado!');
          this.cargarAlumnos();
        });
      } catch (error) {
        console.error('Error al eliminar alumno:', error);
      }
    }
  }

  /**
   * Cambia rápidamente el estado (Activo/Inactivo)
   */
  toggleEstado(alumno: AlumnoModel) {
    try {
      const nuevoEstado = !alumno.estado;
      this.alumnoService.actualizarAlumno(alumno.id!, { ...alumno, estado: nuevoEstado }).subscribe(() => {
        console.log(`Estado del alumno cambiado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
        this.cargarAlumnos();
      });
    } catch (error) {
      console.error('Error al cambiar de estado:', error);
    }
  }

  /**
   * Limpia el formulario cancelando la operación actual
   */
  cancelarEdicion() {
    this.isEditing = false;
    this.idAlumnoActual = null;
    this.alumnoForm.reset({
      estado: true
    });
    
    setTimeout(() => {
      const tabListado = document.getElementById('listado-tab');
      if (tabListado) {
        tabListado.click();
      }
    }, 100);
  }
}
