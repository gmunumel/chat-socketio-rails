FactoryGirl.define do
  factory :chat_room do
    title { Faker::Name.title }
    sender nil
    recipient nil
  end
end
