import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioVistaComponent } from '../inventory-module/inventario-vista/inventario-vista.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
   {
          path: 'dashboard',
          component: DashboardComponent,
    },
      

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardModuleRoutingModule { }
