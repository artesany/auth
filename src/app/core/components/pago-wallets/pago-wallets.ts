import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthWalletService } from '../../services/auth-wallet.service';
import { SolanaWalletService } from '../../../core-sol/services/solana-wallet.service'; // Nuevo servicio
import { CHAINS } from '../../helpers/chains.helper';

@Component({
  selector: 'app-pago-wallets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-wallets.html'
})
export class PagoWallets implements OnInit {
  // Signals para Ethereum
  token: string | null = null;
  account: string | null = null;
  chainId: number | null = null;
  chainSymbol: string = 'ETH';
  balance: string = '0';
  amount: string = '0';
  to: string = '';
  
  // Signals para Solana
  solanaAccount: string | null = null;
  solanaBalance: string = '0';
  solanaConnected: boolean = false;
  solanaWalletName: string = '';
  
  // Signals compartidos
  availableChains = CHAINS;
  isAuthenticated: boolean = false;
  firebaseUser: any = null;
  providerStatus: string = '';
  
  // Nueva signal para blockchain seleccionado
  currentBlockchain = signal<'ethereum' | 'solana'>('ethereum');

  constructor(
    public authWallet: AuthWalletService,
    public solanaWallet: SolanaWalletService // Nuevo servicio
  ) {
    // Efectos para Ethereum
    effect(() => {
      this.account = this.authWallet.account();
      console.log('Ethereum account updated:', this.account);
    });

    effect(() => {
      this.chainId = this.authWallet.chainId();
      console.log('ChainId updated:', this.chainId);
    });

    effect(() => {
      this.chainSymbol = this.authWallet.chainSymbol();
      console.log('ChainSymbol updated:', this.chainSymbol);
    });

    effect(() => {
      this.balance = this.authWallet.balance();
      console.log('Ethereum balance updated:', this.balance);
    });

    effect(() => {
      this.isAuthenticated = this.authWallet.isAuthenticated();
      console.log('Auth updated:', this.isAuthenticated);
    });

    effect(() => {
      this.firebaseUser = this.authWallet.firebaseUser();
      console.log('FirebaseUser updated:', this.firebaseUser);
    });

    effect(() => {
      this.providerStatus = this.authWallet.providerStatus();
      console.log('ProviderStatus updated:', this.providerStatus);
    });

    // Efectos para Solana
    effect(() => {
      this.solanaAccount = this.solanaWallet.account();
      console.log('Solana account updated:', this.solanaAccount);
    });

    effect(() => {
      this.solanaBalance = this.solanaWallet.balance();
      console.log('Solana balance updated:', this.solanaBalance);
    });

    effect(() => {
      this.solanaConnected = this.solanaWallet.isConnected();
      console.log('Solana connected:', this.solanaConnected);
    });

    effect(() => {
      this.solanaWalletName = this.solanaWallet.walletName();
      console.log('Solana wallet:', this.solanaWalletName);
    });
  }

  ngOnInit() {
    // Inicializar providers
    this.authWallet.initProvider();
    this.solanaWallet.initProvider();
  }

  // Seleccionar blockchain
  selectBlockchain(blockchain: 'ethereum' | 'solana') {
    this.currentBlockchain.set(blockchain);
    console.log('Blockchain selected:', blockchain);
  }

  async loginAnonymous() {
    try {
      const uuid = localStorage.getItem('anonymous_uuid') || this.generateUUID();
      await this.authWallet.loginAnonymous(uuid);
    } catch (error) {
      console.error('Error en login anónimo:', error);
      alert('Error al iniciar sesión: ' + (error as Error).message);
    }
  }

  async logout() {
    try {
      await this.authWallet.logout();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  // Conectar wallet según blockchain seleccionado
  async connectWallet() {
    console.log('Connecting to:', this.currentBlockchain());
    
    if (this.currentBlockchain() === 'ethereum') {
      const account = await this.authWallet.connectWallet();
      if (account) {
        console.log('Ethereum wallet connected:', account);
      }
    } else {
      const account = await this.solanaWallet.connectWallet();
      if (account) {
        console.log('Solana wallet connected:', account);
      }
    }
  }

  async switchChain(chainId: number) {
    if (this.currentBlockchain() === 'ethereum') {
      const success = await this.authWallet.switchChain(chainId);
      if (!success) {
        alert(`No se pudo cambiar a la red ${chainId}`);
      }
    }
    // Solana no necesita cambio de chains
  }

  async sendTransaction(to: string, amount: string) {
    try {
      if (this.currentBlockchain() === 'ethereum') {
        if (!this.isAuthenticated) {
          alert('Debes estar autenticado para enviar transacciones Ethereum');
          return;
        }
        await this.authWallet.sendTransaction(to, amount);
        console.log('Transacción Ethereum enviada');
      } else {
        // Validación para Solana
        if (!this.solanaConnected) {
          alert('Debes conectar tu wallet Solana primero');
          return;
        }
        await this.solanaWallet.sendTransaction(to, amount);
        console.log('Transacción Solana enviada');
      }
      
      // Limpiar campos
      this.to = '';
      this.amount = '0';
      
    } catch (error) {
      console.error('Error en transacción:', error);
      alert('Error al enviar transacción: ' + (error as Error).message);
    }
  }

  debugService() {
    if (this.currentBlockchain() === 'ethereum') {
      this.authWallet.debugService();
    } else {
      this.solanaWallet.debugService();
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}