import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { effect } from '@angular/core';
import { AuthWalletService } from '../../services/auth-wallet.service';

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
  amount: string = '0';
  to: string = '';

  constructor(private authWallet: AuthWalletService) {
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

    effect(() => {
      this.amount = this.authWallet.amount();
    });
  }

  loginAnonymous() {
    this.authWallet.loginAnonymous('uuid-prueba-123');
  }

  connectWallet() {
    this.authWallet.connectWallet();
  }

  async sendTransaction(to: string, amount: string) {
    try {
      await this.authWallet.sendTransaction(to, amount);
      console.log('Transacción enviada y guardada exitosamente');
      // Limpiar campos después de enviar
      this.to = '';
      this.amount = '0';
    } catch (error) {
      console.error('Error en transacción:', error);
      alert('Error al enviar transacción: ' + (error as Error).message);
    }
  }
}