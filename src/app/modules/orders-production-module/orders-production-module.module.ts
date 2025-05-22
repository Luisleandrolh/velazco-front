import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersProductionModuleRoutingModule } from './orders-production-module-routing.module';
import { OrdenesproduccionComponent } from './ordenesproduccion/ordenesproduccion.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    
  
    OrdenesproduccionComponent
  ],
  imports: [
    CommonModule,
    OrdersProductionModuleRoutingModule,
    FormsModule

  ]
})
export class OrdersProductionModuleModule { }
