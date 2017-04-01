require 'rails_helper'

RSpec.describe ChatRoom, type: :model do
  # Validation tests
  it { should validate_presence_of(:title) }

  # ensure an Chat rooms record belongs to a single Sender record
  it { should belong_to(:sender) }
  # ensure an Chat rooms record belongs to a single Recipient record
  it { should belong_to(:recipient) }
  # ensure Chat rooms model has a 1:m relationship with the Messages model
  it { should have_many(:messages).dependent(:destroy) }
end
