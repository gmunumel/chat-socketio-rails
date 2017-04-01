import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  message: string;
  constructor( public http: Http){
    this.http.get('http://localhost:3000/users')
      .subscribe(
        data => this.message = data.json()[0].name,
        err => console.log(err)
      );
  }
}
