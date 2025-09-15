// types.ts
import { Timestamp } from 'firebase/firestore';

export interface Transaction {
  id?: string; // Opcional, generado por Firestore
  from: string;
  to: string;
  amount: string;
  currency: string;
  txHash: string;
  timestamp: Timestamp | Date; // Soporta ambos
  status: string;
}