import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { InventoryModuleRoutingModule } from './inventory-module-routing.module';
import { InventarioVistaComponent } from './inventario-vista/inventario-vista.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FilePreviewPipe } from '..//inventory-module/inventario-vista/file-preview.pipe' // ajusta la ruta

@NgModule({
  declarations: [
      InventarioVistaComponent,FilePreviewPipe,
  ],
  imports: [
    CommonModule,
    InventoryModuleRoutingModule,
    FormsModule,
    NgIf,
    MatSnackBarModule

  ]
})
export class InventoryModuleModule { }