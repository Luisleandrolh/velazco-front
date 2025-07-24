import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsersModuleRoutingModule } from './users-module-routing.module';
import { UsersComponent } from './users/users.component';
import { GetRoleNamePipe } from './pipe/get-role-name.pipe';

@NgModule({
  declarations: [UsersComponent, GetRoleNamePipe],
  imports: [
    CommonModule,
    FormsModule,
    UsersModuleRoutingModule,
    HttpClientModule,
  ],
})
export class UsersModuleModule {}
