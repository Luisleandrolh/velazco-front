import { Component, HostListener, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/core/auth/service/login.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css'],
})
export class UsernavComponent {
toggleMenu() {
throw new Error('Method not implemented.');
}
showMenu: any;
navigateTo(arg0: string) {
throw new Error('Method not implemented.');
}
@Input() userProfile: any; 
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}