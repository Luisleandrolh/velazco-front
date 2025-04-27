import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { WelcomeComponent } from './home/welcome/welcome.component';

const routes: Routes = [

  {
    path: 'home',
    component: PagesComponent,
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
    //canActivate: [SessionGuard]
  },
  {
    path: 'inventario-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./inventory-module/inventory-module.module').then((m) => m.InventoryModuleModule),
    //canActivate: [SessionGuard]
  },

  {
    path: 'sales-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./sales-module/sales-module.module').then((m) => m.SalesModuleModule),
    //canActivate: [SessionGuard]
  },

  {
    path: 'dashboard-module',
    component: PagesComponent,
    loadChildren: () =>
      import('./dashboard-module/dashboard-module.module').then((m) => m.DashboardModuleModule),
    //canActivate: [SessionGuard]
  },

  {
    path: 'orders-modules',
    component: PagesComponent,
    loadChildren: () =>
      import('./orders-module/orders-module-routing.module').then((m) => m.OrdersModuleRoutingModule),
    //canActivate: [SessionGuard]
  },

  

  







  {
    path: 'home',
    component: PagesComponent,
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
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
