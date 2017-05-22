import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }                       from '@angular/router';
import {
  FormGroup, FormBuilder, Validators
}                                       from '@angular/forms';
import { ActivatedRoute }               from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { Message }        from '../../../models/message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: [ './resources/css/message-detail.component.css' ]
})
export class MessageDetailComponent implements OnInit, OnDestroy {
  page: string = 'Admin Message Detail';
  response: number = 0;
  messageDetailForm: FormGroup;
  private subscriptionParams: Subscription;

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
    this.subscriptionParams = this.route.params
      .subscribe(p => this.getMessage(+p['id']));
  }

  update(): void {
    let message = new Message();
    Object.assign(message, this.messageDetailForm.value);

    this.messageService.setUrl(message.chat_room_id);
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

    this.messageService.setUrl(message.chat_room_id);
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
    this.router.navigate(['/admin/message']);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscriptionParams.unsubscribe();
  }

  private getMessage(id: number): void {
    this.messageService.setUrl(this.messageDetailForm.value.chat_room_id);
    this.messageService.getMessage(id)
      .then(message => {
        this.messageDetailForm.patchValue(message);
      })
      .catch(() => {
        this.goBack();
      });
  }
}
