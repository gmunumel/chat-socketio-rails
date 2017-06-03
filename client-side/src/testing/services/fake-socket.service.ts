import { Injectable }  from '@angular/core';

import { Observable }  from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';

// re-export for tester convenience
export { SocketService }      from '../../app/services/socket.service';
export { Message }            from '../../app/models/message';
export { EnvironmentService } from '../../app/services/environment.service';

import { SocketService }      from '../../app/services/socket.service';
import { Message }            from '../../app/models/message';
import { EnvironmentService } from '../../app/services/environment.service';

// Dummy ChatService. Pretend it emit real data 
@Injectable()
export class FakeSocketService implements SocketService {
  url = EnvironmentService.getInstance().getSocketUrl();
  channel = 'messages';
  socket: SocketIOClient.Socket;

  constructor() { }

  emit(message: Message): void {
  }

  receive(): Observable<Message> {
    return Observable.of(new Message);
  }
}
