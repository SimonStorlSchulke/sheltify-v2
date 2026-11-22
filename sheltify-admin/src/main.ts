import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Mark the browser tab, so dev and production are easy to tell apart.
if (isDevMode()) {
  document.title = 'DEV ' + document.title;
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
