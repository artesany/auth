import { PublicKey, Transaction } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
      isConnected: boolean;
      publicKey: PublicKey | null;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      on: (event: string, callback: (args: any) => void) => void;
      off: (event: string, callback: (args: any) => void) => void;
    };
    
    solflare?: {
      isSolflare: boolean;
      isConnected: boolean;
      publicKey: PublicKey | null;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      on: (event: string, callback: (args: any) => void) => void;
      off: (event: string, callback: (args: any) => void) => void;
    };
    
    torus?: any;
  }
}

export {};