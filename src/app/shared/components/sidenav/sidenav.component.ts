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
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  user: string = 'prueba'
  userProfile: any;


  constructor(
    private observer: BreakpointObserver, public loginService: LoginService, private router: Router
  ) { }

  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

    this.loginService.getprofile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        console.log('Perfil del usuario:', profile);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }


toggleMenu() {
  //if(this.isMobile){
  this.sidenav.toggle();
  //} else {
  // do nothing for now
  //}
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
