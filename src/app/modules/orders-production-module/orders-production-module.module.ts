import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersProductionModuleRoutingModule } from './orders-production-module-routing.module';
import { OrdenesproduccionComponent } from './ordenesproduccion/ordenesproduccion.component';


@NgModule({
  declarations: [
    
  
    OrdenesproduccionComponent
  ],
  imports: [
    CommonModule,
    OrdersProductionModuleRoutingModule
  ]
})
export class OrdersProductionModuleModule { }
