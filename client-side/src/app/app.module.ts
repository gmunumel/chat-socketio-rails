import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms'; // <-- NgModel lives here
import { JsonpModule }    from '@angular/http';

import { AboutComponent }     from './components/about/about.component';
import { AppComponent }       from './components/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent }    from './components/sign-in/sign-in.component';
import { SignUpComponent }    from './components/sign-up/sign-up.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    JsonpModule,
    AppRoutingModule
  ],
  declarations: [
    AboutComponent,
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
