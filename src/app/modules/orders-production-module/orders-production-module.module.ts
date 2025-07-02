import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OrdersProductionModuleRoutingModule } from './orders-production-module-routing.module';
import { ProductionComponent } from './ordenesproduccion/ordenesproduccion.component';

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
import { TagModule } from 'primeng/tag'; // Para los badges de estado
import { TooltipModule } from 'primeng/tooltip'; // Para tooltips en botones
import { DividerModule } from 'primeng/divider'; // Para separadores visuales
import { BadgeModule } from 'primeng/badge'; // Para notificaciones/contadores
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Para loaders
import { ToastModule } from 'primeng/toast'; // Para notificaciones toast
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Para diálogos de confirmación

@NgModule({
  declarations: [
    ProductionComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrdersProductionModuleRoutingModule,
    
    // PrimeNG Modules
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
    MessagesModule,
    TagModule,
    TooltipModule,
    DividerModule,
    BadgeModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule
  ]
})
export class OrdersProductionModuleModule {}