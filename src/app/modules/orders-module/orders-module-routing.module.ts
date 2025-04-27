import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosVistaComponent } from './pedidos-vista/pedidos-vista.component';

const routes: Routes = [
    {
          path: 'pedidos',
          component: PedidosVistaComponent,
        },
      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersModuleRoutingModule { }
