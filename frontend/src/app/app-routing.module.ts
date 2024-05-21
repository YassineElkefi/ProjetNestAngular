import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DepensesComponent } from './depenses/depenses.component';
import { authGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CategoryComponent } from './category/category.component';
import { DepenseChartComponent } from './depense-chart/depense-chart.component';

const routes: Routes = [
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'depenses', component: DepensesComponent, canActivate: [authGuard]},
  { path: '', redirectTo: 'depenses', pathMatch: 'full'},
  { path: 'categorie', component: CategoryComponent},
  { path: 'rapport', component: DepenseChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
