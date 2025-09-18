import { Component, OnInit, Inject } from '@angular/core';
import{CommonModule, DOCUMENT} from '@angular/common'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';



@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './switch.html',
  styleUrl: './switch.scss'
})
export class Switch implements OnInit{
  isDark = false;
  private storageKey = 'user-theme';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  onToggle(checked: boolean) {
    this.isDark = checked;
    localStorage.setItem(this.storageKey, this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    const body = this.document.body;
    if (this.isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-theme');
    }
  }

}
