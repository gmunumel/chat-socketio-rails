class AddIndexToChatRooms < ActiveRecord::Migration[5.0]
  def change
    add_index :chat_rooms, :title, :unique => true
  end

  def drop
    remove_index :chat_rooms, :title
  end
end
