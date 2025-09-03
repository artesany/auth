// pago.component.ts
import { Component } from '@angular/core';
import { AuthBackendService } from '../../../core-prueba/services-prueba/auth-backend.service';

@Component({
  selector: 'app-pago-component',
  standalone: true,
  template: `
    <button (click)="pagar()">Pagar</button>
  `
})
export class PagoComponent {
  constructor(private authService: AuthBackendService) {}

  async pagar() {
    try {
      // 1️⃣ Autenticación anónima
      const token = await this.authService.loginAnon();
      console.log('Token recibido:', token);

      // 2️⃣ Guardar UUID / acción en Firestore
      const res = await this.authService.saveData({ producto: 'Curso Angular' });
      console.log('Registro guardado:', res);
    } catch (err) {
      console.error('Error al pagar:', err);
    }
  }
}

