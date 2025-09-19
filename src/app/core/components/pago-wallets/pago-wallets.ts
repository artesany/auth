import { Component, OnInit, effect, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthWalletService } from '../../services/auth-wallet.service';
import { SolanaWalletService } from '../../../core-sol/services/solana-wallet.service';
import { FirestoreService } from '../../../core-prueba/services-prueba/firestore.service';
import { CHAINS, getChainById } from '../../helpers/chains.helper';
import { Transaction } from '../../../types/types';
import { Timestamp, getFirestore, doc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { Token } from '../../models/token.model';
import { TokenPriceService } from '../../../services/token-price.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-pago-wallets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatListModule
  ],
  templateUrl: './pago-wallets.html',
  styleUrls: ['./pago-wallets.scss']
})
export class PagoWallets implements OnInit, OnDestroy {
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
  isAdmin = signal<boolean>(false);
  adminTo = signal<string | null>(null);
  isHardcoded = signal<boolean>(false);

  // Propiedades para tokens
  currentToken = signal<Token | null>(null);
  availableTokens = signal<Token[]>([]);
  tokenBalances = signal<Map<string, string>>(new Map());
  chainName = signal<string>('Seleccione una red');

  // Columnas para la tabla de Material
  displayedColumns: string[] = ['txHash', 'from', 'to', 'amount', 'currency', 'date', 'status'];

  // Propiedades para MyToken
  myTokenAmount: number = 0;
  private MY_TOKEN_SYMBOL = 'MYT'; // Símbolo para MyToken

  private walletListener: Unsubscribe | null = null;
  private adminWalletCache = new Map<string, { address: string | null, enabled: boolean }>();
  private pricesSubscription: Subscription | null = null;

  constructor(
    public authWallet: AuthWalletService,
    public solanaWallet: SolanaWalletService,
    private firestoreService: FirestoreService,
    private tokenPriceService: TokenPriceService
  ) {
    effect(() => {
      this.solanaAccount = this.solanaWallet.account();
      this.solanaBalance = this.solanaWallet.balance();
      this.solanaConnected = this.solanaWallet.isConnected();
      this.solanaWalletName = this.solanaWallet.walletName();
      this.solanaProviderStatus = this.solanaWallet.providerStatus();
      this.solanaWallets = this.solanaWallet.availableWallets();
      this.showSolanaSelector = this.solanaWallet.showWalletSelector();

      if (this.currentBlockchain() === 'solana') {
        this.availableTokens.set(this.solanaWallet.availableTokens());
        this.currentToken.set(this.solanaWallet.currentToken());
        this.tokenBalances.set(this.solanaWallet.tokenBalances());
        this.myTokenAmount = 0; // Resetear MyToken en Solana
      }
    });

    effect(() => {
      this.account = this.authWallet.account();
      this.chainId = this.authWallet.chainId();
      this.chainSymbol = this.authWallet.chainSymbol();
      this.balance = this.authWallet.balance();
      this.isAuthenticated = this.authWallet.isAuthenticated();
      this.firebaseUser = this.authWallet.firebaseUser();
      this.providerStatus = this.authWallet.providerStatus();
      this.isAdmin.set(this.authWallet.isAdmin());

      if (this.authWallet.chainId() !== null) {
        const chainInfo = getChainById(this.authWallet.chainId()!);
        this.chainName.set(chainInfo?.name || 'Unknown Network');
      } else {
        this.chainName.set('Not Connected');
      }

      if (this.currentBlockchain() === 'ethereum') {
        this.availableTokens.set(this.authWallet.availableTokens());
        this.currentToken.set(this.authWallet.currentToken());
        this.tokenBalances.set(this.authWallet.tokenBalances());
        this.calculateMyToken(); // Recalcular MyToken en Ethereum
      }

      this.loadWalletAddress(this.currentBlockchain());
    });
  }

  async ngOnInit() {
    this.authWallet.initProvider();
    this.solanaWallet.initProvider();
    this.loadTransactions();
    await this.loadWalletAddress(this.currentBlockchain());
    this.solanaWallet.pauseRefreshes();

    // Suscribirse a cambios de precios para actualizar MyToken
    this.pricesSubscription = this.tokenPriceService.currentPrices$.subscribe(() => {
      if (this.currentBlockchain() === 'ethereum') {
        this.calculateMyToken();
      }
    });

    // Inicializar cálculo de MyToken
    if (this.currentBlockchain() === 'ethereum') {
      this.calculateMyToken();
    }
  }

  ngOnDestroy() {
    this.disconnectWalletListener();
    if (this.pricesSubscription) {
      this.pricesSubscription.unsubscribe();
      this.pricesSubscription = null;
    }
  }

  private disconnectWalletListener() {
    if (this.walletListener) {
      this.walletListener();
      this.walletListener = null;
    }
  }

  // Calcular MyToken desde el monto del token
  calculateMyToken() {
    const amountValue = parseFloat(this.amount) || 0;
    const tokenPrice = this.currentToken()?.price || 0;
    const myTokenPrice = this.tokenPriceService.getTokenPrice(this.MY_TOKEN_SYMBOL) || 0.001;
    if (tokenPrice > 0 && myTokenPrice > 0) {
      const amountInUSD = amountValue * tokenPrice;
      this.myTokenAmount = amountInUSD / myTokenPrice;
    } else {
      this.myTokenAmount = 0;
    }
  }

  // Calcular monto del token desde MyToken (para pruebas)
  calculateTokenFromMyToken(myTokenValue: number) {
    const tokenPrice = this.currentToken()?.price || 0;
    const myTokenPrice = this.tokenPriceService.getTokenPrice(this.MY_TOKEN_SYMBOL) || 0.001;
    if (tokenPrice > 0 && myTokenPrice > 0) {
      const amountInUSD = myTokenValue * myTokenPrice;
      this.amount = (amountInUSD / tokenPrice).toFixed(8);
    } else {
      this.amount = '0';
    }
  }

  // Simular edición de MyToken (para pruebas)
  simulateMyTokenEdit(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value.replace(/,/g, '')) || 0;
    this.calculateTokenFromMyToken(value);
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

  async selectBlockchain(blockchain: 'ethereum' | 'solana') {
    this.currentBlockchain.set(blockchain);
    await this.loadWalletAddress(blockchain);
    if (blockchain === 'solana') {
      this.connectSolanaWallet();
      this.authWallet.pauseRefreshes();
      this.solanaWallet.resumeRefreshes();
      this.availableTokens.set(this.solanaWallet.availableTokens());
      this.currentToken.set(this.solanaWallet.currentToken());
      this.tokenBalances.set(this.solanaWallet.tokenBalances());
      this.myTokenAmount = 0; // Resetear MyToken en Solana
    } else {
      this.solanaWallet.pauseRefreshes();
      this.authWallet.resumeRefreshes();
      this.availableTokens.set(this.authWallet.availableTokens());
      this.currentToken.set(this.authWallet.currentToken());
      this.calculateMyToken(); // Recalcular MyToken en Ethereum
    }
    this.loadTransactions();
  }

  async loadWalletAddress(blockchain: 'ethereum' | 'solana') {
    try {
      const cacheKey = `${blockchain}_wallet`;
      const cached = this.adminWalletCache.get(cacheKey);

      if (cached) {
        this.adminTo.set(cached.address);
        this.isHardcoded.set(cached.enabled);
        return;
      }

      const db = getFirestore();

      this.disconnectWalletListener();

      this.walletListener = onSnapshot(doc(db, 'wallets', blockchain), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const address = data['address'] || null;
          const enabled = data['enabled'] || false;

          this.adminTo.set(address);
          this.isHardcoded.set(enabled);

          this.adminWalletCache.set(cacheKey, { address, enabled });

          console.log(`Dirección administrativa ${blockchain} cargada:`, address, enabled);
        } else {
          this.adminTo.set(null);
          this.isHardcoded.set(false);
          this.adminWalletCache.set(cacheKey, { address: null, enabled: false });
        }
      }, (error) => {
        console.error('Error listening to wallet:', error);
        this.adminTo.set(null);
        this.isHardcoded.set(false);
      });
    } catch (error) {
      console.error('Error loading wallet:', error);
      this.adminTo.set(null);
      this.isHardcoded.set(false);
    }
  }

  async resetAdminTo() {
    if (this.isAdmin()) {
      try {
        const db = getFirestore();
        await setDoc(doc(db, 'wallets', this.currentBlockchain()), 
          { 
            address: null, 
            enabled: false,
            updatedBy: this.firebaseUser?.uid,
            updatedAt: new Date()
          }, 
          { merge: true }
        );

        const cacheKey = `${this.currentBlockchain()}_wallet`;
        this.adminWalletCache.set(cacheKey, { address: null, enabled: false });

        this.isHardcoded.set(false);
        this.adminTo.set(null);
        alert('Dirección administrativa reseteada');
      } catch (error) {
        console.error('Error resetting wallet:', error);
        alert('Error al resetear dirección administrativa');
      }
    }
  }

  async loginAnonymous() {
    try {
      const uuid = localStorage.getItem('anonymous_uuid') || this.generateUUID();
      await this.authWallet.loginAnonymous(uuid);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión: ' + (error as Error).message);
    }
  }

  async logout() {
    try {
      const currentAdminTo = this.adminTo();
      const currentIsHardcoded = this.isHardcoded();

      await this.authWallet.logout();

      this.adminTo.set(currentAdminTo);
      this.isHardcoded.set(currentIsHardcoded);
      this.myTokenAmount = 0; // Resetear MyToken al cerrar sesión
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  async connectWallet() {
    if (this.currentBlockchain() === 'ethereum') {
      await this.authWallet.connectWallet();
      this.calculateMyToken(); // Recalcular al conectar
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

  async switchChain(chainId: string) {
    const selectedChainId = Number(chainId);

    if (selectedChainId === 0) {
      return;
    }

    if (this.currentBlockchain() === 'ethereum') {
      const success = await this.authWallet.switchChain(selectedChainId);
      if (success) {
        this.calculateMyToken(); // Recalcular al cambiar red
      } else {
        alert(`No se pudo cambiar a la red ${chainId}`);
      }
    }
  }

  onTokenChange(token: Token) {
    this.currentToken.set(token);

    if (this.currentBlockchain() === 'ethereum') {
      this.authWallet.currentToken.set(token);
      this.calculateMyToken(); // Recalcular al cambiar token
    } else {
      this.solanaWallet.currentToken.set(token);
    }
  }

  getCurrentTokenBalance(): string {
    const currentToken = this.currentToken();
    if (!currentToken) return '0';
    return this.tokenBalances().get(currentToken.address) || '0';
  }

  getCurrentTokenBalanceNumber(): number {
    const val = this.getCurrentTokenBalance();
    const n = parseFloat(val ?? '0');
    return isNaN(n) ? 0 : n;
  }

  async refreshTokenPrices() {
    try {
      await this.tokenPriceService.refreshPrices().toPromise();
      console.log('Precios actualizados');
      if (this.currentBlockchain() === 'ethereum') {
        this.calculateMyToken(); // Recalcular al actualizar precios
      }
    } catch (error) {
      console.error('Error actualizando precios:', error);
      alert('Error al actualizar precios: ' + (error as Error).message);
    }
  }

  async sendTransaction(to: string, amount: string) {
    try {
      const amountString = typeof amount === 'string' ? amount : String(amount);

      if (!/^\d+(\.\d+)?$/.test(amountString)) {
        throw new Error('Formato de monto inválido. Use números con punto decimal (ej: 0.0008)');
      }

      const destination = this.isHardcoded() && this.adminTo() ? this.adminTo()! : to;
      const currentToken = this.currentToken();

      if (!currentToken) {
        throw new Error('No hay token seleccionado');
      }

      if (this.currentBlockchain() === 'ethereum') {
        if (!this.isAuthenticated) {
          alert('Debes estar autenticado para enviar transacciones Ethereum');
          return;
        }
        await this.authWallet.transferToken(destination, amountString, currentToken);
      } else {
        if (!this.solanaConnected) {
          alert('Debes conectar tu wallet Solana primero');
          return;
        }
        await this.solanaWallet.sendTokenTransaction(destination, amountString, currentToken);
      }
      this.to = '';
      this.amount = '0';
      this.myTokenAmount = 0; // Resetear MyToken después de enviar
      alert('Transacción enviada exitosamente');
      await this.loadTransactions();
    } catch (error) {
      console.error('Error al enviar transacción:', error);
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

  validateNumericInput(event: KeyboardEvent) {
    const key = event.key;
    if (!key) return;

    if (key.length > 1) return;

    if (key === '.') {
      const input = event.target as HTMLInputElement | null;
      const current = input ? input.value : '';
      if (current.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    const allowed = /[0-9]/;
    if (!allowed.test(key)) {
      event.preventDefault();
    }
  }

  getNetworkClassFromName(name: string | null): string {
    if (!name) return 'network-default';
    return 'network-' + name.toLowerCase().replace(/\s+/g, '-');
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}