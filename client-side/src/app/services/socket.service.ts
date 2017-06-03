import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as io        from 'socket.io-client';

import { Message }    from '../models/message';

import { EnvironmentService } from './environment.service';

@Injectable()
export class SocketService {
  url = EnvironmentService.getInstance().getSocketUrl();
  channel = 'messages';
  socket: SocketIOClient.Socket;

  constructor() { }

  emit(message: Message): void {
    this.socket.emit(this.channel, message);
  }

  receive(): Observable<Message> {
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
