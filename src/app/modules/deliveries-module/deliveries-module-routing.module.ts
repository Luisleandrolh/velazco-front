import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntregasVistaComponent } from './entregas-vista/entregas-vista.component';

const routes: Routes = [
  {
      path: 'entregas',
      component: EntregasVistaComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveriesModuleRoutingModule { }
