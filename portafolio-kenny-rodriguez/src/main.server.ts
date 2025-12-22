import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';  // ✅ Cambiar de 'App' a 'AppComponent'
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);  // ✅ Usar AppComponent

export default bootstrap;
