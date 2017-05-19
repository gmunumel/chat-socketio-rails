# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'factory_girl_rails'

User.create(name: 'admin', email: 'admin@admin.com')
10.times { FactoryGirl.create(:user) }

ChatRoom.create(title: 'Sports', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'News', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Politics', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Coding', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Sex', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Music', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Anime', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Manga', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Life', created_id: 1, sender_id: 1, recipient_id: 1)
ChatRoom.create(title: 'Random', created_id: 1, sender_id: 1, recipient_id: 1)

Message.create(body: 'First message', user_id: 1, chat_room_id: 1)
Message.create(body: 'Second message', user_id: 1, chat_room_id: 1)
Message.create(body: 'Hola message', user_id: 1, chat_room_id: 2)
Message.create(body: 'Chao message', user_id: 1, chat_room_id: 2)
Message.create(body: '1 message', user_id: 1, chat_room_id: 3)
Message.create(body: '2 message', user_id: 1, chat_room_id: 3)
Message.create(body: 'Hello', user_id: 1, chat_room_id: 4)
Message.create(body: 'Hi', user_id: 1, chat_room_id: 4)
Message.create(body: 'Someone', user_id: 1, chat_room_id: 5)
Message.create(body: 'Anon', user_id: 1, chat_room_id: 5)
Message.create(body: 'Foo', user_id: 1, chat_room_id: 6)
Message.create(body: 'Bar', user_id: 1, chat_room_id: 6)
Message.create(body: 'Baz', user_id: 1, chat_room_id: 7)
Message.create(body: 'Quartz', user_id: 1, chat_room_id: 7)
Message.create(body: 'Yep', user_id: 1, chat_room_id: 8)
Message.create(body: 'Yep2', user_id: 1, chat_room_id: 8)
Message.create(body: ':)', user_id: 1, chat_room_id: 9)
Message.create(body: ';)', user_id: 1, chat_room_id: 9)
Message.create(body: 'Test', user_id: 1, chat_room_id: 10)
Message.create(body: 'Testing', user_id: 1, chat_room_id: 10)