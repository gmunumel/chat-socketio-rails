import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }  from './components/dashboard/dashboard.component';
import { SignInComponent }     from './components/sign-in/sign-in.component';
import { SignUpComponent }     from './components/sign-up/sign-up.component';
import { AboutComponent }      from './components/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'signin',  component: SignInComponent },
  { path: 'signup',  component: SignUpComponent },
  { path: 'about',  component: AboutComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
