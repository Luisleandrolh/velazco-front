import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduccionComponent } from './produccion/produccion.component';

const routes: Routes = [
  {
        path: 'produccion',
        component: ProduccionComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionModuleRoutingModule { }
