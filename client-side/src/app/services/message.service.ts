import { Injectable }                    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Message } from '../models/message';

import { EnvironmentService } from './environment.service';

@Injectable()
export class MessageService {
  chatRoomsUrl = `${EnvironmentService.getInstance().getApiUrl()}/chat_rooms`; // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  messagesUrl = '';

  constructor(public http: Http) { }

  setUrl(chat_room_id: number) {
    this.messagesUrl = `${this.chatRoomsUrl}/${chat_room_id}/messages`;
  }

  getMessage(id: number): Promise<Message> {
    let url = `${this.messagesUrl}/${id}`;

    return this.http.get(url)
                    .toPromise()
                    .then(response => response.json() as Message)
                    .catch(this.handlePromiseError);
  }

  getMessages(): Promise<Message[]> {
    return this.http.get(this.messagesUrl)
                    .toPromise()
                    .then(res => res.json() as Message[])
                    .catch(this.handlePromiseError);
  }

  search(user_id: number): Promise<Message[]> {
    let url = `${this.messagesUrl}/search?user_id=${user_id}`;

    return this.http.get(url)
                    .toPromise()
                    .then(res => res.json() as Message[])
                    .catch(this.handlePromiseError);
  }

  create(message: Message): Promise<Message> {
    let body = JSON.stringify({
                                body: message.body,
                                user_id: message.user_id,
                                chat_room_id: message.chat_room_id
                              });
    let options = new RequestOptions({ headers: this.headers });

    return this.http.post(this.messagesUrl, body, options)
                    .toPromise()
                    .then(res => res.json() as Message)
                    .catch(this.handlePromiseError);
  }

  update(message: Message): Promise<Message> {
    let url = `${this.messagesUrl}/${message.id}`;
    let body = JSON.stringify({
                                body: message.body,
                                user_id: message.user_id,
                                chat_room_id: message.chat_room_id
                              });
    let options = new RequestOptions({ headers: this.headers });

    return this.http.put(url, body, options)
                    .toPromise()
                    .then(() => message)
                    .catch(this.handlePromiseError);
  }

  delete(message: Message): Promise<void> {
    let url = `${this.messagesUrl}/${message.id}`;
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
}
