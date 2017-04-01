class AddUserToChatRooms < ActiveRecord::Migration[5.0]
  def change
    add_reference :chat_rooms, :user, foreign_key: true
  end
  def drop
    remove_reference :chat_rooms, :user, foreign_key: true
  end
end
