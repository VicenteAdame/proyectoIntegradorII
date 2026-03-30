import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistorialesService } from '../../historiales.service';
import { PrestamosService } from '../../prestamos.service';
import { HistorialModel } from '../../core/models/historial.model';
import { PrestamoModel } from '../../core/models/prestamo.model';
import { Observable, map } from 'rxjs';
import { NavegationComponent } from '../navegation-component/navegation-component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavegationComponent],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  // Inyecciones
  private fb = inject(FormBuilder);
  private historialService = inject(HistorialesService);
  private prestamoService = inject(PrestamosService);

  // Observables para la tabla y el select
  historiales$!: Observable<HistorialModel[]>;
  prestamos$!: Observable<PrestamoModel[]>;

  isEditing = false;
  idHistorialActual: string | null = null;

  // Formulario reactivo
  historialForm = this.fb.nonNullable.group({
    idHistorial: [{ value: '', disabled: true }],
    idPrestamo: ['', Validators.required],
    cantidadDevuelta: [1, [Validators.required, Validators.min(1)]],
    observaciones: ['']
  });

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargar historial
    this.historiales$ = this.historialService.obtenerHistoriales().pipe(
      map(data => Object.keys(data || {}).map(key => ({
        id: key,
        ...data[key]
      }) as HistorialModel))
    );

    // 2. Cargar préstamos para el select
    this.prestamos$ = this.prestamoService.obtenerPrestamos().pipe(
      map(data => Object.keys(data || {}).map(key => ({ id: key, ...data[key] }) as PrestamoModel))
    );
  }

  guardarHistorial() {
    if (this.historialForm.invalid) {
      this.historialForm.markAllAsTouched();
      return;
    }

    const formData = this.historialForm.getRawValue();
    
    // Armar el objeto a enviar, calculando la fecha de devolución
    const registroHistorial: HistorialModel = {
      idPrestamo: formData.idPrestamo,
      cantidadDevuelta: formData.cantidadDevuelta,
      observaciones: formData.observaciones,
      fechaDevolucion: this.isEditing ? formData.idHistorial /* or keep original */ : new Date().toISOString().split('T')[0]
    };

    try {
      if (this.isEditing && this.idHistorialActual) {
        this.historialService.actualizarHistorial(this.idHistorialActual, registroHistorial).subscribe(() => {
          console.log('¡Historial actualizado exitosamente!');
          this.cancelarEdicion();
          this.cargarDatos();
        });
      } else {
        this.historialService.agregarHistorial(registroHistorial).subscribe(() => {
          console.log('¡Historial registrado exitosamente!');
          this.cancelarEdicion();
          this.cargarDatos();
        });
      }
    } catch (error) {
      console.error('Error al guardar en el historial:', error);
    }
  }

  editarHistorial(historial: HistorialModel) {
    this.isEditing = true;
    this.idHistorialActual = historial.id!;
    
    this.historialForm.patchValue({
      idHistorial: historial.id,
      idPrestamo: historial.idPrestamo,
      cantidadDevuelta: historial.cantidadDevuelta,
      observaciones: historial.observaciones || ''
    });
    
    setTimeout(() => {
      const tabRegistrar = document.getElementById('registrar-tab');
      if (tabRegistrar) {
        tabRegistrar.click();
      }
    }, 100);
  }

  eliminarHistorial(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro del historial?')) {
      try {
        this.historialService.eliminarHistorial(id).subscribe(() => {
          console.log('¡Registro eliminado!');
          this.cargarDatos();
        });
      } catch (error) {
        console.error('Error al intentar eliminar el registro:', error);
      }
    }
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.idHistorialActual = null;
    this.historialForm.reset({
      idHistorial: '',
      cantidadDevuelta: 1,
      observaciones: ''
    });
    
    setTimeout(() => {
      const tabListado = document.getElementById('listado-tab');
      if (tabListado) {
        tabListado.click();
      }
    }, 100);
  }
}

