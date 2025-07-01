import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OrdersProductionModuleRoutingModule } from './orders-production-module-routing.module';
import { ProductionComponent } from './ordenesproduccion/ordenesproduccion.component';

// PrimeNG Modules (solo si los usas realmente)
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
    ProductionComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrdersProductionModuleRoutingModule,
    // PrimeNG
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
export class OrdersProductionModuleModule {}
