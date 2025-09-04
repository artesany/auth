import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ethers, BrowserProvider, isAddress, parseEther, formatEther } from 'ethers';
import { firebaseAuth, firestore } from '../../firebase.config';
import { signInWithCustomToken } from 'firebase/auth';
import { FirestoreService } from '../../core-prueba/services-prueba/firestore.service';

@Injectable({ providedIn: 'root' })
export class AuthWalletService {
  // Signals
  token = signal<string | null>(null);
  account = signal<string | null>(null);
  chainId = signal<number | null>(null);
  chainSymbol = signal<string>('ETH');
  balance = signal<string>('0');
  amount = signal<string>('0');

  private provider: BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  private backendUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private firestoreService: FirestoreService
  ) {
    // Actualiza balance automáticamente cuando cambian account o chain
    effect(async () => {
      if (this.account() && this.provider) {
        await this.refreshBalance();
      } else {
        this.balance.set('0');
      }
    });
  }

  // 🔹 Login anónimo
  async loginAnonymous(uuid: string) {
    try {
      const response: { token: string } = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.backendUrl}/auth-anon`, { uuid })
      );
      this.token.set(response.token);

      // Autentica en Firebase
      await signInWithCustomToken(firebaseAuth, response.token);
      console.log('Usuario anónimo autenticado en Firebase');
    } catch (err) {
      console.error('Error autenticando usuario anónimo:', err);
      throw err;
    }
  }

  // 🔹 Inicializa Metamask
  initProvider() {
    if (typeof window === 'undefined') return;
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    this.provider = new ethers.BrowserProvider(ethereum);
    this.setupListeners();
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
      if (this.provider) this.signer = await this.provider.getSigner();
      await this.refreshBalance();
    });

    ethereum.on('disconnect', () => {
      this.account.set(null);
      this.signer = null;
      this.balance.set('0');
    });
  }

  // 🔹 Conectar wallet
  async connectWallet(): Promise<string | null> {
    if (!this.provider) this.initProvider();
    if (!this.provider) return null;

    try {
      const accounts: string[] = await this.provider.send('eth_requestAccounts', []);
      this.account.set(accounts[0] || null);
      if (accounts[0]) this.signer = await this.provider.getSigner();

      const network = await this.provider.getNetwork();
      this.chainId.set(Number(network.chainId));
      this.chainSymbol.set('ETH');

      await this.refreshBalance();
      return accounts[0] || null;
    } catch (err) {
      console.error('Error conectando wallet:', err);
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

    // 🔥 GUARDAR EN FIRESTORE
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
}