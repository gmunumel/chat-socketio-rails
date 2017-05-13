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

ChatRoom.create(title: 'Sports')
ChatRoom.create(title: 'News')
ChatRoom.create(title: 'Politics')
ChatRoom.create(title: 'Coding')
ChatRoom.create(title: 'Sex')
ChatRoom.create(title: 'Music')
ChatRoom.create(title: 'Anime')
ChatRoom.create(title: 'Manga')
ChatRoom.create(title: 'Life')
ChatRoom.create(title: 'Random')
