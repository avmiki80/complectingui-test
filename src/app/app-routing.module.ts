import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ADMIN_ROLE, USER_ROLE, VIEW_ROLE} from "./app.constant";
import { AccessDeniedComponent } from './auth/page/access-denied/access-denied.component';
import {MainComponent} from "./business/view/page/main/main.component";
import {RolesGuard} from "./business/guard/roles.guard";

const routes: Routes = [
  {path: '', component: MainComponent, canActivate: [RolesGuard],
    data: {
      allowedRoles: [USER_ROLE, ADMIN_ROLE, VIEW_ROLE] // для открытия этой страницы - у пользователя должна быть одна из этих ролей
    }},
  {path: 'index', redirectTo: '', pathMatch: 'full'},
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: '**', redirectTo: '/'}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
