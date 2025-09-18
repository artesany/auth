import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environment';

// Importa tus rutas
import { routes } from './app/app.routes';

// Initialize Firebase
const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideAnimationsAsync(), // ✅ Animaciones asíncronas
    provideRouter(routes), // ✅ Proveedor de rutas
    ...appConfig.providers
  ]
})
.catch(err => console.error(err));