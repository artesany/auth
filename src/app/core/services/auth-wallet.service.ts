import { Injectable, signal, effect, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ethers, BrowserProvider, isAddress, parseEther, formatEther } from 'ethers';

// ✅ Importaciones CORRECTAS de Firebase
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithCustomToken, 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { environment } from '../../../environments/environment';
import { FirestoreService } from '../../core-prueba/services-prueba/firestore.service';
import { getChainById } from '../helpers/chains.helper';
import { Transaction } from '../../types/types';

@Injectable({ providedIn: 'root' })
export class AuthWalletService implements OnDestroy {
  // ✅ Inicialización CORRECTA
  private firebaseApp = initializeApp(environment.firebase);
  private auth = getAuth(this.firebaseApp);
  private firestore = getFirestore(this.firebaseApp);

  // Signals existentes
  token = signal<string | null>(null);
  account = signal<string | null>(null);
  chainId = signal<number | null>(null);
  chainSymbol = signal<string>('ETH');
  balance = signal<string>('0');
  amount = signal<string>('0');
  isAuthenticated = signal<boolean>(false);
  firebaseUser = signal<User | null>(null);
  providerStatus = signal<string>('No inicializado');

  // Nuevas signals para autenticación social
  isAdmin = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  private provider: BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private backendUrl = 'http://localhost:3000';

  private readonly AUTH_TOKEN_KEY = 'firebase_custom_token';
  private readonly ANON_UUID_KEY = 'anonymous_uuid';
  private authStateUnsubscribe: (() => void) | null = null;

  constructor(
    private http: HttpClient,
    private firestoreService: FirestoreService
  ) {
    // Effects existentes
    effect(() => {
      const currentToken = this.token();
      if (currentToken) {
        localStorage.setItem(this.AUTH_TOKEN_KEY, currentToken);
      } else {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
      }
    });

    effect(async () => {
      if (this.account() && this.provider) {
        await this.refreshBalance();
      } else {
        this.balance.set('0');
      }
    });

    // Inicializaciones
    this.initAuthListener();
    this.initializeAppAuth();
  }

  ngOnDestroy() {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
    }
  }

  // MÉTODOS EXISTENTES DE WALLET
  debugService() {
    console.log('=== DEBUG AuthWalletService ===');
    console.log('Provider:', this.provider);
    console.log('Signer:', this.signer);
    console.log('Ethereum in window:', (window as any).ethereum ? 'Disponible' : 'No disponible');
    console.log('Account:', this.account());
    console.log('ChainId:', this.chainId());
    console.log('IsAuthenticated:', this.isAuthenticated());
    console.log('ProviderStatus:', this.providerStatus());
    console.log('IsAdmin:', this.isAdmin());
    console.log('FirebaseUser:', this.firebaseUser());
    console.log('================================');
  }

  private initAuthListener() {
    this.authStateUnsubscribe = onAuthStateChanged(this.auth, async (user) => {
      console.log('Auth state changed:', user);
      this.firebaseUser.set(user);
      this.isAuthenticated.set(!!user);

      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;
        
        // ✅ CORRECCIÓN: Acceso por corchetes para la propiedad 'admin'
        this.isAdmin.set(user.uid === 'tuUID' || claims['admin'] === true);
        
        user.getIdToken().then(token => {
          console.log('Firebase ID Token disponible');
        }).catch(err => {
          console.error('Error getting ID token:', err);
        });
      } else {
        this.token.set(null);
        this.isAdmin.set(false);
      }
    });
  }

  private async initializeAppAuth() {
    const savedToken = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const savedUuid = localStorage.getItem(this.ANON_UUID_KEY);

    if (savedToken) {
      try {
        await signInWithCustomToken(this.auth, savedToken);
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
    this.isAdmin.set(false);
    
    // ✅ NO limpiar el estado de la wallet conectada
    // La wallet MetaMask/Solana puede permanecer conectada independientemente de la autenticación Firebase
    console.log('Sesión Firebase cerrada, pero wallet puede permanecer conectada');
  }

  async loginAnonymous(uuid: string) {
    try {
      localStorage.setItem(this.ANON_UUID_KEY, uuid);

      const response: { token: string } = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.backendUrl}/auth-anon`, { uuid })
      );
      
      this.token.set(response.token);
      await signInWithCustomToken(this.auth, response.token);
      console.log('Usuario anónimo autenticado en Firebase');
      
      return true;
    } catch (err) {
      console.error('Error autenticando usuario anónimo:', err);
      this.cleanupAuth();
      throw err;
    }
  }

  async logout() {
    try {
      // ✅ Guardar estado de la wallet antes de cerrar sesión
      const wasWalletConnected = !!this.account();
      
      await signOut(this.auth);
      this.cleanupAuth();
      
      console.log('Sesión cerrada. Wallet estaba conectada:', wasWalletConnected);
      // La wallet MetaMask permanece conectada, solo cerramos sesión Firebase
      
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  }

  async initProvider() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.providerStatus.set('Proveedor detectado');

      const ethereum = (window as any).ethereum;
      ethereum.on('accountsChanged', async (accounts: string[]) => {
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
    } else {
      this.providerStatus.set('No se detectó MetaMask');
    }
  }

  async connectWallet(): Promise<string | null> {
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
      if ((err as any).code === 4001) {
        alert('Connection rejected by user');
      } else {
        alert('Error connecting to wallet: ' + (err as Error).message);
      }
      return null;
    }
  }

  async refreshBalance() {
    if (!this.account() || !this.provider) {
      this.balance.set('0');
      return;
    }
    const b = await this.provider.getBalance(this.account()!);
    this.balance.set(formatEther(b));
  }

  async sendTransaction(to: string, value: string) {
    if (!this.signer) throw new Error('No signer disponible');
    if (!isAddress(to)) throw new Error('Dirección inválida');
    
    // ✅ CORRECCIÓN: Asegurar que value sea string
    const valueString = typeof value === 'string' ? value : String(value);
    
    // ✅ Validar formato del amount
    if (!/^\d+(\.\d+)?$/.test(valueString)) {
      throw new Error('Formato de monto inválido. Use números con punto decimal');
    }
    
    const amount = parseEther(valueString);

    const balanceWei = await this.provider!.getBalance(this.account()!);
    if (balanceWei < amount) throw new Error('Saldo insuficiente');

    const tx = await this.signer.sendTransaction({ to, value: amount });

    const registro: Omit<Transaction, 'id'> = {
      from: this.account()!,
      to: to,
      amount: valueString, // ✅ Usar el string validado
      currency: this.chainSymbol(),
      txHash: tx.hash,
      timestamp: new Date(),
      status: 'pending'
    };

    await this.firestoreService.addRegistro(registro);
    console.log('Transacción guardada en Firestore');

    return tx;
  }

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

  // NUEVOS MÉTODOS DE AUTENTICACIÓN SOCIAL
  async signInWithGoogle() {
  try {
    // ✅ Cerrar sesión existente primero si está autenticado
    if (this.isAuthenticated()) {
      console.log('🔒 Cerrando sesión previa...');
      await this.logout();
    }

    this.errorMessage.set(null);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;
    
    const idTokenResult = await user.getIdTokenResult();
    const claims = idTokenResult.claims;
    
    this.isAdmin.set(claims['admin'] === true);
    console.log('✅ Usuario autenticado con Google:', user);
    
  } catch (error: any) {
    console.error('❌ Error en login con Google:', error);
    this.errorMessage.set(error.message);
  }
}

  // Método alternativo para login anónimo (complementario)
  async loginAnonymousAlt(uuid: string) {
    try {
      this.errorMessage.set(null);
      const response = await fetch(`${this.backendUrl}/auth-anon`, {
        method: 'POST',
        body: JSON.stringify({ uuid }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Error en respuesta del servidor');
      
      const { token } = await response.json();
      await signInWithCustomToken(this.auth, token);
      console.log('Usuario anónimo autenticado (método alternativo)');
      
    } catch (error: any) {
      console.error('Error autenticando usuario anónimo:', error);
      this.errorMessage.set(error.message);
    }
  }
}