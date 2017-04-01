FactoryGirl.define do
  factory :message do
    body { Faker::Lorem.sentence }
    user nil
    chat_room nil
  end
end
