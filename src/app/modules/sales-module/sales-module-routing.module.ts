import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaVistaComponent } from './caja-vista/caja-vista.component';

const routes: Routes = [
  {
          path: 'caja',
          component: CajaVistaComponent,
        },
      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesModuleRoutingModule { }
