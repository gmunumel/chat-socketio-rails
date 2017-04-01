class Message < ApplicationRecord
  # validations
  validates_presence_of :body, :chat_room_id, :user_id

  belongs_to :user
  belongs_to :chat_room
end
