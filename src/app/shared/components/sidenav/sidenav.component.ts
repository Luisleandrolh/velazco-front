import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoginService } from '../../../../app/core/auth/service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  isMobile = true;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  userProfile: any; // Almacena el perfil del usuario

  constructor(
    private observer: BreakpointObserver, 
    public loginService: LoginService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUserProfile();
  }

  private checkScreenSize(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
    });
  }

  private loadUserProfile(): void {
    this.loginService.getprofile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        console.log('Perfil del usuario:', profile);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  toggleMenu(): void {
    this.sidenav.toggle();
  }

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