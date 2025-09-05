import { PublicKey, Transaction } from '@solana/web3.js';

export interface WalletAdapter {
  publicKey: PublicKey | null;
  connected: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
  on(event: string, callback: (args: any) => void): void;
  off(event: string, callback: (args: any) => void): void;
}

export interface SolanaWallet {
  name: string;
  adapter: WalletAdapter;
  icon: string;
  detected: boolean;
}
