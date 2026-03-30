import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NavegationComponent } from '../components/navegation-component/navegation-component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavegationComponent, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  usuario$;

  constructor(private readonly authService: AuthService, public router: Router) {
    this.usuario$ = this.authService.usuarioActual;
  }

  onLogout(): void {
    this.authService.logout();
  }
}

   