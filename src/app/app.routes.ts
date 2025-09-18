import { Routes } from '@angular/router';
import { Home } from './core/components/home/home';
import { PagoWallets } from '../app/core/components/pago-wallets/pago-wallets';

export const routes: Routes = [
    { path: '', component: Home },
    
    {path: 'pago-wallets', component: PagoWallets},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
];
