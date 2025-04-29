import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { SalesModuleRoutingModule } from './sales-module-routing.module';
import { CajaVistaComponent } from './caja-vista/caja-vista.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CajaVistaComponent
  ],
  imports: [
    CommonModule,
    SalesModuleRoutingModule,
    FormsModule,
    NgIf
   
  ]
})
export class SalesModuleModule { }
