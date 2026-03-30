import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HerramientasService } from '../../herramientas.service';
import { HerramientaModel } from '../../core/models/herramienta.model';
import { Observable, map } from 'rxjs';
import { NavegationComponent } from '../navegation-component/navegation-component';

@Component({
  selector: 'app-herramienta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavegationComponent],
  templateUrl: './herramienta.html',
  styleUrl: './herramienta.css',
})
export class Herramienta implements OnInit {
  // Inyecciones de dependencias
  private fb = inject(FormBuilder);
  private herramientaService = inject(HerramientasService);

  // Observable que contiene la lista de herramientas obtenidas de Firebase
  herramientas$!: Observable<HerramientaModel[]>;

  // Variables para controlar el estado de la vista (si estamos creando o editando)
  isEditing = false;
  idHerramientaActual: string | null = null;

  // Modelo del formulario reactivo con validaciones requeridas
  herramientaForm = this.fb.nonNullable.group({
    noSerie: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    cantidad: [0, [Validators.required, Validators.min(0)]]
  });

  // Ciclo de vida de inicialización: cargamos las herramientas al inicio
  ngOnInit() {
    this.cargarHerramientas();
  }

  /**
   * Carga las herramientas desde el servicio y las mapea a un arreglo de HerramientaModel
   */
  cargarHerramientas() {
    this.herramientas$ = this.herramientaService.obtenerHerramientas().pipe(
      map(data => Object.keys(data || {}).map(key => ({
        id: key,
        ...data[key]
      }) as HerramientaModel))
    );
  }

  /**
   * Guarda o actualiza una herramienta dependiendo de la variable isEditing
   */
  guardarHerramienta() {
    // Verificar si el formulario cumple con todas las validaciones antes de procesarlo
    if (this.herramientaForm.invalid) {
      this.herramientaForm.markAllAsTouched();
      return;
    }

    // Extraemos los valores capturados en el formulario
    const nuevaHerramienta: HerramientaModel = this.herramientaForm.getRawValue();

    try {
      if (this.isEditing && this.idHerramientaActual) {
        // Lógica para actualizar una herramienta existente en Firebase
        this.herramientaService.actualizarHerramienta(this.idHerramientaActual, nuevaHerramienta).subscribe(() => {
          console.log('¡Herramienta actualizada exitosamente!');
          this.cancelarEdicion();
          this.cargarHerramientas();
        });
      } else {
        // Lógica para crear una nueva herramienta en Firebase
        this.herramientaService.agregarHerramienta(nuevaHerramienta).subscribe(() => {
          console.log('¡Herramienta registrada exitosamente!');
          this.cancelarEdicion();
          this.cargarHerramientas();
        });
      }
    } catch (error) {
      console.error('Error al guardar la herramienta:', error);
    }
  }

  /**
   * Prepara el formulario para editar una herramienta existente
   * @param herramienta Objeto con los datos seleccionados
   */
  editarHerramienta(herramienta: any) {
    this.isEditing = true;
    this.idHerramientaActual = herramienta.id;
    
    // Rellenar el formulario con los datos cargados de la tabla
    this.herramientaForm.patchValue({
      noSerie: herramienta.noSerie,
      nombre: herramienta.nombre,
      descripcion: herramienta.descripcion,
      cantidad: herramienta.cantidad
    });
    
    // Simular un click para ir automáticamente a la pestaña de "Registrar/Editar"
    setTimeout(() => {
      const tabRegistrar = document.getElementById('registrar-tab');
      if (tabRegistrar) {
        tabRegistrar.click();
      }
    }, 100);
  }

  /**
   * Elimina una herramienta después de la confirmación del usuario
   * @param id El identificador único del elemento a borrar
   */
  eliminarHerramienta(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta herramienta?')) {
      try {
        this.herramientaService.eliminarHerramienta(id).subscribe(() => {
          console.log('¡Herramienta eliminada exitosamente!');
          this.cargarHerramientas();
        });
      } catch (error) {
        console.error('Error al intentar eliminar la herramienta:', error);
      }
    }
  }

  /**
   * Limpia el formulario y reinicia los estados de edición
   */
  cancelarEdicion() {
    this.isEditing = false;
    this.idHerramientaActual = null;
    this.herramientaForm.reset();
    
    // Simular click para navegar de regreso a la tabla listado
    setTimeout(() => {
      const tabListado = document.getElementById('listado-tab');
      if (tabListado) {
        tabListado.click();
      }
    }, 100);
  }
}

