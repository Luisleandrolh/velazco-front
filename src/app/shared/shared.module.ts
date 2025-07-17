import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UsernavComponent } from './components/usernav/usernav/usernav.component';
import { MatMenuModule } from '@angular/material/menu'; // Añadido
import { MatDividerModule } from '@angular/material/divider'; // Añadido

@NgModule({
  declarations: [
    HeaderComponent, 
    SidenavComponent, 
    UsernavComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule, // Añadido
    MatDividerModule, // Añadido
    RouterModule,
    TranslateModule,
  ],
  exports: [
    HeaderComponent, 
    SidenavComponent,
    UsernavComponent, // Añadido para poder usarlo en otros módulos
    // Exporta módulos de Angular Material que necesites compartir
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ],
})
export class SharedModule {}