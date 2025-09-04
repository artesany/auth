// src/app/pago-wallets.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthWalletService } from '../../services/auth-wallet.service';
import {effect} from '@angular/core'

@Component({
  selector: 'app-pago-wallets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-wallets.html'
})
export class PagoWallets {
  token: string | null = null;
  account: string | null = null;
  chainId: number | null = null;
  chainSymbol: string = 'ETH';
  balance: string = '0';
  to: string = '';
  amount: string = '';

  constructor(private authWallet: AuthWalletService)  {
  // Reaccionar a cambios en señales
  effect(() => {
    this.token = this.authWallet.token();
  });
  effect(() => {
    this.account = this.authWallet.account();
  });
  effect(() => {
    this.chainId = this.authWallet.chainId();
  });
  effect(() => {
    this.chainSymbol = this.authWallet.chainSymbol();
  });
  effect(() => {
    this.balance = this.authWallet.balance();
  });
}
  // Autenticación anónima
  loginAnonymous() {
    this.authWallet.loginAnonymous('uuid-prueba-123'); // reemplazar con generación dinámica si se desea
  }

  // Conectar wallet
  connectWallet() {
    this.authWallet.connectWallet();
  }

  // Enviar transacción
  async sendTransaction() {
    if (!this.to || !this.amount) return;

    try {
      const tx = await this.authWallet.sendTransaction(this.to, this.amount);
      console.log('Transacción enviada:', tx);
      alert(`Transacción enviada:\nHash: ${tx.hash}`);
      this.to = '';
      this.amount = '';
    } catch (err) {
      console.error('Error enviando transacción:', err);
      alert(`Error: ${err instanceof Error ? err.message : err}`);
    }
  }
}
