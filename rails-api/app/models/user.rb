class User < ApplicationRecord
  # validations
  validates_presence_of :name, :email

  has_many :chat_rooms, foreign_key: :sender_id
end
