import { Component, OnInit }        from '@angular/core';
import { Router }                   from '@angular/router';
import {
  FormGroup, FormBuilder, Validators
}                                   from '@angular/forms';
import { ActivatedRoute }           from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ChatRoom }        from '../../../models/chat-room';
import { ChatRoomService } from '../../../services/chat-room.service';

@Component({
  selector: 'admin-chat-room-detail',
  templateUrl: './chat-room-detail.component.html'
})
export class ChatRoomDetailComponent implements OnInit {
  page: string = 'Admin Chat Room Detail';
  response: number = 0;
  chatRoomDetailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute,
    private router: Router) {

    this.chatRoomDetailForm = this.fb.group({
      id: [-1],
      title: ['', Validators.required],
      created_id: [1],   // default created id
      sender_id: [1],    // default sender id
      recipient_id: [1], // default recipient id
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => this.getChatRoom(+p['id']));
  }

  save(): void {
    let chatRoom = new ChatRoom();
    Object.assign(chatRoom, this.chatRoomDetailForm.value);

    this.saveOrUpdate(chatRoom);
  }

  goBack(): void {
    this.router.navigate(['/admin/chat-room']);
  }

  private getChatRoom(id: number): void {
    // when id===-1, create new chat room
    if (id === -1) {
      return;
    }

    this.chatRoomService.getChatRoom(id)
      .then(chatRoom => {
        this.chatRoomDetailForm.patchValue(chatRoom);
      })
      .catch(() => {
        this.goBack();
      });
  }

  private saveOrUpdate(chatRoom: ChatRoom) {
    if (chatRoom.id === -1) {
      this.chatRoomService.create(chatRoom)
        .then(() => {
          this.response = 1; // It will be lost
          this.goBack();
        })
        .catch((error: any) => {
          return (error.status === 409) ? this.response = -2 : this.response = -1;
        });
    } else {
        this.chatRoomService.update(chatRoom)
          .then(() => {
            this.response = 1; // It will be lost
            this.goBack();
          })
          .catch((error: any) => {
            return (error.status === 409) ? this.response = -2 : this.response = -1;
          });
    }
  }
}
