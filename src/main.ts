import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

if (typeof window !== 'undefined') {
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
}
