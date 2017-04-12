import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { JsonpModule }    from '@angular/http';

import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';

import { AppComponent }   from './components/app.component';

@NgModule({
  imports:      [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    ReactiveFormsModule,
    JsonpModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
