import { Injectable, signal, effect, OnDestroy } from '@angular/core';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
import { WalletAdapter } from '../../types/solana-wallets';

// Definir tipos específicos para los eventos del wallet
type WalletEvent = 'connect' | 'disconnect' | 'accountChanged' | 'error';
type WalletEventListener = (...args: any[]) => void;

@Injectable({ providedIn: 'root' })
export class SolanaWalletService implements OnDestroy {
  // Signals
  public account = signal<string | null>(null);
  public balance = signal<string>('0');
  public isConnected = signal<boolean>(false);
  public walletName = signal<string>('');
  public providerStatus = signal<string>('No inicializado');
  public availableWallets = signal<any[]>([]);
  public showWalletSelector = signal<boolean>(false);

  private connection: Connection;
  private walletAdapter: WalletAdapter | null = null;
  private publicKey: PublicKey | null = null;
  private balanceRefreshInterval: any = null;
  private accountCheckInterval: any = null;
  private listeners: { [event in WalletEvent]?: WalletEventListener } = {};

  constructor() {
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Effect para monitorear cambios de cuenta
    effect(() => {
      const currentAccount = this.account();
      console.log('🔵 [Solana] Account changed:', currentAccount);
      if (currentAccount) {
        this.startBalanceMonitoring();
        this.startAccountMonitoring(); // <- ¡NUEVO! Monitorear cambios de cuenta
      } else {
        this.stopBalanceMonitoring();
        this.stopAccountMonitoring(); // <- ¡NUEVO!
      }
    });

    this.initProvider();
  }

  ngOnDestroy() {
    this.stopBalanceMonitoring();
    this.stopAccountMonitoring(); // <- ¡NUEVO!
    this.removeAllListeners();
  }

  initProvider() {
    this.providerStatus.set('Buscando wallets Solana...');
    this.detectAvailableWallets();
  }

  detectAvailableWallets() {
    const wallets: any[] = [];

    if (typeof window !== 'undefined') {
      // Phantom
      if ((window as any).solana?.isPhantom) {
        wallets.push({
          name: 'Phantom',
          adapter: new PhantomWalletAdapter() as unknown as WalletAdapter,
          icon: '🦊',
          detected: true
        });
      }

      // Solflare
      if ((window as any).solflare?.isSolflare) {
        wallets.push({
          name: 'Solflare',
          adapter: new SolflareWalletAdapter() as unknown as WalletAdapter,
          icon: '🔥',
          detected: true
        });
      }

      // Torus (siempre disponible)
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

  // ¡ESTE ES EL MÉTODO QUE FALTABA!
  private setupWalletListeners() {
    if (!this.walletAdapter) return;

    // Remover listeners anteriores si existen
    this.removeAllListeners();

    // Listener para conexión
    this.listeners['connect'] = (publicKey: PublicKey) => {
      console.log('🟢 [Solana] Wallet connected:', publicKey.toString());
      this.handleWalletConnect(publicKey);
    };

    // Listener para desconexión
    this.listeners['disconnect'] = () => {
      console.log('🔴 [Solana] Wallet disconnected');
      this.handleWalletDisconnect();
    };

    // Listener para cambio de cuenta
    this.listeners['accountChanged'] = (newPublicKey: PublicKey | null) => {
      console.log('🔄 [Solana] Account changed:', newPublicKey?.toString());
      this.handleAccountChanged(newPublicKey);
    };

    // Listener para errores
    this.listeners['error'] = (error: any) => {
      console.error('❌ [Solana] Wallet error:', error);
      this.providerStatus.set('Error: ' + error.message);
    };

    // Registrar listeners en el adapter
    Object.entries(this.listeners).forEach(([event, callback]) => {
      if (callback && this.isWalletEvent(event)) {
        this.walletAdapter?.on(event, callback);
      }
    });
  }

  // Helper para verificar que el evento es válido
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

  // Nuevo método para manejar cambio de cuenta
  private handleAccountChanged(newPublicKey: PublicKey | null) {
    if (newPublicKey) {
      // Si hay una nueva cuenta, actualizar
      this.publicKey = newPublicKey;
      this.account.set(newPublicKey.toString());
      this.refreshBalance();
      this.providerStatus.set('Cuenta cambiada');
      console.log('✅ [Solana] Account updated successfully');
    } else {
      // Si es null, la wallet se desconectó
      this.handleWalletDisconnect();
    }
  }

  // Monitoreo de cuenta por polling (como fallback)
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
    }, 3000); // Verificar cada 3 segundos
  }

  private stopAccountMonitoring() {
    if (this.accountCheckInterval) {
      clearInterval(this.accountCheckInterval);
      this.accountCheckInterval = null;
    }
  }

  private handleWalletConnect(publicKey: PublicKey) {
    this.publicKey = publicKey;
    this.account.set(publicKey.toString());
    this.isConnected.set(true);
    this.refreshBalance();
    this.providerStatus.set('Conectado');
  }

  private handleWalletDisconnect() {
    this.account.set(null);
    this.balance.set('0');
    this.isConnected.set(false);
    this.publicKey = null;
    this.providerStatus.set('Desconectado');
    this.stopBalanceMonitoring();
    this.stopAccountMonitoring();
  }

  private startBalanceMonitoring() {
    this.stopBalanceMonitoring();
    
    // Refrescar balance inmediatamente
    this.refreshBalance();
    
    // Y luego cada 30 segundos
    this.balanceRefreshInterval = setInterval(() => {
      this.refreshBalance();
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
    if (!this.publicKey) {
      this.balance.set('0');
      return;
    }
    
    try {
      const balance = await this.connection.getBalance(this.publicKey);
      const solBalance = (balance / LAMPORTS_PER_SOL).toFixed(4);
      
      // Solo actualizar si el valor cambió
      if (this.balance() !== solBalance) {
        this.balance.set(solBalance);
        console.log('💰 [Solana] Balance updated:', solBalance, 'SOL');
      }
    } catch (error) {
      console.error('❌ [Solana] Error fetching balance:', error);
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
      
      // Configurar listeners para la wallet seleccionada
      this.setupWalletListeners(); // <- ¡AHORA SÍ EXISTE!
      
      // Conectar
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
        this.publicKey = adapter.publicKey;
        const publicKeyString = this.publicKey.toString();
        this.account.set(publicKeyString);
        this.isConnected.set(true);
        await this.refreshBalance();
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

  async sendTransaction(to: string, amount: string): Promise<string | null> {
    if (!this.walletAdapter) {
      alert('Selecciona una wallet primero');
      this.showSelector();
      return null;
    }

    if (!this.publicKey) {
      alert('Wallet no conectada');
      return null;
    }

    if (!to || !amount) {
      alert('Dirección y monto son requeridos');
      return null;
    }

    try {
      this.providerStatus.set('Preparando transacción...');
      
      let toPublicKey;
      try {
        toPublicKey = new PublicKey(to);
      } catch {
        alert('Dirección de destino inválida');
        return null;
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        alert('Monto inválido');
        return null;
      }
      const lamports = Math.floor(amountNum * LAMPORTS_PER_SOL);

      const publicKey = this.publicKey;
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

      this.providerStatus.set('Transacción confirmada');
      console.log('Transaction successful:', signature);
      
      // Refrescar balance después de la transacción
      setTimeout(() => {
        this.refreshBalance();
      }, 2000);
      
      return signature;
    } catch (error: any) {
      console.error('Error sending Solana transaction:', error);
      this.providerStatus.set('Error en transacción');
      alert('Error: ' + (error.message || 'Unknown error'));
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
    this.publicKey = null;
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
    console.log('Public Key:', this.publicKey ? this.publicKey.toString() : 'null');
    console.log('Available Wallets:', this.availableWallets());
    console.log('Show Selector:', this.showWalletSelector());
    console.log('================================');
  }

  // Método para forzar actualización de balance
  async forceBalanceRefresh() {
    console.log('🔄 [Solana] Forcing balance refresh');
    await this.refreshBalance();
  }

  // Método para forzar detección de cuenta
  async forceAccountCheck() {
    console.log('🔄 [Solana] Forcing account check');
    if (this.walletAdapter?.publicKey) {
      this.handleAccountChanged(this.walletAdapter.publicKey);
    }
  }

  getPublicKeyString(): string | null {
    return this.publicKey ? this.publicKey.toString() : null;
  }

  isProperlyConnected(): boolean {
    return this.isConnected() && this.publicKey !== null && this.walletAdapter !== null;
  }
}