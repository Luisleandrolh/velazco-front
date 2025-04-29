import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersModuleRoutingModule } from './orders-module-routing.module';
import { PedidosVistaComponent } from './pedidos-vista/pedidos-vista.component';


@NgModule({
  declarations: [
    PedidosVistaComponent
  ],
  imports: [
    CommonModule,
    OrdersModuleRoutingModule,
    FormsModule,
    
  ]
})
export class OrdersModuleModule { }
