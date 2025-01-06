import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';
import { getDatabase, provideDatabase } from '@angular/fire/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCsJtcJsWt6050OMJaRIkmMZH1KGchp02M',
  authDomain: 'medx-final.firebaseapp.com',
  databaseURL: 'https://medx-final-default-rtdb.firebaseio.com',
  projectId: 'medx-final',
  storageBucket: 'medx-final.appspot.com',
  messagingSenderId: '1082876297201',
  appId: '1:1082876297201:web:157c16a946a580f38c8e50',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideHttpClient(),
    provideDatabase(() => getDatabase()),
  ],
};
