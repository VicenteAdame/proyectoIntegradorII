import { Component, Input } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navegation-component',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navegation-component.html',
  styleUrl: './navegation-component.css',
})
export class NavegationComponent {
  @Input() rol: 'admin' | 'empleado' = 'admin';
  usuario$;

  constructor(private readonly authService: AuthService) {
    this.usuario$ = this.authService.usuarioActual;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
