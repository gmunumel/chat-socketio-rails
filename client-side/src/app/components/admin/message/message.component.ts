import {
  Component, OnInit, OnDestroy,
}                                from '@angular/core';
import { Router }                from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { User }           from '../../../models/user';
import { Message }        from '../../../models/message';

import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: [ './resources/css/message.component.css' ],
  providers: [ SessionService ]
})
export class MessageComponent implements OnInit, OnDestroy {
  page: string = 'Admin Message';
  response: number = 0;
  user: User;
  messages: Message[];
  private subscription: Subscription;

  constructor(
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = SessionService.getInstance().collection$
      .subscribe((latestCollection: any) => {
        this.user = new User;
        this.user.id = latestCollection[0];
        this.user.name = latestCollection[1];
        this.user.email = latestCollection[2];
    });

    SessionService.getInstance().load();
  }

  showMessage(chatRoomId: number): void {
    this.messageService.setUrl(chatRoomId);
    this.messageService.getMessages()
      .then((messages: Message[]) => {
        this.response = 1;
        this.messages = messages;
      })
      .catch(() => {
        this.response = -1;
      });
  }

  gotoDetail(message: Message): void {
    this.router.navigate(['/admin/message/detail', message.id]);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
