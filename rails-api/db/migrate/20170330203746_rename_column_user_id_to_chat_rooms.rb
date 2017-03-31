class RenameColumnUserIdToChatRooms < ActiveRecord::Migration[5.0]
  def change
    rename_column :chat_rooms, :user_id, :sender_id
  end
  def self.down
    # rename back if you need or do something else or do nothing
    rename_column :chat_rooms, :sender_id, :user_id
  end
end
