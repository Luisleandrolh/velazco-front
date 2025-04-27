import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersModuleRoutingModule } from './orders-module-routing.module';
import { PedidosVistaComponent } from './pedidos-vista/pedidos-vista.component';


@NgModule({
  declarations: [
    PedidosVistaComponent
  ],
  imports: [
    CommonModule,
    OrdersModuleRoutingModule
  ]
})
export class OrdersModuleModule { }
