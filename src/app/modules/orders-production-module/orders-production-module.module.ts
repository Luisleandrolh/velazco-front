import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersProductionModuleRoutingModule } from './orders-production-module-routing.module';
import { OrdenesproduccionComponent } from './ordenesproduccion/ordenesproduccion.component';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';


@NgModule({
  declarations: [
    
  
    OrdenesproduccionComponent
  ],
  imports: [
    CommonModule,
    OrdersProductionModuleRoutingModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    TableModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    InputNumberModule,
    TabViewModule,
    CardModule,
    MessagesModule
  ]
})
export class OrdersProductionModuleModule { }
