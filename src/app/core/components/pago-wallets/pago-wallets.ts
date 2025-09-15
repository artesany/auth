import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthWalletService } from '../../services/auth-wallet.service';
import { SolanaWalletService } from '../../../core-sol/services/solana-wallet.service';
import { FirestoreService } from '../../../core-prueba/services-prueba/firestore.service';
import { CHAINS, getChainById } from '../../helpers/chains.helper';
import { Transaction } from '../../../types/types';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-pago-wallets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-wallets.html'
})
export class PagoWallets implements OnInit {
  token: string | null = null;
  account: string | null = null;
  chainId: number | null = null;
  chainSymbol: string = 'ETH';
  balance: string = '0';
  amount: string = '0';
  to: string = '';
  solanaAccount: string | null = null;
  solanaBalance: string = '0';
  solanaConnected: boolean = false;
  solanaWalletName: string = '';
  solanaProviderStatus: string = '';
  availableChains = CHAINS;
  isAuthenticated: boolean = false;
  firebaseUser: any = null;
  providerStatus: string = '';
  currentBlockchain = signal<'ethereum' | 'solana'>('ethereum');
  solanaWallets: any[] = [];
  showSolanaSelector: boolean = false;
  ethTransactions = signal<Transaction[]>([]);
  solanaTransactions = signal<Transaction[]>([]);

  constructor(
    public authWallet: AuthWalletService,
    public solanaWallet: SolanaWalletService,
    private firestoreService: FirestoreService
  ) {
    effect(() => {
      this.solanaAccount = this.solanaWallet.account();
      this.solanaBalance = this.solanaWallet.balance();
      this.solanaConnected = this.solanaWallet.isConnected();
      this.solanaWalletName = this.solanaWallet.walletName();
      this.solanaProviderStatus = this.solanaWallet.providerStatus();
      this.solanaWallets = this.solanaWallet.availableWallets();
      this.showSolanaSelector = this.solanaWallet.showWalletSelector();
    });

    effect(() => {
      this.account = this.authWallet.account();
      this.chainId = this.authWallet.chainId();
      this.chainSymbol = this.authWallet.chainSymbol();
      this.balance = this.authWallet.balance();
      this.isAuthenticated = this.authWallet.isAuthenticated();
      this.firebaseUser = this.authWallet.firebaseUser();
      this.providerStatus = this.authWallet.providerStatus();
    });
  }

  ngOnInit() {
    this.authWallet.initProvider();
    this.solanaWallet.initProvider();
    this.loadTransactions();
  }

  async loadTransactions() {
    try {
      if (!this.isAuthenticated) {
        const uuid = localStorage.getItem('anonymous_uuid') || this.generateUUID();
        await this.authWallet.loginAnonymous(uuid);
      }
      const ethTxs = await this.firestoreService.getTransactions('ethereum');
      const solTxs = await this.firestoreService.getTransactions('solana');
      this.ethTransactions.set(ethTxs.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp.toDate().getTime();
        const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp.toDate().getTime();
        return timeB - timeA;
      }));
      this.solanaTransactions.set(solTxs.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp.toDate().getTime();
        const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp.toDate().getTime();
        return timeB - timeA;
      }));
    } catch (error) {
      console.error('Error cargando transacciones:', error);
      alert('Error al cargar transacciones: ' + (error as Error).message);
    }
  }

  getExplorerUrl(tx: Transaction): string {
    if (tx.currency === 'SOL') {
      return `https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`;
    }
    const chain = CHAINS.find(c => c.symbol === tx.currency);
    return chain ? `${chain.explorerUrl}/tx/${tx.txHash}` : '#';
  }

  formatTimestamp(timestamp: Date | Timestamp): Date {
    return timestamp instanceof Date ? timestamp : timestamp.toDate();
  }

  selectBlockchain(blockchain: 'ethereum' | 'solana') {
    this.currentBlockchain.set(blockchain);
    if (blockchain === 'solana' && !this.isAuthenticated) {
      const uuid = localStorage.getItem('anonymous_uuid') || this.generateUUID();
      this.authWallet.loginAnonymous(uuid).catch(error => {
        console.error('Error en autenticación anónima para Solana:', error);
        alert('Error al autenticar para Solana: ' + (error as Error).message);
      });
    }
    if (blockchain === 'solana') {
      this.connectSolanaWallet();
    }
    this.loadTransactions();
  }

  async loginAnonymous() {
    try {
      const uuid = localStorage.getItem('anonymous_uuid') || this.generateUUID();
      await this.authWallet.loginAnonymous(uuid);
    } catch (error) {
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

  async connectWallet() {
    if (this.currentBlockchain() === 'ethereum') {
      await this.authWallet.connectWallet();
    }
  }

  async connectSolanaWallet() {
    const availableWallets = this.solanaWallet.availableWallets();
    if (availableWallets.length === 0) {
      alert('No se detectaron wallets Solana. Instala Phantom o Solflare.');
      return;
    }
    if (availableWallets.length === 1) {
      await this.solanaWallet.selectWallet(availableWallets[0].name);
    } else {
      this.solanaWallet.showSelector();
    }
  }

  async selectSolanaWallet(walletName: string) {
    await this.solanaWallet.selectWallet(walletName);
  }

  cancelWalletSelection() {
    this.solanaWallet.hideSelector();
  }

  async switchChain(chainId: number) {
    if (this.currentBlockchain() === 'ethereum') {
      const success = await this.authWallet.switchChain(chainId);
      if (!success) {
        alert(`No se pudo cambiar a la red ${chainId}`);
      }
    }
  }

  async sendTransaction(to: string, amount: string) {
    try {
      if (this.currentBlockchain() === 'ethereum') {
        if (!this.isAuthenticated) {
          alert('Debes estar autenticado para enviar transacciones Ethereum');
          return;
        }
        await this.authWallet.sendTransaction(to, amount);
      } else {
        if (!this.solanaConnected) {
          alert('Debes conectar tu wallet Solana primero');
          return;
        }
        await this.solanaWallet.sendTransaction(to, amount);
      }
      this.to = '';
      this.amount = '0';
      alert('Transacción enviada exitosamente');
      await this.loadTransactions();
    } catch (error) {
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