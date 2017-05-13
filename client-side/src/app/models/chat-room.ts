export class ChatRoom {
  constructor(
    public id = 0,
    public title = '',
    public created_id = 1,
    public sender_id: any = null,
    public recipient_id: any = null) { }
  clone() { return new ChatRoom(this.id, this.title, this.created_id, this.sender_id, this.recipient_id); }
}
