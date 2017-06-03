import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable }    from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';

// re-export for tester convenience
export { ChatRoom }           from '../../app/models/chat-room';
export { ChatRoomService }    from '../../app/services/chat-room.service';
export { EnvironmentService } from '../../app/services/environment.service';

import { ChatRoom }           from '../../app/models/chat-room';
import { ChatRoomService }    from '../../app/services/chat-room.service';
import { EnvironmentService } from '../../app/services/environment.service';

export var CHATROOMS: ChatRoom[] = [
  new ChatRoom(0, 'Music', 1),
  new ChatRoom(1, 'Programming', 1),
  new ChatRoom(2, 'Television', 1),
  new ChatRoom(3, 'Movies', 1),
  new ChatRoom(4, 'Sex', 1),
  new ChatRoom(5, 'Random', 1)
];

// Dummy ChatRoomService. Pretend it makes real http requests 
@Injectable()
export class FakeChatRoomService implements ChatRoomService {
  chatRoomsUrl = `${EnvironmentService.getInstance().getApiUrl()}/chat_rooms`;  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  lastPromise: Promise<any>;  // remember so we can spy on promise calls
  lastObservable: Observable<any>;

  chatRooms = CHATROOMS.map(cr => cr.clone());

  constructor(public http: Http) { }

  getChatRoom(id: number): Promise<ChatRoom> {
    let userFound = this.chatRooms.find(cr => cr.id === id);
    return this.lastPromise = Promise.resolve(userFound);
  }

  getChatRooms(): Promise<ChatRoom[]> {
    return this.lastPromise = Promise.resolve(this.chatRooms);
  }

  search(title: string): Observable<ChatRoom[]> {
    let chatRoomFound = null;
    chatRoomFound = (title === '') ? this.chatRooms : this.chatRooms.find(cr => cr.title === title);
    this.lastObservable = (chatRoomFound) ? Observable.of(chatRoomFound as ChatRoom[]) : Observable.of(null);
    return this.lastObservable;
  }

  fetch(chatRoom: ChatRoom): Promise<ChatRoom> {
    let chatRoomFound = this.chatRooms.find(cr => cr.title === chatRoom.title);
    return this.lastPromise = Promise.resolve(chatRoomFound);
  }

  create(chatRoom: ChatRoom): Promise<ChatRoom> {
    return this.search(chatRoom.title).toPromise().then(cr => {
      if (cr) {
        return Promise.reject({ status: 409 }) as any as Promise<ChatRoom>;
      } else {
        this.chatRooms.push(chatRoom);
        return this.lastPromise = Promise.resolve(chatRoom);
      }
    });
  }

  update(chatRoom: ChatRoom): Promise<ChatRoom> {
    return this.lastPromise = this.getChatRoom(chatRoom.id).then(cr => {
      return cr ?
        Object.assign(cr, chatRoom) :
        Promise.reject(`ChatRoom ${chatRoom.id} not found`) as any as Promise<ChatRoom>;
    });
  }

  delete(chatRoom: ChatRoom): Promise<void> {
    return this.lastPromise = this.getChatRoom(chatRoom.id).then(cr => {
      return cr ?
        Promise.resolve<void>(null) :
        Promise.reject(`ChatRoom ${chatRoom.id} not found`) as any as Promise<void>;
    });
  }

  handlePromiseError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  handleObservableError(error: any): Observable<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
  }
}
