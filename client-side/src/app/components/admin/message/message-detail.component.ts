import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import {
  FormGroup, FormBuilder, Validators
}                                       from '@angular/forms';

import { Subscription }   from 'rxjs/Subscription';

import { Message }        from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: [ './resources/css/message-detail.component.css' ],
  providers: [ SessionService ]
})
export class MessageDetailComponent implements OnInit, OnDestroy {
  page: string = 'Admin Message Detail';
  response: number = 0;
  chatRoomId: number = -1;
  messageDetailForm: FormGroup;
  private paramsSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) {

    this.messageDetailForm = this.fb.group({
      id: [-1],
      body: ['', Validators.required],
      user_id: [1],       // default user id
      chat_room_id: [1]   // default chat room id
    });
  }

  ngOnInit(): void {
    if (!SessionService.getInstance().isLoggedIn()) {
      this.router.navigate(['signin']);
    }

    this.paramsSubscription = this.route.params
      .subscribe(p => this.getMessage(+p['id'], +p['chat_room_id']));
  }

  update(): void {
    let message = new Message();
    Object.assign(message, this.messageDetailForm.value);

    this.messageService.setUrl(this.chatRoomId);
    this.messageService.update(message)
      .then(() => {
        this.response = 1;  // It will be lost
        this.goBack();
      })
      .catch((error: any) => {
        this.response = -1;
      });
  }

  delete(): void {
    let message = new Message();
    Object.assign(message, this.messageDetailForm.value);

    this.messageService.setUrl(this.chatRoomId);
    this.messageService.delete(message)
      .then(() => {
        this.response = 1;  // It will be lost
        this.goBack();
      })
      .catch(() => {
        this.response = -1;
      });
  }

  goBack(): void {
    this.router.navigate([`/admin/chat-room/${this.chatRoomId}/message`]);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.paramsSubscription.unsubscribe();
  }

  private getMessage(messageId: number, chatRoomId: number): void {
    if (chatRoomId === -1) {
      this.goBack();
    }
    this.chatRoomId = chatRoomId;
    this.messageService.setUrl(this.chatRoomId);
    this.messageService.getMessage(messageId)
      .then(message => {
        message ? this.messageDetailForm.patchValue(message) : this.goBack();
      })
      .catch(() => {
        this.goBack();
      });
  }
}
