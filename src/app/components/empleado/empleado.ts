import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpleadoBaseService } from '../../core/services/empleado-base-service';
import { Empleado1 } from '../../core/models/empleadoModelCrud';
import { EmpleadoModel } from '../../core/models/empleado.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empleado.html',
  styleUrl: './empleado.css',
})
export class Empleado implements OnInit {
  // Inyecciones
  private fb = inject(FormBuilder);
  private empleadoService = inject(EmpleadoBaseService);

  // Observable para la tabla
  empleados$!: Observable<EmpleadoModel[]>;

  // Variables para controlar la edición
  isEditing = false;
  idEmpleadoActual: string | null = null;

  // Modelo del formulario
  empleadoForm = this.fb.nonNullable.group({
    nomina: ['', Validators.required],
    nombre: ['', Validators.required],
    apellidoPaterno: ['', Validators.required],
    apellidoMaterno: ['', Validators.required],
    rol: ['Empleado', Validators.required],
    estado: [true],
    contrasena: ['', Validators.required]
  });

  ngOnInit() {
    this.empleados$ = this.empleadoService.getEmpleados();
  }

  async guardarEmpleado() {
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      return;
    }

    const unEmpleado: EmpleadoModel = new Empleado1(this.empleadoForm.getRawValue());

    try {
      if (this.isEditing && this.idEmpleadoActual) {
        await this.empleadoService.actualizar(this.idEmpleadoActual, unEmpleado);
        console.log('¡Empleado actualizado exitosamente!');
      } else {
        await this.empleadoService.crear(unEmpleado);
        console.log('¡Empleado creado exitosamente!');
      }
      this.cancelarEdicion();
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
    }
  }

  editarEmpleado(empleado: any) {
    this.isEditing = true;
    this.idEmpleadoActual = empleado.id;
    this.empleadoForm.patchValue({
      nomina: empleado.nomina,
      nombre: empleado.nombre,
      apellidoPaterno: empleado.apellidoPaterno,
      apellidoMaterno: empleado.apellidoMaterno,
      rol: empleado.rol,
      estado: empleado.estado,
      contrasena: empleado.contrasena
    });
    // Simula clic para ir a pestaña de edición
    const tabRegistrar = document.getElementById('registrar-tab');
    if (tabRegistrar) {
      tabRegistrar.click();
    }
  }

  async eliminarEmpleado(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await this.empleadoService.eliminar(id);
        console.log('¡Empleado eliminado!');
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  async toggleEstado(empleado: any) {
    try {
      const nuevoEstado = !empleado.estado;
      await this.empleadoService.actualizar(empleado.id, { estado: nuevoEstado });
      console.log(`Estado cambiado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
    } catch (error) {
      console.error('Error al cambiar de estado:', error);
    }
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.idEmpleadoActual = null;
    this.empleadoForm.reset({
      rol: 'Empleado',
      estado: true
    });
    // Simula clic para ir a pestaña listado
    const tabListado = document.getElementById('listado-tab');
    if (tabListado) {
      tabListado.click();
    }
  }
}