export class Message {
  constructor(
    public id = 0,
    public body = '',
    public user_id = 1,
    public chat_room_id = 1,
    public created_at: Date = null) { }
  clone() { return new Message(this.id, this.body, this.user_id, this.chat_room_id); }
}
