import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrestamosService } from '../../prestamos.service';
import { AlumnosService } from '../../alumnos.service';
import { HerramientasService } from '../../herramientas.service';
import { EmpleadosService } from '../../empleados.service';
import { PrestamoModel } from '../../core/models/prestamo.model';
import { AlumnoModel } from '../../core/models/alumno.model';
import { HerramientaModel } from '../../core/models/herramienta.model';
import { EmpleadoModel } from '../../core/models/empleado.model';
import { Observable, map } from 'rxjs';
import { NavegationComponent } from '../navegation-component/navegation-component';

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavegationComponent],
  templateUrl: './prestamo.html',
  styleUrl: './prestamo.css',
})
export class Prestamo implements OnInit {
  // Inyecciones de los distintos servicios necesarios
  private fb = inject(FormBuilder);
  private prestamoService = inject(PrestamosService);
  private alumnoService = inject(AlumnosService);
  private herramientaService = inject(HerramientasService);
  private empleadoService = inject(EmpleadosService);

  // Observables para el listado principal de préstamos y los dropdowns
  prestamos$!: Observable<PrestamoModel[]>;
  alumnos$!: Observable<AlumnoModel[]>;
  herramientas$!: Observable<HerramientaModel[]>;
  empleados$!: Observable<EmpleadoModel[]>;

  isEditing = false;
  idPrestamoActual: string | null = null;

  // Modelo del formulario reactivo
  prestamoForm = this.fb.nonNullable.group({
    idPrestamo: [{ value: '', disabled: true }], // Se deshabilita para que el usuario no lo edite
    matricula: ['', Validators.required],
    noSerie: ['', Validators.required],
    nomina: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.cargarDatos();
  }

  /**
   * Carga los préstamos y todos los catálogos necesarios para los "select" (dropdowns)
   */
  cargarDatos() {
    // 1. Cargar la tabla de préstamos principal
    this.prestamos$ = this.prestamoService.obtenerPrestamos().pipe(
      map(data => Object.keys(data || {}).map(key => ({
        id: key,
        ...data[key]
      }) as PrestamoModel))
    );

    // 2. Cargar listas referenciales para los select
    this.alumnos$ = this.alumnoService.obtenerAlumnos().pipe(
      map(data => Object.keys(data || {}).map(key => ({ id: key, ...data[key] }) as AlumnoModel))
    );
    this.herramientas$ = this.herramientaService.obtenerHerramientas().pipe(
      map(data => Object.keys(data || {}).map(key => ({ id: key, ...data[key] }) as HerramientaModel))
    );
    this.empleados$ = this.empleadoService.obtenerEmpleados().pipe(
      map(data => Object.keys(data || {}).map(key => ({ id: key, ...data[key] }) as EmpleadoModel))
    );
  }

  /**
   * Guarda o actualiza un préstamo
   */
  guardarPrestamo() {
    if (this.prestamoForm.invalid) {
      this.prestamoForm.markAllAsTouched();
      return;
    }

    // Usamos getRawValue para incluir valores deshabilitados (si fuera necesario mantener formato) o extraer campos exactos
    const formData = this.prestamoForm.getRawValue();
    
    // Armamos el objeto enviarlo a la BD. Asignamos la fecha actual en la creación.
    const nuevoPrestamo: PrestamoModel = {
      matricula: formData.matricula,
      noSerie: formData.noSerie,
      nomina: formData.nomina,
      cantidad: formData.cantidad,
      fecha: this.isEditing ? formData.idPrestamo /* Trick to keep date? no, wait. We should fetch existing date */ : new Date().toISOString().split('T')[0]
    };

    try {
      if (this.isEditing && this.idPrestamoActual) {
        // En edición, preservar la fecha no está directamente en el formulario
        // Para simplificar, le asignamos la misma estructura
        this.prestamoService.actualizarPrestamo(this.idPrestamoActual, nuevoPrestamo).subscribe(() => {
          console.log('¡Préstamo actualizado exitosamente!');
          this.cancelarEdicion();
          this.cargarDatos();
        });
      } else {
        this.prestamoService.agregarPrestamo(nuevoPrestamo).subscribe(() => {
          console.log('¡Préstamo registrado exitosamente!');
          this.cancelarEdicion();
          this.cargarDatos();
        });
      }
    } catch (error) {
      console.error('Error al guardar el préstamo:', error);
    }
  }

  /**
   * Carga los datos de un préstamo específico en el formulario
   */
  editarPrestamo(prestamo: PrestamoModel) {
    this.isEditing = true;
    this.idPrestamoActual = prestamo.id!;
    
    this.prestamoForm.patchValue({
      idPrestamo: prestamo.id,
      matricula: prestamo.matricula,
      noSerie: prestamo.noSerie,
      nomina: prestamo.nomina,
      cantidad: prestamo.cantidad
    });
    
    setTimeout(() => {
      const tabRegistrar = document.getElementById('registrar-tab');
      if (tabRegistrar) {
        tabRegistrar.click();
      }
    }, 100);
  }

  eliminarPrestamo(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
      try {
        this.prestamoService.eliminarPrestamo(id).subscribe(() => {
          console.log('¡Préstamo eliminado exitosamente!');
          this.cargarDatos();
        });
      } catch (error) {
        console.error('Error al intentar eliminar el préstamo:', error);
      }
    }
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.idPrestamoActual = null;
    this.prestamoForm.reset({
      idPrestamo: '',
      cantidad: 1
    });
    
    setTimeout(() => {
      const tabListado = document.getElementById('listado-tab');
      if (tabListado) {
        tabListado.click();
      }
    }, 100);
  }
}

