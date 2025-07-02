import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  // Lista de componentes, directivas y pipes declarados en este módulo
  declarations: [
    PagesComponent, // Declara que este módulo contiene el componente PagesComponent
  ],

  // Otros módulos que se necesitan para que este módulo funcione
  imports: [
    CommonModule, // Importa directivas comunes como *ngIf, *ngFor (necesario en módulos que no son AppModule)
    PagesRoutingModule, // Importa las rutas específicas de este módulo (probablemente contiene rutas para PagesComponent)
    SharedModule, // Módulo compartido con componentes/reutilizables que se usan en varios lugares
  ],
})
// Exporta la clase del módulo para que Angular pueda reconocerlo e integrarlo con otros módulos
export class PagesModule {}
