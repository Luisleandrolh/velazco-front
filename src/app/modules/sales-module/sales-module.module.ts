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
import { FiltroPedidoPipe } from './pipe/filtro-pedido.pipe';
import { MetodoPagoDialogComponent } from './caja-vista/metodo-pago-dialog/metodo-pago-dialog.component'; // ajusta ruta según ubicación real
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  declarations: [
    CajaVistaComponent,
    DetallePedidoDialogComponent,
     FiltroPedidoPipe,
     MetodoPagoDialogComponent,
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
        MatRadioModule,

   
  ]
})
export class SalesModuleModule { }
