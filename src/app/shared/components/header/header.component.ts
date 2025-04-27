import { Component, OnInit, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

@Injectable({
  providedIn: 'root',
})

export class HeaderComponent implements OnInit {
  public currentLang: string = "es";
  
  constructor(
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
