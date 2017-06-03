import { Message } from './message';
import { User }    from './user';

export class ChatMessage {
  constructor(
    public message: Message = null,
    public user: User = null) { }
}
