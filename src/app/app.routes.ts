import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { AdminDashboardComponent } from './layout/admin-dashboard.component';
import { EmpleadoDashboardComponent } from './layout/empleado-dashboard.component';
import { Alumno } from './components/alumno/alumno';
import { Empleado } from './components/empleado/empleado';
import { Herramienta } from './components/herramienta/herramienta';
import { Historial } from './components/historial/historial';
import { Prestamo } from './components/prestamo/prestamo';
import { Tah } from './components/tah/tah';
import { ControlInventario } from './components/control-inventario/control-inventario';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminDashboardComponent
  },
  {
    path: 'empleado',
    component: EmpleadoDashboardComponent
  },
  {
    path: 'control-inventario',
    component: ControlInventario
  },
  {
    path: 'alumno-registro',
    component: Alumno
  },
  {
    path: 'empleado-registro',
    component: Empleado
  },
  {
    path: 'herramienta-registro',
    component: Herramienta
  },
  {
    path: 'historial',
    component: Historial
  },
  {
    path: 'prestamo',
    component: Prestamo
  },
  {
    path: 'tah',
    component: Tah
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

