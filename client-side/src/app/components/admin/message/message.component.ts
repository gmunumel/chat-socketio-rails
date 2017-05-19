import { Component } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: [ './../../dashboard/dashboard.component.css' ]
})
export class MessageComponent {
  page: string = 'Admin Message';
  messages: string = '';

  showMessage(message: string) {
    this.messages = message;
  }
}
