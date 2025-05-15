import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionModuleRoutingModule } from './production-module-routing.module';
import { ProduccionComponent } from './produccion/produccion.component';


@NgModule({
  declarations: [
    ProduccionComponent
  ],
  imports: [
    CommonModule,
    ProductionModuleRoutingModule
  ]
})
export class ProductionModuleModule { }
