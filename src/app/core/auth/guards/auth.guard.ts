import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from '../service/login.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}
  canActivateChild(route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot):Observable<boolean>{
    return this.validar(route);
  }

  canActivate( route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> {
  return this.validar(route);

  }


validar(route: ActivatedRouteSnapshot): Observable<boolean> {
  const routeRoleMap: { [path: string]: string[] } = {
    'dashboard-module': ['Administrador'],
    'deliveries-module': ['Administrador', 'Despachador'],
    'home': ['Administrador', 'Vendedor', 'Cajero', 'Despachador', 'Producción'],
    'inventario-module': ['Administrador'],
    'orders-module': ['Administrador', 'Vendedor'],
    'orders-production-module': ['Administrador', 'Producción'],
    'production-module': ['Administrador', 'Producción'],
    'sales-module': ['Administrador', 'Cajero'],
    'users-module': ['Administrador']
  };

  return this.loginService.getprofile().pipe(
    map(profile => {
      if (profile) {
        const userRole = profile.role;

        // ✅ Buscar la primera ruta con path válido distinto de 'pages'
        const urlSegment = route.pathFromRoot
          .map(r => r.routeConfig?.path)
          .find(path => path && path !== 'pages') ?? '';

        const allowedRoles = routeRoleMap[urlSegment] || [];

        console.log('Ruta a navegar:', urlSegment);
        console.log('Rol del usuario:', userRole);
        console.log('Roles permitidos:', allowedRoles);

        if (allowedRoles.includes(userRole)) {
          return true; // ✅ Acceso permitido
        } else {
          console.warn('⛔ Acceso denegado al módulo:', urlSegment);
          this.router.navigate(['/home']); // Redirige a /home como ruta segura
          return false;
        }
      } else {
        this.router.navigate(['/login']); // ❌ No logueado
        return false;
      }
    }),
    catchError(() => {
      this.router.navigate(['/login']); // ❌ Error de sesión
      return of(false);
    })
  );
}


}