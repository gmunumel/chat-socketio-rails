import { Component } from '@angular/core';

import { Message }        from '../../../models/message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: [ './../../dashboard/dashboard.component.css' ]
})
export class MessageComponent {
  page: string = 'Admin Message';
  response: number = 0;
  messages: Message[];

  constructor(
    private messageService: MessageService) { }

  showMessage(chatRoomId: number) {
    this.messageService.setUrl(chatRoomId);
    this.messageService
        .getMessages()
        .then((messages: Message[]) => {
          this.response = 1;
          this.messages = messages;
        })
        .catch(() => {
          this.response = -1;
        });
  }
}
