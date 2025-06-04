import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Añade esta importación
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DeliveriesModuleRoutingModule } from './deliveries-module-routing.module';
import { EntregasVistaComponent } from './entregas-vista/entregas-vista.component';

import { TabMenuModule } from 'primeng/tabmenu';


@NgModule({
  declarations: [
    EntregasVistaComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // <-- Añade esto
    DeliveriesModuleRoutingModule,
    OverlayPanelModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    TabViewModule,
    TableModule,
    DialogModule,
    CardModule,
    TagModule,
    ToastModule,
    TabMenuModule,
    InputTextareaModule
  ]
})
export class DeliveriesModuleModule { }


