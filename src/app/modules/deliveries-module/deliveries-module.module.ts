import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveriesModuleRoutingModule } from './deliveries-module-routing.module';
import { EntregasVistaComponent } from './entregas-vista/entregas-vista.component';


@NgModule({
  declarations: [
    EntregasVistaComponent
  ],
  imports: [
    CommonModule,
    DeliveriesModuleRoutingModule
  ]
})
export class DeliveriesModuleModule { }
