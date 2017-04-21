import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { AboutComponent }     from './components/about/about.component';
import { AppComponent }       from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent }    from './components/sign-in/sign-in.component';
import { SignUpComponent }    from './components/sign-up/sign-up.component';
import { UserService }        from './services/user.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AboutComponent,
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
  ],
  providers: [ UserService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
