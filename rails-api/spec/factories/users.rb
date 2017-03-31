FactoryGirl.define do
  factory :user do
    name { Faker::Pokemon.name }
    email { Faker::Internet.email }
  end
end
