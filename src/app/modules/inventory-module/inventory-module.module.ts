import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryModuleRoutingModule } from './inventory-module-routing.module';
import { InventarioVistaComponent } from './inventario-vista/inventario-vista.component';


@NgModule({
  declarations: [
    InventarioVistaComponent
  ],
  imports: [
    CommonModule,
    InventoryModuleRoutingModule
  ]
})
export class InventoryModuleModule { }
