import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

// re-export for tester convenience
export { Message }            from '../../app/models/message';
export { MessageService }     from '../../app/services/message.service';
export { EnvironmentService } from '../../app/services/environment.service';

import { Message }            from '../../app/models/message';
import { MessageService }     from '../../app/services/message.service';
import { EnvironmentService } from '../../app/services/environment.service';

import { ChatRoom }           from '../../app/models/chat-room';
import { CHATROOMS }          from '../../testing/services/fake-chat-room.service';

export var MESSAGES: Message[] = [
  new Message(0, 'First Message', 1, 0),
  new Message(1, 'Second Message', 1, 0),
  new Message(2, 'Test 1', 1, 0),
  new Message(3, 'Test 2', 1, 0),
  new Message(4, 'Long Message', 1, 0),
  new Message(5, 'Very Long Message', 1, 0)
];

// Dummy MessageService. Pretend it makes real http requests 
@Injectable()
export class FakeMessageService implements MessageService {
  chatRoomId = -1;
  messagesUrl = '';
  chatRoomsUrl = `${EnvironmentService.getInstance().getApiUrl()}/chat_rooms`;  // URL to web api
  headers = new Headers({'Content-Type': 'application/json'});
  lastPromise: Promise<any>;  // remember so we can spy on promise calls

  messages  = MESSAGES.map((m: any) => m.clone());
  chatRooms = CHATROOMS.map((cr: any) => cr.clone());

  constructor(public http: Http) { }

  setUrl(chat_room_id: number) {
    this.messagesUrl = `${this.chatRoomsUrl}/${chat_room_id}/messages`;
    this.chatRoomId = chat_room_id;
  }

  getMessage(id: number): Promise<Message> {
    if (!this.isValidChatRoom(this.chatRoomId)) {
      return this.lastPromise =
        Promise.reject(`Chat Room ${this.chatRoomId} not found`) as any as Promise<Message>;
    }
    let messageFound = this.messages.find(m => m.id === id
                                          && m.chat_room_id === this.chatRoomId);
    return this.lastPromise = Promise.resolve(messageFound);
  }

  getMessages(): Promise<Message[]> {
    if (!this.isValidChatRoom(this.chatRoomId)) {
      return this.lastPromise =
        Promise.reject(`Chat Room ${this.chatRoomId} not found`) as any as Promise<Message[]>;
    }
    let messagesFound = this.messages.filter(m => m.chat_room_id === this.chatRoomId);
    return this.lastPromise = Promise.resolve(messagesFound);
  }

  search(user_id: number): Promise<Message[]> {
    let messagesFound = this.messages.filter(m => m.user_id === user_id
                                            && m.chat_room_id === this.chatRoomId);
    return this.lastPromise = Promise.resolve(messagesFound);
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

  private isValidChatRoom(chatRoomId: number): boolean {
    let chatRoomFound = this.chatRooms.find((cr: ChatRoom) => cr.id === chatRoomId);
    return chatRoomFound ? true : false;
  }
}
