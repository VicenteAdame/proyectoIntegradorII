import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navegation-component',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navegation-component.html',
  styleUrl: './navegation-component.css',
})
export class NavegationComponent {
  usuario$;

  constructor(private readonly authService: AuthService) {
    this.usuario$ = this.authService.usuarioActual;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
