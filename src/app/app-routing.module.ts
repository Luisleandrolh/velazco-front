import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageUnauthorizedComponent } from './core/components/page-unauthorized/page-unauthorized.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { PagesComponent } from './modules/pages.component';
import { PagesRoutingModule } from './modules/pages-routing.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import(`./modules/home/home.module`).then((m) => m.HomeModule),
  },
  {
    path: '',
    component: PagesComponent,
    loadChildren: () =>
      import('./modules/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'unauthorized',
    component: PageUnauthorizedComponent,
  },
  {
    path: '**',
    redirectTo: '/home/welcome',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    PagesRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
