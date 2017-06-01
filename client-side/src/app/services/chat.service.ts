import { Observable } from 'rxjs/Observable';
import * as io        from 'socket.io-client';

import { Message }    from '../models/message';

export class ChatService {
  private url = 'http://localhost:5001';
  private channel = 'messages';
  private socket: any;

  sendMessage(message: Message) {
    this.socket.emit(this.channel, message);
  }

  getMessages() {
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
