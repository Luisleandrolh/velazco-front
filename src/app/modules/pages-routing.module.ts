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
