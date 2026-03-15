import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NavegationComponent } from '../components/navegation-component/navegation-component';

@Component({
  selector: 'app-empleado-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavegationComponent, RouterOutlet],
  templateUrl: './empleado-dashboard.component.html',
  styleUrl: './empleado-dashboard.component.css'
})
export class EmpleadoDashboardComponent {
  constructor(private readonly authService: AuthService, public router: Router) { }

  onLogout(): void {
    this.authService.logout();
  }
}

