import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import { FormGroup, FormBuilder }       from '@angular/forms';

import { Subscription }   from 'rxjs/Subscription';

import { User }           from '../../../models/user';
import { Message }        from '../../../models/message';

import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { ChatService }    from '../../../services/chat.service';

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
  messageForm: FormGroup;
  private subscriptionSession: Subscription;
  private subscriptionParams: Subscription;
  private subscriptionChat: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private chatService: ChatService) {

    this.messageForm = this.fb.group({
      id: [-1],
      body: [''],
      user_id: [1],       // default user id
      chat_room_id: [1]   // default chat room id
    });

    this.subscriptionChat = this.chatService.getMessages()
      .subscribe((message: any) => {
        console.log('got message: ' + message);
      });
  }

  ngOnInit(): void {
    this.subscriptionParams = this.route.params
      .subscribe(p => this.getMessage(+p['chat_room_id']));

    this.subscriptionSession = SessionService.getInstance().collection$
      .subscribe((latestCollection: any) => {
        this.user = new User;
        this.user.id = latestCollection[0];
        this.user.name = latestCollection[1];
        this.user.email = latestCollection[2];
    });

    SessionService.getInstance().load();
  }

  save(): void {
    if (this.messageForm.value.body === '' || this.chatRoomId === -1) {
      return;
    }

    let message = new Message();
    message.body = this.messageForm.value.body;
    message.chat_room_id = this.chatRoomId;
    message.user_id = this.user.id;

    this.messageService.setUrl(this.chatRoomId);
    this.messageService.create(message)
      .then((msg: Message) => {
        this.response = 1;
        this.messages.push(msg);
        this.messageForm.reset();
      })
      .catch((error: any) => {
        this.response = -1;
      });
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
    this.subscriptionSession.unsubscribe();
    this.subscriptionParams.unsubscribe();
    this.subscriptionChat.unsubscribe();
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
