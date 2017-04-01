require 'rails_helper'

RSpec.describe User, type: :model do
  # Validation tests
  # ensure columns title and created_by are present before saving
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:email) }

  # ensure User model has a 1:m relationship with the Chat rooms model
  it { should have_many(:chat_rooms) }
end
