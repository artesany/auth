import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule), // <--- necesario para HttpClient
    ...appConfig.providers // si tienes otros providers en appConfig
  ]
})
.catch(err => console.error(err));

