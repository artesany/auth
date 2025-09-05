import { Injectable, signal } from '@angular/core';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';

@Injectable({ providedIn: 'root' })
export class SolanaWalletService {
  // Signals
  public account = signal<string | null>(null);
  public balance = signal<string>('0');
  public isConnected = signal<boolean>(false);
  public walletName = signal<string>('');
  public providerStatus = signal<string>('No inicializado');

  private connection: Connection;
  private walletAdapter: PhantomWalletAdapter | SolflareWalletAdapter | null = null;
  private publicKey: PublicKey | null = null;

  constructor() {
    this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    this.initProvider();
  }

  initProvider() {
    this.providerStatus.set('Buscando wallet Solana...');
    
    // Detectar wallet instalada
    if (typeof window !== 'undefined') {
      if ((window as any).solana?.isPhantom) {
        this.walletAdapter = new PhantomWalletAdapter();
        this.walletName.set('Phantom');
        this.providerStatus.set('Phantom detectado');
      } else if ((window as any).solflare?.isSolflare) {
        this.walletAdapter = new SolflareWalletAdapter();
        this.walletName.set('Solflare');
        this.providerStatus.set('Solflare detectado');
      } else {
        this.providerStatus.set('No se encontró wallet Solana');
        console.warn('No Solana wallet found');
        return;
      }

      // Configurar event listeners
      this.setupWalletListeners();
    }
  }

  private setupWalletListeners() {
    if (!this.walletAdapter) return;

    // 🔥 USAR 'this' CORRECTAMENTE EN LOS LISTENERS
    const walletAdapter = this.walletAdapter;
    
    walletAdapter.on('connect', (publicKey: PublicKey) => {
      console.log('Connected to Solana wallet:', publicKey.toString());
      this.publicKey = publicKey;
      this.account.set(publicKey.toString());
      this.isConnected.set(true);
      this.refreshBalance();
    });

    walletAdapter.on('disconnect', () => {
      console.log('Disconnected from Solana wallet');
      this.disconnect();
    });

    walletAdapter.on('error', (error: any) => {
      console.error('Solana wallet error:', error);
      this.providerStatus.set('Error: ' + error.message);
    });
  }

  async connectWallet(): Promise<string | null> {
    if (!this.walletAdapter) {
      this.providerStatus.set('Wallet no disponible. Instala Phantom o Solflare');
      alert('Please install a Solana wallet like Phantom or Solflare');
      return null;
    }

    try {
      this.providerStatus.set('Conectando...');
      
      // 🔥 USAR VARIABLE LOCAL PARA EVITAR ERRORES DE TIPO
      const adapter = this.walletAdapter;
      
      if (!adapter.connected) {
        await adapter.connect();
      }

      // 🔥 VERIFICAR EXPLÍCITAMENTE QUE publicKey EXISTE
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

  async refreshBalance() {
    // 🔥 VALIDACIÓN EXPLÍCITA ANTES DE USAR publicKey
    if (!this.publicKey) {
      this.balance.set('0');
      return;
    }
    
    try {
      const balance = await this.connection.getBalance(this.publicKey);
      const solBalance = (balance / LAMPORTS_PER_SOL).toFixed(4);
      this.balance.set(solBalance);
    } catch (error) {
      console.error('Error fetching Solana balance:', error);
      this.balance.set('0');
    }
  }

  async sendTransaction(to: string, amount: string): Promise<string | null> {
    // 🔥 VALIDACIÓN EXPLÍCITA EN MÚLTIPLES PUNTOS
    if (!this.walletAdapter) {
      alert('Wallet adapter no disponible');
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
      
      // Validar dirección de destino
      let toPublicKey;
      try {
        toPublicKey = new PublicKey(to);
      } catch {
        alert('Dirección de destino inválida');
        return null;
      }

      // Convertir amount a lamports
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        alert('Monto inválido');
        return null;
      }
      const lamports = Math.floor(amountNum * LAMPORTS_PER_SOL);

      // 🔥 USAR VARIABLES LOCALES PARA EVITAR ERRORES DE TIPO
      const publicKey = this.publicKey;
      const walletAdapter = this.walletAdapter;

      // Crear transacción
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey, // ✅ Variable local, no puede ser null aquí
          toPubkey: toPublicKey,
          lamports: lamports,
        })
      );

      // Configurar transaction parameters
      transaction.feePayer = publicKey; // ✅ Variable local
      const latestBlockhash = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;

      // Sign and send transaction
      this.providerStatus.set('Firmando transacción...');
      const signedTransaction = await walletAdapter.signTransaction(transaction);
      
      this.providerStatus.set('Enviando transacción...');
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      // Confirm transaction
      await this.connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      this.providerStatus.set('Transacción confirmada');
      console.log('Transaction successful:', signature);
      
      // Refresh balance after transaction
      await this.refreshBalance();
      
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
    this.providerStatus.set('Desconectado');
  }

  debugService() {
    console.log('=== DEBUG SolanaWalletService ===');
    console.log('Account:', this.account());
    console.log('Balance:', this.balance());
    console.log('Connected:', this.isConnected());
    console.log('Wallet Name:', this.walletName());
    console.log('Status:', this.providerStatus());
    console.log('Public Key:', this.publicKey ? this.publicKey.toString() : 'null');
    console.log('Wallet Adapter:', this.walletAdapter);
    console.log('Connection:', this.connection);
    console.log('Window solana:', (window as any).solana);
    console.log('Window solflare:', (window as any).solflare);
    console.log('================================');
  }

  getAvailableWallets(): string[] {
    const availableWallets = [];
    
    if (typeof window !== 'undefined') {
      if ((window as any).solana?.isPhantom) {
        availableWallets.push('Phantom');
      }
      if ((window as any).solflare?.isSolflare) {
        availableWallets.push('Solflare');
      }
    }
    
    return availableWallets;
  }

  async reconnectIfNeeded(): Promise<boolean> {
    // 🔥 VALIDACIÓN EXPLÍCITA
    if (this.walletAdapter?.connected && this.publicKey) {
      await this.refreshBalance();
      return true;
    }
    return false;
  }

  isWalletAvailable(): boolean {
    return !!(this.walletAdapter && this.publicKey);
  }

  getPublicKeyString(): string | null {
    return this.publicKey ? this.publicKey.toString() : null;
  }

  // 🔥 NUEVO: Método seguro para obtener el wallet adapter
  getWalletAdapter(): PhantomWalletAdapter | SolflareWalletAdapter | null {
    return this.walletAdapter;
  }

  // 🔥 NUEVO: Método seguro para verificar conexión
  isConnectedSafely(): boolean {
    return this.isConnected() && this.publicKey !== null;
  }
}