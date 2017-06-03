import { Injectable }                    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable }  from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { ChatRoom } from '../models/chat-room';

import { EnvironmentService } from './environment.service';

@Injectable()
export class ChatRoomService {
  chatRoomsUrl = `${EnvironmentService.getInstance().getApiUrl()}/chat_rooms`; // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});

  constructor(public http: Http) { }

  getChatRoom(id: number): Promise<ChatRoom> {
    let url = `${this.chatRoomsUrl}/${id}`;

    return this.http.get(url)
                    .toPromise()
                    .then(response => response.json() as ChatRoom)
                    .catch(this.handlePromiseError);
  }

  getChatRooms(): Promise<ChatRoom[]> {
    return this.http.get(this.chatRoomsUrl)
                    .toPromise()
                    .then(res => res.json() as ChatRoom[])
                    .catch(this.handlePromiseError);
  }

  search(title: string): Observable<ChatRoom[]> {
    let url = `${this.chatRoomsUrl}/search?title=${title}`;

    return this.http.get(url)
                    .map(res => res.json() as ChatRoom[] || {})
                    .catch(this.handleObservableError);
  }

  create(chatRoom: ChatRoom): Promise<ChatRoom> {
    let body = JSON.stringify({
                                title: chatRoom.title,
                                created_id: chatRoom.created_id,
                                sender_id: chatRoom.sender_id,
                                recipient_id: chatRoom.recipient_id
                              });
    let options = new RequestOptions({ headers: this.headers });

    return this.http.post(this.chatRoomsUrl, body, options)
                    .toPromise()
                    .then(res => res.json() as ChatRoom)
                    .catch(this.handlePromiseError);
  }

  update(chatRoom: ChatRoom): Promise<ChatRoom> {
    let url = `${this.chatRoomsUrl}/${chatRoom.id}`;
    let body = JSON.stringify({
                                title: chatRoom.title,
                                created_id: chatRoom.created_id,
                                sender_id: chatRoom.sender_id,
                                recipient_id: chatRoom.recipient_id
                              });
    let options = new RequestOptions({ headers: this.headers });

    return this.http.put(url, body, options)
                    .toPromise()
                    .then(() => chatRoom)
                    .catch(this.handlePromiseError);
  }

  delete(chatRoom: ChatRoom): Promise<void> {
    let url = `${this.chatRoomsUrl}/${chatRoom.id}`;
    let options = new RequestOptions({ headers: this.headers });

    return this.http.delete(url, options)
                    .toPromise()
                    .then(() => null)
                    .catch(this.handlePromiseError);
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
