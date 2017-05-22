import {
  Component, OnInit, OnDestroy,
}                                 from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  chatRoomId: number = -1;
  user: User;
  messages: Message[];
  private subscription: Subscription;
  private subscriptionParams: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscriptionParams = this.route.params
      .subscribe(p => this.getMessage(+p['chat_room_id']));

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
    this.chatRoomId = chatRoomId;
    this.getMessage(this.chatRoomId);
  }

  gotoDetail(message: Message): void {
    this.router.navigate([`admin/chat-room/${this.chatRoomId}/message/detail/${message.id}`]);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
    this.subscriptionParams.unsubscribe();
  }

  private getMessage(chatRoomId: number) {
    // in case we haven't selected a chat room
    if (chatRoomId === -1) {
      return;
    }

    this.chatRoomId = chatRoomId;
    this.messageService.setUrl(this.chatRoomId);
    this.messageService.getMessages()
      .then((messages: Message[]) => {
        this.response = 1;
        this.messages = messages;
      })
      .catch(() => {
        this.response = -1;
      });
  }
}
