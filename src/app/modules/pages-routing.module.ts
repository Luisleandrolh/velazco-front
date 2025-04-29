import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { WelcomeComponent } from './home/welcome/welcome.component';

const routes: Routes = [

  {
    //dashboard
    path: 'dashboard-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./dashboard-module/dashboard-module.module').then((m) => m.DashboardModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    //entregas
    path: 'deliveries-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./deliveries-module/deliveries-module.module').then((m) => m.DeliveriesModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    //inicio
    path: 'home',
    component: PagesComponent,
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
    //canActivate: [SessionGuard]
  },


  {
    //inventario
    path: 'inventario-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./inventory-module/inventory-module.module').then((m) => m.InventoryModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    //pedidos en tienda
    path: 'orders-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./orders-module/orders-module.module').then((m) => m.OrdersModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    //ordenes de produccion
    path: 'orders-production-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./orders-production-module/orders-production-module.module').then((m) => m.OrdersProductionModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    // produccion
    path: 'production-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./production-module/production-module.module').then((m) => m.ProductionModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    //caja
    path: 'sales-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./sales-module/sales-module.module').then((m) => m.SalesModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    //usuarios y roles
    path: 'users-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./users-module/users-module.module').then((m) => m.UsersModuleModule),
    //canActivate: [SessionGuard]
  },


  {
    path: '**',
    redirectTo: '/home/welcome'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
