// import { Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class AuthBackendService {
//   // Signal para reactividad en Angular 20
//   token = signal<string | null>(null);

//   private backendUrl = 'http://localhost:3000'; // Base URL de tu backend

//   constructor(private http: HttpClient) {}

//   // Eliminamos el parámetro uuid, ya que el backend crea el token para un usuario anónimo
//   async loginAnonymous(): Promise<string | null> {
//     try {
//       const response: { token: string } = await firstValueFrom(
//         this.http.post<{ token: string }>(`${this.backendUrl}/auth-anon`, {})
//       );
//       this.token.set(response.token); // Actualiza el signal
//       return response.token;
//     } catch (error) {
//       console.error('Error autenticando usuario anónimo:', error);
//       return null;
//     }
//   }
// }

