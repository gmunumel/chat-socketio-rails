import {
  Component, OnInit, AfterViewInit, Input, Output, EventEmitter
}                            from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ChatRoom }        from '../../../models/chat-room';
import { ChatRoomService } from '../../../services/chat-room.service';

@Component({
  selector: 'chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: [ '../../../app/css/styles.css' ]
})
export class ChatRoomComponent implements OnInit, AfterViewInit {
  page: string = 'Admin Chat Room';
  response: number = 0;
  chatRooms: Observable<ChatRoom[]>;

  @Input() messageVersionInput: boolean = false;
  @Output() getChatRoomId: EventEmitter<number> = new EventEmitter();

  private searchTerms = new Subject<string>();
  private deleteSubject = new Subject();

  constructor(
    private router: Router,
    private chatRoomService: ChatRoomService) { }

  ngOnInit(): void {
    this.setChatRooms();
  }

  ngAfterViewInit(): void {
    this.searchTerms.next('');
  }

  gotoDetail(chatRoom: ChatRoom): void {
    if (this.messageVersionInput) {
      this.getChatRoomId.emit(chatRoom.id);
    } else {
      this.router.navigate(['/admin/chat-room/detail', chatRoom.id]);
    }
  }

  add(): void {
    this.router.navigate(['/admin/chat-room/detail', -1]);
  }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  delete(chatRoom: ChatRoom): void {
    this.chatRoomService
        .delete(chatRoom)
        .then(() => {
          this.response = 1;
          this.deleteSubject.next({op: 'delete', id: chatRoom.id});
        })
        .catch(() => {
          this.response = -1;
        });
  }

  private setChatRooms(): void {
    this.chatRooms = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.chatRoomService.search(term)
        // or the observable of all chat rooms if there was no search term
        : this.chatRoomService.search(''))
      .catch(() => {
        this.response = -1;
        return Observable.of<ChatRoom[]>([]);
      });
    this.chatRooms = this.chatRooms.merge(this.deleteSubject)
      .startWith([])
      .scan((acc: any, val: any) => {
        if (val.op && val.op === 'delete') {
          let index = acc.findIndex((elt: any) => elt.id === val.id);
          acc.splice(index, 1);
          return acc;
        } else {
          return val;
        }
      });
  }
}
