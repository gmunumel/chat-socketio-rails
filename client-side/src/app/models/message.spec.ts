import { Message } from './message';

describe('Message', () => {
  it('has id', () => {
    const message = new Message(0, '', 1, 1);
    expect(message.id).toBe(0);
  });

  it('has body', () => {
    const message = new Message(0, 'Long Body', 1, 1);
    expect(message.body).toBe('Long Body');
  });

  it('has user id', () => {
    const message = new Message(0, '', 42, 1);
    expect(message.user_id).toBe(42);
  });

  it('has chat room id', () => {
    const message = new Message(0, '', 1, 42);
    expect(message.chat_room_id).toBe(42);
  });

  it('can clone itself', () => {
    const message = new Message(0, 'Super Cat', 1, 2);
    const clone = message.clone();
    expect(message).toEqual(clone);
  });
});
