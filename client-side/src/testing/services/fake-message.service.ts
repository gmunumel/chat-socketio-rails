import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

// re-export for tester convenience
export { Message }        from '../../app/models/message';
export { MessageService } from '../../app/services/message.service';

import { Message }        from '../../app/models/message';
import { MessageService } from '../../app/services/message.service';

export var MESSAGES: Message[] = [
  new Message(0, 'First Message', 1, 1),
  new Message(1, 'Second Message', 1, 1),
  new Message(2, 'Test 1', 1, 2),
  new Message(3, 'Test 2', 1, 2),
  new Message(4, 'Long Message', 1, 3),
  new Message(5, 'Very Long Message', 1, 3)
];

// Dummy MessageService. Pretend it makes real http requests 
@Injectable()
export class FakeMessageService implements MessageService {
  messagesUrl = '';
  chatRoomsUrl = 'http://localhost:3000/chat_rooms';  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  lastPromise: Promise<any>;  // remember so we can spy on promise calls

  messages = MESSAGES.map(m => m.clone());

  constructor(public http: Http) { }

  setUrl(chat_room_id: number) {
    this.messagesUrl = `${this.chatRoomsUrl}/${chat_room_id}/messages`;
  }

  getMessage(id: number): Promise<Message> {
    let messageFound = this.messages.find(m => m.id === id);
    return this.lastPromise = Promise.resolve(messageFound);
  }

  getMessages(): Promise<Message[]> {
    return this.lastPromise = Promise.resolve(this.messages);
  }

  create(message: Message): Promise<Message> {
    this.messages.push(message);
    return this.lastPromise = Promise.resolve(message);
  }

  update(message: Message): Promise<Message> {
    return this.lastPromise = this.getMessage(message.id).then(m => {
      return m ?
        Object.assign(m, message) :
        Promise.reject(`Message ${message.id} not found`) as any as Promise<Message>;
    });
  }

  delete(message: Message): Promise<void> {
    return this.lastPromise = this.getMessage(message.id).then(m => {
      return m ?
        Promise.resolve<void>(null) :
        Promise.reject(`Message ${message.id} not found`) as any as Promise<void>;
    });
  }

  handlePromiseError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
