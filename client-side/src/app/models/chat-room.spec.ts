import { ChatRoom } from './chat-room';

describe('Chat Room', () => {
  it('has id', () => {
    const chatRoom = new ChatRoom(0, '', 1, 1, 1);
    expect(chatRoom.id).toBe(0);
  });

  it('has title', () => {
    const chatRoom = new ChatRoom(0, 'Super Cat', 1, 1, 1);
    expect(chatRoom.title).toBe('Super Cat');
  });

  it('has created id', () => {
    const chatRoom = new ChatRoom(0, '', 42, 1, 1);
    expect(chatRoom.created_id).toBe(42);
  });

  it('has sender id', () => {
    const chatRoom = new ChatRoom(0, '', 1, 42, 1);
    expect(chatRoom.sender_id).toBe(42);
  });

  it('has recipient id', () => {
    const chatRoom = new ChatRoom(0, '', 1, 1, 42);
    expect(chatRoom.recipient_id).toBe(42);
  });

  it('can clone itself', () => {
    const chatRoom = new ChatRoom(0, 'Super Cat', 1, 2, 3);
    const clone = chatRoom.clone();
    expect(chatRoom).toEqual(clone);
  });
});
