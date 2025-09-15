import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environment';

// Initialize Firebase
const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
    ...appConfig.providers
  ]
})
.catch(err => console.error(err));