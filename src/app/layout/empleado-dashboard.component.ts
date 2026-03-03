import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-empleado-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empleado-dashboard.component.html',
  styleUrl: './empleado-dashboard.component.css'
})
export class EmpleadoDashboardComponent {
  constructor(private readonly authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}

