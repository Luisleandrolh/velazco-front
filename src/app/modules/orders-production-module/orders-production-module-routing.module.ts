import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionComponent  } from './ordenesproduccion/ordenesproduccion.component';

const routes: Routes = [
  {
        path: 'ordenesproduccion',
        component:ProductionComponent ,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersProductionModuleRoutingModule { }
