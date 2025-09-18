import { Component, signal } from '@angular/core';
import{ Navbar } from '../app/core/components/navbar/navbar'


@Component({
  selector: 'app-root',
  imports: [Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('auth');
}
