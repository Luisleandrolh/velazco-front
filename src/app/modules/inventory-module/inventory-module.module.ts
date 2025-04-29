import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { InventoryModuleRoutingModule } from './inventory-module-routing.module';
import { InventarioVistaComponent } from './inventario-vista/inventario-vista.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
      InventarioVistaComponent
  ],
  imports: [
    CommonModule,
    InventoryModuleRoutingModule,
    FormsModule,
    NgIf

  ]
})
export class InventoryModuleModule { }