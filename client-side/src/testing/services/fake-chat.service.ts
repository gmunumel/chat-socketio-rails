import { Injectable }  from '@angular/core';

import { Observable }  from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';

// re-export for tester convenience
export { ChatService } from '../../app/services/chat.service';

import { ChatService } from '../../app/services/chat.service';
import { Message }     from '../../app/models/message';

// Dummy ChatService. Pretend it emit real data 
@Injectable()
export class FakeChatService implements ChatService {
  url = 'http://localhost:5001';
  channel = 'messages';
  socket: SocketIOClient.Socket;

  constructor() { }

  sendMessage(message: Message): void {
  }

  getMessages(): Observable<Message> {
    return Observable.of(new Message);
  }
}
