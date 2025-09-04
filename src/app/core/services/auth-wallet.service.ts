// src/app/services/auth-wallet.service.ts
import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ethers, isAddress, parseEther } from 'ethers';
import { firebaseAuth, firestore } from '../../firebase.config';
import { signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class AuthWalletService {
  // 🔹 Señales reactivas
  token = signal<string | null>(null);
  account = signal<string | null>(null);
  chainId = signal<number | null>(null);
  chainSymbol = signal<string>('ETH');
  balance = signal<string>('0');

  private backendUrl = 'http://localhost:3000';
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  constructor(private http: HttpClient) {
    // Ejemplo de efecto: log cada vez que cambia el token
    effect(() => {
      console.log('Token cambiado:', this.token());
    });

    effect(() => {
      console.log('Cuenta conectada:', this.account());
    });
  }

  // 🔹 Login anónimo desde backend
  async loginAnonymous(uuid: string) {
    try {
      const response: { token: string } = await firstValueFrom(
        this.http.post<{ token: string }>(
          `${this.backendUrl}/auth-anon`,
          { uuid }
        )
      );

      this.token.set(response.token);

      // Autenticación en Firebase
      await signInWithCustomToken(firebaseAuth, response.token);

      console.log('Usuario anónimo autenticado en Firebase');

      return response.token;
    } catch (err) {
      console.error('❌ Error autenticando usuario anónimo:', err);
      return null;
    }
  }

  // 🔹 Inicializar provider de Metamask
  initProvider() {
    if (typeof window === 'undefined') return;
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      console.warn('No Ethereum provider found');
      return;
    }
    this.provider = new ethers.BrowserProvider(ethereum);
  }

  // 🔹 Conectar wallet
  async connectWallet() {
    if (!this.provider) this.initProvider();
    if (!this.provider) return null;

    try {
      const accounts: string[] = await this.provider.send('eth_requestAccounts', []);
      const account = accounts[0] || null;
      this.account.set(account);

      if (account) this.signer = await this.provider.getSigner();

      const network = await this.provider.getNetwork();
      this.chainId.set(Number(network.chainId));

      // Obtener balance
      await this.refreshBalance();

      return account;
    } catch (err) {
      console.error('❌ Error conectando wallet:', err);
      return null;
    }
  }

  async refreshBalance() {
    if (!this.provider || !this.account()) {
      this.balance.set('0');
      return;
    }
    try {
      const bal = await this.provider.getBalance(this.account()!);
      this.balance.set(ethers.formatEther(bal));
    } catch (err) {
      console.warn('Error obteniendo balance:', err);
      this.balance.set('0');
    }
  }

  // 🔹 Enviar transacción
  async sendTransaction(to: string, value: string) {
    if (!this.signer) throw new Error('No signer disponible');
    to = to.trim();
    if (!isAddress(to)) throw new Error(`Dirección inválida: ${to}`);
    if (!this.account()) throw new Error('No hay cuenta conectada');

    const amount = parseEther(value);
    const balWei = await this.provider!.getBalance(this.account()!);
    if (balWei < amount) throw new Error('Saldo insuficiente');

    try {
      const tx = await this.signer.sendTransaction({ to, value: amount });
      console.log('Transacción enviada:', tx);

      // Guardar en Firestore
      await setDoc(doc(firestore, 'transactions', tx.hash), {
        from: this.account(),
        to,
        value,
        timestamp: Date.now()
      });

      return tx;
    } catch (err) {
      console.error('Error enviando transacción:', err);
      throw err;
    }
  }
}
