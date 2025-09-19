import { Component, signal } from '@angular/core';
import { Navbar } from '../app/core/components/navbar/navbar';
import { TokenPriceService } from './services/token-price.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('auth');

  constructor(public tokenPriceService: TokenPriceService) {
    // El servicio se auto-inicializa al ser inyectado
    // No se necesita código adicional aquí
  }
}