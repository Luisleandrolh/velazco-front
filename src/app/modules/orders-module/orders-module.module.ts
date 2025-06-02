import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersModuleRoutingModule } from './orders-module-routing.module';
import { PedidosVistaComponent } from './pedidos-vista/pedidos-vista.component';
// modulos de PrimeNG 
import { ToastModule } from 'primeng/toast';  
import { CardModule } from 'primeng/card'; 
import { DialogModule } from 'primeng/dialog'; 
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { MessageService } from 'primeng/api';





@NgModule({
  declarations: [
    PedidosVistaComponent
  ],
  imports: [
    CommonModule,
  OrdersModuleRoutingModule,
  FormsModule,
  ToastModule,
  CardModule, 
  DialogModule, 
  BadgeModule, 
  ButtonModule, 
  DividerModule


 
    
  ],
  providers: [MessageService]  
})

export class OrdersModuleModule { }
