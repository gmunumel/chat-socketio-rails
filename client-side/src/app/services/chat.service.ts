import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as io        from 'socket.io-client';

import { Message }    from '../models/message';

@Injectable()
export class ChatService {
  url = 'http://localhost:5001';
  channel = 'messages';
  socket: SocketIOClient.Socket;

  constructor() { }

  sendMessage(message: Message): void {
    this.socket.emit(this.channel, message);
  }

  getMessages(): Observable<Message> {
    let observable = new Observable((observer: any) => {
      this.socket = io(this.url);
      this.socket.on(this.channel, (message: Message) => {
        observer.next(message);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
};
