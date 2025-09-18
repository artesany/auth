import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  constructor(private router: Router) {}

  goToPay() {
    // Navegación segura a Wallets
    this.router.navigate(['/pago-wallets']).catch(err => {
      console.error('Error al navegar a Wallets:', err);
    });
  }
}