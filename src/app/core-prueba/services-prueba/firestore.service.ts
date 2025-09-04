import { Injectable } from '@angular/core';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase.config';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor() {}

  async addRegistro(data: any) {
    try {
      const colRef = collection(firestore, 'registros');
      const docRef = await addDoc(colRef, data);
      console.log('Documento creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creando documento:', error);
      throw error;
    }
  }
}