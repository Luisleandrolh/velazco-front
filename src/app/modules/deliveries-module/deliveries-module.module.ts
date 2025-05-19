import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Añade esta importación

import { DeliveriesModuleRoutingModule } from './deliveries-module-routing.module';
import { EntregasVistaComponent } from './entregas-vista/entregas-vista.component';

@NgModule({
  declarations: [
    EntregasVistaComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // <-- Añade esto
    DeliveriesModuleRoutingModule
  ]
})
export class DeliveriesModuleModule { }


//------------------------------------------------------------------------------------------------