import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      this.loginService.login(email, password).subscribe({
        next: () => {
          this.loading = false;
          // Redirige a '/pages/home/welcome' tras login exitoso
          this.router.navigate(['/pages/home/welcome']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
          console.error('Error en el login:', error);
        }
      });
    }
  }
}