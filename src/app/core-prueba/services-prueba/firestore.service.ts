// firestore.service.ts
import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../firebase.config';
import { Transaction } from '../../types/types'; // Ajusta la ruta

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor() {}

  async addRegistro(data: Omit<Transaction, 'id'>) {
    try {
      const colRef = collection(firestore, 'ethereum');
      const docRef = await addDoc(colRef, data);
      console.log('Documento creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creando documento:', error);
      throw error;
    }
  }

  async addSolanaRegistro(data: Omit<Transaction, 'id'>) {
    try {
      const colRef = collection(firestore, 'solana');
      const docRef = await addDoc(colRef, data);
      console.log('Documento Solana creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creando documento Solana:', error);
      throw error;
    }
  }

  async getTransactions(collectionName: 'ethereum' | 'solana'): Promise<Transaction[]> {
    try {
      const colRef = collection(firestore, collectionName);
      const q = query(colRef);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction));
    } catch (error) {
      console.error(`Error leyendo transacciones de ${collectionName}:`, error);
      throw error;
    }
  }
}