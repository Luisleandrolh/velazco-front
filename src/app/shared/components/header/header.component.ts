import { Component, OnInit, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../../app/core/auth/service/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  
  constructor(
    public translate: TranslateService,
    public loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}