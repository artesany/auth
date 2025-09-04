// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AuthBackendService } from '../../../core-prueba/services-prueba/auth-backend.service';
// import { signInWithCustomToken, getAuth } from 'firebase/auth';
// import { FirestoreService } from '../../../core-prueba/services-prueba/firestore.service';

// @Component({
//   selector: 'app-pago',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <button (click)="login()">Pagar</button>
//     <button (click)="crearRegistro()" [disabled]="!uid">Crear registro</button>

//     <p *ngIf="uid">UID: {{ uid }}</p>
//     <p *ngIf="docId">Documento creado con ID: {{ docId }}</p>
//   `
// })
// export class PagoComponent {
//   token: string | null = null;
//   uid: string | null = null;
//   docId: string | null = null;

//   constructor(
//     private auth: AuthBackendService,
//     private firestoreService: FirestoreService
//   ) {}

//   async login() {
//     // Llamamos al backend para obtener el token anónimo
//     this.token = await this.auth.loginAnonymous();

//     if (this.token) {
//       const firebaseAuth = getAuth();
//       const userCredential = await signInWithCustomToken(firebaseAuth, this.token);
//       this.uid = userCredential.user.uid; // UID dinámico generado por Firebase
//       console.log('Usuario anónimo autenticado. UID:', this.uid);
//     }
//   }

//   async crearRegistro() {
//     if (!this.uid) return; // solo si ya tenemos UID

//     const registro = {
//       uuid: this.uid,          // UID dinámico
//       monto: 50,
//       producto: 'Suscripción',
//       creadoEn: new Date()
//     };

//     try {
//       this.docId = await this.firestoreService.addRegistro(registro);
//       console.log('Documento agregado en Firestore con ID:', this.docId);
//     } catch (error) {
//       console.error('Error creando documento:', error);
//     }
//   }
// }
