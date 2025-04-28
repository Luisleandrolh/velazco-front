import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioVistaComponent } from './inventario-vista/inventario-vista.component';

const routes: Routes = [
  {
    path: 'inventario',
    component: InventarioVistaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryModuleRoutingModule { }