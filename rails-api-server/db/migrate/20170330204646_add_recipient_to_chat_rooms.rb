class AddRecipientToChatRooms < ActiveRecord::Migration[5.0]
  def change
    add_reference :chat_rooms, :recipient, foreign_key: true
  end
  def drop
    remove_reference :chat_rooms, :recipient, index: true
  end
end
