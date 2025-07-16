import { Component } from '@angular/core';
import { LoginService } from 'src/app/core/auth/service/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  constructor(private loginService:LoginService){
  
  }
  userProfile:any

  ngOnInit(): void {
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
}