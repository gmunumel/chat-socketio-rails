import {
  Component, OnInit, OnDestroy, NgZone, AfterViewChecked, ElementRef, ViewChild
}                                       from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import { FormGroup, FormBuilder }       from '@angular/forms';

import { Subscription }   from 'rxjs/Subscription';

import { User }           from '../../../models/user';
import { Message }        from '../../../models/message';
import { ChatMessage }    from '../../../models/chat-message';

import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { SocketService }  from '../../../services/socket.service';
import { UserService }    from '../../../services/user.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: [ './resources/css/message.component.css' ],
  providers: [ SessionService ]
})
export class MessageComponent implements OnInit, AfterViewChecked, OnDestroy {
  page: string = 'Admin Message';
  response: number = 0;
  chatRoomId: number = -1;
  user: User;
  users: User[];
  messages: ChatMessage[];
  messageForm: FormGroup;
  private sessionSubscription: Subscription;
  private paramsSubscription: Subscription;
  private chatSubscription: Subscription;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private socketService: SocketService,
    private userService: UserService,
    private ngZone: NgZone) {

    this.messageForm = this.fb.group({
      id: [-1],
      body: [''],
      user_id: [1],       // default user id
      chat_room_id: [1]   // default chat room id
    });
  }

  ngOnInit(): void {
    if (!SessionService.getInstance().isLoggedIn()) {
      this.router.navigate(['signin']);
    }

    this.getUsers();

    this.paramsSubscription = this.route.params
      .subscribe(p => this.getMessage(+p['chat_room_id']));

    this.loadSession();

    this.syncMessages();

    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
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
        this.messages.push(new ChatMessage(msg, this.user));
        this.messageForm.reset();
        this.socketService.emit(msg);  // emit message to node server
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
    this.sessionSubscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
  }

  private getMessage(chatRoomId: number): void {
    // in case we haven't selected a chat room
    if (chatRoomId === -1) {
      return;
    }

    this.messages = [];
    this.chatRoomId = chatRoomId;
    this.messageService.setUrl(this.chatRoomId);
    this.messageService.getMessages()
      .then((messages: Message[]) => {
        this.response = 1;
        this.mergeMessagesAndUsers(messages, this.users);
      })
      .catch(() => {
        this.response = -1;
      });
  }

  private getUsers(): void {
    this.userService.getUsers()
      .then((users: User[]) => {
        this.users = users;
      })
      .catch(() => {
        this.response = -1;
      });
  }

  private loadSession(): void {
    this.sessionSubscription = SessionService.getInstance().collection$
      .subscribe((latestCollection: any) => {
        this.user = new User;
        this.user.id = latestCollection[0];
        this.user.name = latestCollection[1];
        this.user.email = latestCollection[2];
    });

    SessionService.getInstance().load();
  }

  private syncMessages(): void {
    this.ngZone.runOutsideAngular(() => {
      this.chatSubscription = this.socketService.receive()
        .subscribe((message: Message) => {
          // Come back into Angular zone when there is a callback from the Observable
          this.ngZone.run(() => {
            if (message.chat_room_id === this.chatRoomId
                && message.user_id != this.user.id) {
              let foundUser = this.users.find((user: User) => { return user.id === message.user_id; });
              this.messages.push(new ChatMessage(message, foundUser));
            }
          });
        });
    });
  }

  private scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      this.response = -1;
    }
  }

  private mergeMessagesAndUsers(messages: Message[], users: User[]): void {
    messages.forEach((message: Message) => {
      let foundUser = users.find((user: User) => { return user.id === message.user_id; });
      this.messages.push(new ChatMessage(message, foundUser));
    });
  }

}
