import { Component } from '@angular/core';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

@Component({
  selector: 'my-app',
  templateUrl: './../views/app.component.html',
})
export class AppComponent {
  name: string = 'Angular';

  model: NgbDateStruct;
  date: { year: number, month: number };

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }
}
