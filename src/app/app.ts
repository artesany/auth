import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PagoWallets } from './core/components/pago-wallets/pago-wallets';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PagoWallets],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('auth');
}
