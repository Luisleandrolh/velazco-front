import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosVistaComponent } from './pedidos-vista/pedidos-vista.component';

const routes: Routes = [ //arreglo de rutas
    {
          path: 'pedidos',
          component: PedidosVistaComponent,
        },
      
];

@NgModule({ //submodulo de rutas
  imports: [RouterModule.forChild(routes)], //indica las rutas hijas del modulo
  exports: [RouterModule]
})
export class OrdersModuleRoutingModule { }
