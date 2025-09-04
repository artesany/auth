import { Injectable } from '@angular/core';
import { collection, addDoc, Firestore } from 'firebase/firestore';
import { firestore } from '../../firebase.config';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor() {}

  async addRegistro(data: any) {
    try {
      const colRef = collection(firestore, 'registros'); // nombre de tu colección
      const docRef = await addDoc(colRef, data);
      console.log('Documento creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creando documento:', error);
      return null;
    }
  }
}
