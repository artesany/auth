import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthBackendService } from '../../../core-prueba/services-prueba/auth-backend.service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="login()">Pagar</button>
    <p *ngIf="token">Token: {{ token }}</p>
  `
})
export class PagoComponent {
  token: string | null = null;

  constructor(private auth: AuthBackendService) {}

  async login() {
    const uuid = 'uuid-prueba-123'; // reemplaza con generación dinámica si quieres
    this.token = await this.auth.loginAnonymous(uuid);
    console.log('Token recibido:', this.token);
  }
}
