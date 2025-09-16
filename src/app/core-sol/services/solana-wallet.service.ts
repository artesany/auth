import { Injectable, signal, effect, OnDestroy,inject } from '@angular/core';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
import { WalletAdapter } from '../../types/solana-wallets';
import { AuthWalletService } from '../../core/services/auth-wallet.service';
import { FirestoreService } from '../../core-prueba/services-prueba/firestore.service';
import { Transaction as TransactionType } from '../../types/types';
import { TokenService } from '../../core/tokens/services/token-service';
import { TokenRegistryService } from '../../core/tokens/services/token-registry';
import { Token } from '../../core/models/token.model';

// Definir tipos específicos para los eventos del wallet
type WalletEvent = 'connect' | 'disconnect' | 'accountChanged' | 'error';
type WalletEventListener = (...args: any[]) => void;

@Injectable({ providedIn: 'root' })
export class SolanaWalletService implements OnDestroy {
  public account = signal<string | null>(null);
  public balance = signal<string>('0');
  public isConnected = signal<boolean>(false);
  public walletName = signal<string>('');
  public providerStatus = signal<string>('No inicializado');
  public availableWallets = signal<any[]>([]);
  public showWalletSelector = signal<boolean>(false);

  // ✅ NUEVAS SIGNALS PARA TOKENS
  public currentToken = signal<Token | null>(null);
  public availableTokens = signal<Token[]>([]);
  public tokenBalances = signal<Map<string, string>>(new Map());

  private connection: Connection;
  private walletAdapter: WalletAdapter | null = null;
  private privateKey: PublicKey | null = null;
  private balanceRefreshInterval: any = null;
  private accountCheckInterval: any = null;
  private listeners: { [event in WalletEvent]?: WalletEventListener } = {};

  // ✅ NUEVAS DEPENDENCIAS
  private tokenService = inject(TokenService);
  private tokenRegistry = inject(TokenRegistryService);

  constructor(
    private authWalletService: AuthWalletService,
    private firestoreService: FirestoreService
  ) {
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    effect(() => {
      const currentAccount = this.account();
      console.log('🔵 [Solana] Account changed:', currentAccount);
      if (currentAccount) {
        this.startBalanceMonitoring();
        this.startAccountMonitoring();
        this.loadAvailableTokens(); // ✅ Cargar tokens cuando hay cuenta
        this.refreshTokenBalances(); // ✅ Actualizar balances de tokens
      } else {
        this.stopBalanceMonitoring();
        this.stopAccountMonitoring();
        this.tokenBalances.set(new Map()); // ✅ Limpiar balances
      }
    });

    this.initProvider();
  }

  ngOnDestroy() {
    this.stopBalanceMonitoring();
    this.stopAccountMonitoring();
    this.removeAllListeners();
  }

  // ✅ NUEVO MÉTODO: Cargar tokens disponibles
  private loadAvailableTokens() {
    const tokens = this.tokenRegistry.getTokens('devnet');
    this.availableTokens.set(tokens);
    
    // Seleccionar token nativo por defecto
    const nativeToken = tokens.find(t => t.isNative);
    if (nativeToken) {
      this.currentToken.set(nativeToken);
    }
  }

  // ✅ NUEVO MÉTODO: Actualizar balances de tokens
  async refreshTokenBalances() {
    if (!this.account() || !this.connection) return;

    try {
      const balances = await this.tokenService.getTokenBalancesSolana(
        this.connection,
        this.account()!,
        'devnet'
      );

      // Actualizar mapa de balances
      const newBalances = new Map<string, string>();
      balances.forEach(tokenBalance => {
        newBalances.set(tokenBalance.token.address, tokenBalance.formattedBalance);
      });
      
      this.tokenBalances.set(newBalances);
    } catch (error) {
      console.error('Error refreshing token balances:', error);
    }
  }

  // ✅ NUEVO MÉTODO: Obtener balance de un token específico
  getTokenBalance(tokenAddress: string): string {
    return this.tokenBalances().get(tokenAddress) || '0';
  }

  // ✅ NUEVO MÉTODO: Transferir tokens SPL
  async sendTokenTransaction(to: string, amount: string, token?: Token): Promise<string> {
    if (!this.walletAdapter) {
      alert('Selecciona una wallet primero');
      this.showSelector();
      throw new Error('Wallet no conectada');
    }

    if (!this.privateKey) {
      alert('Wallet no conectada');
      throw new Error('Wallet no conectada');
    }

    if (!to || !amount) {
      alert('Dirección y monto son requeridos');
      throw new Error('Dirección y monto son requeridos');
    }

    if (!this.authWalletService.isAuthenticated()) {
      alert('Debes autenticarte primero');
      throw new Error('Usuario no autenticado');
    }

    const targetToken = token || this.currentToken();
    if (!targetToken) throw new Error('No token seleccionado');

    try {
      this.providerStatus.set('Preparando transacción...');
      
      let toPublicKey;
      try {
        toPublicKey = new PublicKey(to);
      } catch {
        alert('Dirección de destino inválida');
        throw new Error('Dirección de destino inválida');
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        alert('Monto inválido');
        throw new Error('Monto inválido');
      }

      if (targetToken.isNative) {
        // Transferencia nativa (existente)
        const lamports = Math.floor(amountNum * LAMPORTS_PER_SOL);
        const publicKey = this.privateKey;
        const walletAdapter = this.walletAdapter;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPublicKey,
            lamports: lamports,
          })
        );

        transaction.feePayer = publicKey;
        const latestBlockhash = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;

        this.providerStatus.set('Firmando transacción...');
        const signedTransaction = await walletAdapter.signTransaction(transaction);
        
        this.providerStatus.set('Enviando transacción...');
        const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
        
        await this.connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        const registro: Omit<TransactionType, 'id'> = {
          from: this.privateKey.toString(),
          to: to,
          amount: amount,
          currency: 'SOL',
          txHash: signature,
          timestamp: new Date(),
          status: 'confirmed'
        };

        await this.firestoreService.addSolanaRegistro(registro);
        console.log('Transacción guardada en Firestore (colección solana):', signature);

        this.providerStatus.set('Transacción confirmada');
        console.log('Transaction successful:', signature);
        
        setTimeout(() => {
          this.refreshBalance();
          this.refreshTokenBalances(); // ✅ Actualizar balances
        }, 2000);
        
        return signature;
      } else {
        // ✅ NUEVO: Transferencia de token SPL
        const signature = await this.tokenService.transferTokenSolana(
          this.connection,
          this.walletAdapter,
          targetToken,
          to,
          amount
        );

        const registro: Omit<TransactionType, 'id'> = {
          from: this.privateKey.toString(),
          to: to,
          amount: amount,
          currency: targetToken.symbol,
          txHash: signature,
          timestamp: new Date(),
          status: 'confirmed'
        };

        await this.firestoreService.addSolanaRegistro(registro);
        console.log('Transacción SPL guardada en Firestore:', signature);

        this.providerStatus.set('Transacción SPL confirmada');
        
        setTimeout(() => {
          this.refreshTokenBalances(); // ✅ Actualizar balances
        }, 2000);
        
        return signature;
      }
    } catch (error: any) {
      console.error('Error sending Solana transaction:', error);
      this.providerStatus.set('Error en transacción');
      alert('Error: ' + (error.message || 'Unknown error'));
      throw error;
    }
  }

  // MÉTODOS EXISTENTES (se mantienen intactos)
  initProvider() {
    this.providerStatus.set('Buscando wallets Solana...');
    this.detectAvailableWallets();
  }

  detectAvailableWallets() {
    const wallets: any[] = [];

    if (typeof window !== 'undefined') {
      if ((window as any).solana?.isPhantom) {
        wallets.push({
          name: 'Phantom',
          adapter: new PhantomWalletAdapter() as unknown as WalletAdapter,
          icon: '🦊',
          detected: true
        });
      }

      if ((window as any).solflare?.isSolflare) {
        wallets.push({
          name: 'Solflare',
          adapter: new SolflareWalletAdapter() as unknown as WalletAdapter,
          icon: '🔥',
          detected: true
        });
      }

      wallets.push({
        name: 'Torus',
        adapter: new TorusWalletAdapter() as unknown as WalletAdapter,
        icon: '🔶',
        detected: true
      });
    }

    this.availableWallets.set(wallets);
    
    if (wallets.length > 0) {
      this.providerStatus.set(`${wallets.length} wallet(s) detectadas`);
    } else {
      this.providerStatus.set('No se encontraron wallets Solana');
    }
  }

  private setupWalletListeners() {
    if (!this.walletAdapter) return;

    this.removeAllListeners();

    this.listeners['connect'] = (publicKey: PublicKey) => {
      console.log('🟢 [Solana] Wallet connected:', publicKey.toString());
      this.handleWalletConnect(publicKey);
    };

    this.listeners['disconnect'] = () => {
      console.log('🔴 [Solana] Wallet disconnected');
      this.handleWalletDisconnect();
    };

    this.listeners['accountChanged'] = (newPublicKey: PublicKey | null) => {
      console.log('🔄 [Solana] Account changed:', newPublicKey?.toString());
      this.handleAccountChanged(newPublicKey);
    };

    this.listeners['error'] = (error: any) => {
      console.error('❌ [Solana] Wallet error:', error);
      this.providerStatus.set('Error: ' + error.message);
    };

    Object.entries(this.listeners).forEach(([event, callback]) => {
      if (callback && this.isWalletEvent(event)) {
        this.walletAdapter?.on(event, callback);
      }
    });
  }

  private isWalletEvent(event: string): event is WalletEvent {
    return ['connect', 'disconnect', 'accountChanged', 'error'].includes(event);
  }

  private removeAllListeners() {
    if (!this.walletAdapter) return;

    Object.entries(this.listeners).forEach(([event, callback]) => {
      if (callback && this.isWalletEvent(event)) {
        this.walletAdapter?.off(event, callback);
      }
    });
    this.listeners = {};
  }

  private handleAccountChanged(newPublicKey: PublicKey | null) {
    if (newPublicKey) {
      this.privateKey = newPublicKey;
      this.account.set(newPublicKey.toString());
      this.refreshBalance();
      this.refreshTokenBalances(); // ✅ Actualizar balances de tokens
      this.providerStatus.set('Cuenta cambiada');
      console.log('✅ [Solana] Account updated successfully');
    } else {
      this.handleWalletDisconnect();
    }
  }

  private startAccountMonitoring() {
    this.stopAccountMonitoring();
    
    this.accountCheckInterval = setInterval(async () => {
      if (this.walletAdapter?.publicKey) {
        const currentKey = this.walletAdapter.publicKey.toString();
        const storedKey = this.account();
        
        if (storedKey !== currentKey) {
          console.log('🔍 [Polling] Account changed detected:', currentKey);
          this.handleAccountChanged(this.walletAdapter.publicKey);
        }
      }
    }, 3000);
  }

  private stopAccountMonitoring() {
    if (this.accountCheckInterval) {
      clearInterval(this.accountCheckInterval);
      this.accountCheckInterval = null;
    }
  }

  private handleWalletConnect(publicKey: PublicKey) {
    this.privateKey = publicKey;
    this.account.set(publicKey.toString());
    this.isConnected.set(true);
    this.refreshBalance();
    this.refreshTokenBalances(); // ✅ Actualizar balances de tokens
    this.providerStatus.set('Conectado');
  }

  private handleWalletDisconnect() {
    this.account.set(null);
    this.balance.set('0');
    this.isConnected.set(false);
    this.privateKey = null;
    this.tokenBalances.set(new Map()); // ✅ Limpiar balances de tokens
    this.providerStatus.set('Desconectado');
    this.stopBalanceMonitoring();
    this.stopAccountMonitoring();
  }

  private startBalanceMonitoring() {
    this.stopBalanceMonitoring();
    
    this.refreshBalance();
    this.refreshTokenBalances(); // ✅ Actualizar balances de tokens
    
    this.balanceRefreshInterval = setInterval(() => {
      this.refreshBalance();
      this.refreshTokenBalances(); // ✅ Actualizar balances de tokens
    }, 30000);
    
    console.log('📊 [Solana] Balance monitoring started');
  }

  private stopBalanceMonitoring() {
    if (this.balanceRefreshInterval) {
      clearInterval(this.balanceRefreshInterval);
      this.balanceRefreshInterval = null;
      console.log('📊 [Solana] Balance monitoring stopped');
    }
  }

  async refreshBalance() {
    if (!this.privateKey) {
      this.balance.set('0');
      return;
    }
    
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const balance = await this.connection.getBalance(this.privateKey);
        const solBalance = (balance / LAMPORTS_PER_SOL).toFixed(4);
        
        if (this.balance() !== solBalance) {
          this.balance.set(solBalance);
          console.log('💰 [Solana] Balance updated:', solBalance, 'SOL');
        }
        return;
      } catch (error: any) {
        attempt++;
        console.warn(`Advertencia: Intento ${attempt} fallido al obtener balance Solana:`, error.message);
        if (attempt === maxRetries) {
          console.error('❌ [Solana] Error final al obtener balance:', error);
          this.balance.set('0');
          this.providerStatus.set('Error al obtener balance, intenta de nuevo');
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  async selectWallet(walletName: string): Promise<boolean> {
    const wallets = this.availableWallets();
    const selectedWallet = wallets.find(w => w.name === walletName);
    
    if (!selectedWallet) {
      this.providerStatus.set('Wallet no disponible');
      return false;
    }

    try {
      this.providerStatus.set(`Conectando a ${walletName}...`);
      this.walletAdapter = selectedWallet.adapter;
      this.walletName.set(walletName);
      
      this.setupWalletListeners();
      
      await this.connectWallet();
      
      this.showWalletSelector.set(false);
      return true;
    } catch (error) {
      console.error(`Error selecting wallet ${walletName}:`, error);
      this.providerStatus.set(`Error conectando a ${walletName}`);
      return false;
    }
  }

  showSelector() {
    this.showWalletSelector.set(true);
  }

  hideSelector() {
    this.showWalletSelector.set(false);
  }

  async connectWallet(): Promise<string | null> {
    if (!this.walletAdapter) {
      this.providerStatus.set('Selecciona una wallet primero');
      this.showSelector();
      return null;
    }

    try {
      this.providerStatus.set('Conectando...');
      
      const adapter = this.walletAdapter;
      
      if (!adapter.connected) {
        await adapter.connect();
      }

      if (adapter.publicKey) {
        this.privateKey = adapter.publicKey;
        const publicKeyString = this.privateKey.toString();
        this.account.set(publicKeyString);
        this.isConnected.set(true);
        await this.refreshBalance();
        await this.refreshTokenBalances(); // ✅ Actualizar balances de tokens
        this.providerStatus.set('Conectado a ' + this.walletName());
        return publicKeyString;
      }

      return null;
    } catch (error) {
      console.error('Error connecting Solana wallet:', error);
      this.providerStatus.set('Error al conectar');
      return null;
    }
  }

  async disconnect() {
    if (this.walletAdapter) {
      try {
        await this.walletAdapter.disconnect();
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    }
    
    this.account.set(null);
    this.balance.set('0');
    this.isConnected.set(false);
    this.privateKey = null;
    this.tokenBalances.set(new Map()); // ✅ Limpiar balances de tokens
    this.walletName.set('');
    this.providerStatus.set('Desconectado');
    this.showWalletSelector.set(false);
  }

  debugService() {
    console.log('=== DEBUG SolanaWalletService ===');
    console.log('Account:', this.account());
    console.log('Balance:', this.balance());
    console.log('Connected:', this.isConnected());
    console.log('Wallet Name:', this.walletName());
    console.log('Status:', this.providerStatus());
    console.log('Public Key:', this.privateKey ? this.privateKey.toString() : 'null');
    console.log('Available Wallets:', this.availableWallets());
    console.log('Show Selector:', this.showWalletSelector());
    console.log('Current Token:', this.currentToken());
    console.log('Available Tokens:', this.availableTokens());
    console.log('Token Balances:', this.tokenBalances());
    console.log('================================');
  }

  async forceBalanceRefresh() {
    console.log('🔄 [Solana] Forcing balance refresh');
    await this.refreshBalance();
    await this.refreshTokenBalances(); // ✅ Actualizar balances de tokens
  }

  async forceAccountCheck() {
    console.log('🔄 [Solana] Forcing account check');
    if (this.walletAdapter?.publicKey) {
      this.handleAccountChanged(this.walletAdapter.publicKey);
    }
  }

  getPublicKeyString(): string | null {
    return this.privateKey ? this.privateKey.toString() : null;
  }

  isProperlyConnected(): boolean {
    return this.isConnected() && this.privateKey !== null && this.walletAdapter !== null;
  }
}