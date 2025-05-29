import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { SalesModuleRoutingModule } from './sales-module-routing.module';
import { CajaVistaComponent } from './caja-vista/caja-vista.component';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DetallePedidoDialogComponent } from './caja-vista/detalle-pedido-dialog/detalle-pedido-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FiltroPedidoPipe } from './pipe/filtro-pedido.pipe'; // ajusta ruta según ubicación real

@NgModule({
  declarations: [
    CajaVistaComponent,
    DetallePedidoDialogComponent,
     FiltroPedidoPipe,
  ],
  imports: [
    CommonModule,
    SalesModuleRoutingModule,
    FormsModule,
    NgIf, 
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    
   
  ]
})
export class SalesModuleModule { }
