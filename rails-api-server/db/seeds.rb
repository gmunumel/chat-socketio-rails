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
