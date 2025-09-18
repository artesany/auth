import { Component, inject, ViewChild, HostListener,ElementRef, OnInit} from '@angular/core';
import{Switch} from '../switch/switch'
import { NgIf,} from '@angular/common';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map, shareReplay } from 'rxjs';
import { RouterOutlet, RouterModule} from '@angular/router'
import{PagoWallets} from '../pago-wallets/pago-wallets'
// import{ Footer }from '../pages/footer/footer'


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  standalone:true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NgIf,
    Switch,
    RouterOutlet,
    PagoWallets
    
   
  
],
  
})
export class Navbar implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  @ViewChild('sidenavContainer', { static: true }) sidenavContainer!: ElementRef;

  private breakpointObserver = inject(BreakpointObserver);

  // Flag que indica si estamos en móvil
  isMobile = false;

  isHandset$ = this.breakpointObserver.observe([Breakpoints.XSmall])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit() {
    // Actualizamos el flag cuando cambia el tamaño
    this.isHandset$.subscribe(val => this.isMobile = val);
  }

  toggleDrawer() {
    if (this.isMobile && this.drawer) {
      this.drawer.toggle();
    }
  }

  closeDrawerIfMobile() {
    if (this.isMobile && this.drawer) {
      this.drawer.close();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closeDrawerIfMobile();
  }

  @HostListener('document:click', ['$event'])
 handleClickOutside(event: MouseEvent) {
  if (!this.isMobile || !this.drawer?.opened || !this.sidenavContainer?.nativeElement) return;

  const clickedInside = this.sidenavContainer.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.drawer.close();
  }
}

}