// auth-backend.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthBackendService {
  // Signal para guardar el token del usuario
  token = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Llamar al backend para crear usuario anónimo
  async loginAnon(): Promise<string> {
    const res: any = await this.http.post('/api/anon-auth', {}).toPromise();
    this.token.set(res.token);
    return res.token;
  }

  // Guardar datos en Firestore a través del backend
  async saveData(data: any) {
    if (!this.token()) throw new Error('No token disponible');
    const res = await this.http.post('/api/save-uuid', {
      token: this.token(),
      data
    }).toPromise();
    return res;
  }
}
