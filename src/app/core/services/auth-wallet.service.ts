import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ethers, BrowserProvider, isAddress, parseEther, formatEther } from 'ethers';
import { firebaseAuth, firestore } from '../../firebase.config';
import { signInWithCustomToken, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { FirestoreService } from '../../core-prueba/services-prueba/firestore.service';
import { getChainById } from '../helpers/chains.helper';

@Injectable({ providedIn: 'root' })
export class AuthWalletService {
  // Signals
  token = signal<string | null>(null);
  account = signal<string | null>(null);
  chainId = signal<number | null>(null);
  chainSymbol = signal<string>('ETH');
  balance = signal<string>('0');
  amount = signal<string>('0');
  isAuthenticated = signal<boolean>(false);
  firebaseUser = signal<User | null>(null);
  providerStatus = signal<string>('No inicializado'); // 🔥 NUEVO: Para debug

  private provider: BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private backendUrl = 'http://localhost:3000';

  // Claves para localStorage
  private readonly AUTH_TOKEN_KEY = 'firebase_custom_token';
  private readonly ANON_UUID_KEY = 'anonymous_uuid';

  constructor(
    private http: HttpClient,
    private firestoreService: FirestoreService
  ) {
    // Efecto para persistir el token
    effect(() => {
      const currentToken = this.token();
      if (currentToken) {
        localStorage.setItem(this.AUTH_TOKEN_KEY, currentToken);
      } else {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
      }
    });

    // Efecto para refrescar balance
    effect(async () => {
      if (this.account() && this.provider) {
        await this.refreshBalance();
      } else {
        this.balance.set('0');
      }
    });

    // Inicializar auth
    this.initAuthListener();
    this.initializeAppAuth();
  }

  /**
   * 🔥 NUEVO: Método de debug para ver el estado del servicio
   */
  debugService() {
    console.log('=== DEBUG AuthWalletService ===');
    console.log('Provider:', this.provider);
    console.log('Signer:', this.signer);
    console.log('Ethereum in window:', (window as any).ethereum ? 'Disponible' : 'No disponible');
    console.log('Account:', this.account());
    console.log('ChainId:', this.chainId());
    console.log('IsAuthenticated:', this.isAuthenticated());
    console.log('ProviderStatus:', this.providerStatus());
    console.log('================================');
  }

  private initAuthListener() {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log('Auth state changed:', user);
      this.firebaseUser.set(user);
      this.isAuthenticated.set(!!user);

      if (user) {
        user.getIdToken().then(token => {
          console.log('Firebase ID Token disponible');
        }).catch(err => {
          console.error('Error getting ID token:', err);
        });
      } else {
        this.token.set(null);
      }
    });
  }

  private async initializeAppAuth() {
    const savedToken = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const savedUuid = localStorage.getItem(this.ANON_UUID_KEY);

    if (savedToken) {
      try {
        await signInWithCustomToken(firebaseAuth, savedToken);
        this.token.set(savedToken);
        console.log('Sesión recuperada desde localStorage');
      } catch (error) {
        console.error('Error recuperando sesión:', error);
        this.cleanupAuth();
        
        if (savedUuid) {
          console.log('Intentando reautenticación anónima...');
          await this.loginAnonymous(savedUuid);
        }
      }
    } else if (savedUuid) {
      console.log('Intentando autenticación anónima con UUID guardado...');
      await this.loginAnonymous(savedUuid);
    }
  }

  private cleanupAuth() {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.ANON_UUID_KEY);
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.firebaseUser.set(null);
  }

  // 🔹 Login anónimo
  async loginAnonymous(uuid: string) {
    try {
      localStorage.setItem(this.ANON_UUID_KEY, uuid);

      const response: { token: string } = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.backendUrl}/auth-anon`, { uuid })
      );
      
      this.token.set(response.token);
      await signInWithCustomToken(firebaseAuth, response.token);
      console.log('Usuario anónimo autenticado en Firebase');
      
      return true;
    } catch (err) {
      console.error('Error autenticando usuario anónimo:', err);
      this.cleanupAuth();
      throw err;
    }
  }

  // 🔹 Cerrar sesión
  async logout() {
    try {
      await signOut(firebaseAuth);
      this.cleanupAuth();
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  }

  // 🔹 Inicializa Metamask - MEJORADO CON DEBUG
  initProvider() {
    if (typeof window === 'undefined') {
      this.providerStatus.set('Window no disponible');
      return;
    }
    
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      this.providerStatus.set('MetaMask no encontrado');
      console.error('MetaMask no está instalado');
      return;
    }

    try {
      this.provider = new ethers.BrowserProvider(ethereum);
      this.providerStatus.set('Provider inicializado correctamente');
      this.setupListeners();
    } catch (error) {
      this.providerStatus.set('Error inicializando provider');
      console.error('Error creating provider:', error);
    }
  }

  private setupListeners() {
    if (!this.provider) return;
    const ethereum = (window as any).ethereum;

    ethereum.on('accountsChanged', async () => {
      const accounts: string[] = await this.provider!.send('eth_accounts', []);
      this.account.set(accounts[0] || null);
      if (accounts[0]) this.signer = await this.provider!.getSigner();
    });

    ethereum.on('chainChanged', async (chainIdHex: string) => {
      const id = Number(BigInt(chainIdHex));
      this.chainId.set(id);

      const chainInfo = getChainById(id);
      this.chainSymbol.set(chainInfo?.symbol || 'ETH');

      if (this.provider) this.signer = await this.provider.getSigner();
      await this.refreshBalance();
    });

    ethereum.on('disconnect', () => {
      this.account.set(null);
      this.signer = null;
      this.balance.set('0');
    });
  }

  // 🔹🔹🔹🔹🔹🔹🔹🔹 MÉTODO CONECTAR WALLET RESTAURADO 🔹🔹🔹🔹🔹🔹🔹🔹
  async connectWallet(): Promise<string | null> {
    // Si no hay provider, intentar inicializarlo
    if (!this.provider) {
      this.initProvider();
      if (!this.provider) {
        alert('No se pudo inicializar MetaMask. ¿Está instalado?');
        return null;
      }
    }

    try {
      const accounts: string[] = await this.provider.send('eth_requestAccounts', []);
      const account = accounts[0] || null;
      this.account.set(account);
      
      if (account) {
        this.signer = await this.provider.getSigner();
      }

      const network = await this.provider.getNetwork();
      const chainIdNum = Number(network.chainId);
      this.chainId.set(chainIdNum);

      const chainInfo = getChainById(chainIdNum);
      this.chainSymbol.set(chainInfo?.symbol || 'ETH');

      await this.refreshBalance();
      
      console.log('Wallet conectada:', account);
      return account;
    } catch (err) {
      console.error('Error conectando wallet:', err);
      
      // 🔥 MEJOR MANEJO DE ERRORES
      if ((err as any).code === 4001) {
        alert('Connection rejected by user');
      } else {
        alert('Error connecting to wallet: ' + (err as Error).message);
      }
      
      return null;
    }
  }

  // 🔹 Balance
  async refreshBalance() {
    if (!this.account() || !this.provider) {
      this.balance.set('0');
      return;
    }
    const b = await this.provider.getBalance(this.account()!);
    this.balance.set(formatEther(b));
  }

  // 🔹 Enviar transacción
  async sendTransaction(to: string, value: string) {
    if (!this.signer) throw new Error('No signer disponible');
    if (!isAddress(to)) throw new Error('Dirección inválida');
    const amount = parseEther(value);

    const balanceWei = await this.provider!.getBalance(this.account()!);
    if (balanceWei < amount) throw new Error('Saldo insuficiente');

    const tx = await this.signer.sendTransaction({ to, value: amount });

    const registro = {
      from: this.account(),
      to: to,
      amount: value,
      currency: this.chainSymbol(),
      txHash: tx.hash,
      timestamp: new Date(),
      status: 'pending'
    };

    await this.firestoreService.addRegistro(registro);
    console.log('Transacción guardada en Firestore');

    return tx;
  }

  // 🔹 Cambiar de red
  async switchChain(targetChainId: number): Promise<boolean> {
    if (!this.provider) return false;
    const ethereum = (window as any).ethereum;
    const chainHex = '0x' + targetChainId.toString(16);

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainHex }]
      });

      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();
      this.chainId.set(targetChainId);

      const chain = getChainById(targetChainId);
      this.chainSymbol.set(chain?.symbol || 'ETH');

      await this.refreshBalance();
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        const chainInfo = getChainById(targetChainId);
        if (!chainInfo) return false;

        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainHex,
              chainName: chainInfo.name,
              rpcUrls: [chainInfo.rpcUrl],
              nativeCurrency: chainInfo.nativeCurrency
            }]
          });
          this.provider = new ethers.BrowserProvider(ethereum);
          this.signer = await this.provider.getSigner();
          this.chainId.set(targetChainId);
          this.chainSymbol.set(chainInfo.symbol || 'ETH');
          await this.refreshBalance();
          return true;
        } catch (err) {
          console.error('Failed to add chain:', err);
          return false;
        }
      } else {
        console.error('Failed to switch chain:', switchError);
        return false;
      }
    }
  }
}