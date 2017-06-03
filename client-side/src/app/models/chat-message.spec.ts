import { ChatMessage } from './chat-message';
import { Message }     from './message';
import { User }        from './user';

describe('Chat Message', () => {
  it('has message', () => {
    const message = new Message(0, '', 1, 1);
    const chatMessage = new ChatMessage(message);
    expect(chatMessage.message).not.toBe(null);
    expect(chatMessage.user).toBe(null);
  });

  it('has user', () => {
    const user = new User(0, 'Super Cat', '');
    const chatMessage = new ChatMessage(null, user);
    expect(chatMessage.user).not.toBe(null);
    expect(chatMessage.message).toBe(null);
  });
});
