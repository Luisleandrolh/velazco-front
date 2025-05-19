import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

import { ProductionModuleRoutingModule } from './production-module-routing.module';
import { ProduccionComponent } from './produccion/produccion.component';


@NgModule({
  declarations: [
    ProduccionComponent
  ],
  imports: [
    CommonModule,
    ProductionModuleRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule
  ]
})
export class ProductionModuleModule { }
