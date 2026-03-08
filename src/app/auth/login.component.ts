import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nomina = '';
  contrasena = '';
  mostrandoErrores = false;
  mensajeError = '';
  enviando = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  async onSubmit(): Promise<void> {
    this.mostrandoErrores = false;
    this.mensajeError = '';

    const nomina = this.nomina.trim();
    const contrasena = this.contrasena.trim();

    if (!nomina || !contrasena) {
      this.mostrandoErrores = true;
      this.mensajeError = 'Todos los campos son obligatorios.';
      return;
    }

    this.enviando = true;

    try {
      const empleado = await this.authService.login({ nomina, contrasena });

      if (!empleado) {
        this.mostrandoErrores = true;
        this.mensajeError = 'ID o contraseña incorrecta.';
        return;
      }

      if (empleado.rol === 'Administrador') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/empleado']);
      }
    } catch (error) {
      this.mostrandoErrores = true;
      this.mensajeError = 'Ocurrió un error al intentar iniciar sesión.';
    } finally {
      this.enviando = false;
    }
  }
}

