class RenameColumnUserIdToCreatedId < ActiveRecord::Migration[5.0]
  def change
    rename_column :chat_rooms, :user_id, :created_id
  end
  def drop
    # rename back if you need or do something else or do nothing
    rename_column :chat_rooms, :created_id, :user_id
  end
end
