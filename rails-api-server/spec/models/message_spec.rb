require 'rails_helper'

RSpec.describe Message, type: :model do
  # Validation tests
  it { should validate_presence_of(:body) }
  it { should validate_presence_of(:chat_room_id) }
  it { should validate_presence_of(:user_id) }

  # ensure an Message record belongs to a single User record
  it { should belong_to(:user) }
  # ensure an Message record belongs to a single Chat room record
  it { should belong_to(:chat_room) }
end
