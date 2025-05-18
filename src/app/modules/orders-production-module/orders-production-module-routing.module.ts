import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenesproduccionComponent } from './ordenesproduccion/ordenesproduccion.component';

const routes: Routes = [
  {
        path: 'ordenesproduccion',
        component:OrdenesproduccionComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersProductionModuleRoutingModule { }
