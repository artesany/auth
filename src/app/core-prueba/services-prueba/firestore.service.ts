import { Injectable } from '@angular/core';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase.config';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor() {}

  async addRegistro(data: any) {
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
  async addSolanaRegistro(data: any) {
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
  
}