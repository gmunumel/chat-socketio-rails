require 'rails_helper'

RSpec.describe MessagesController, type: :routing do
  describe 'routing' do

    it 'routes to #index' do
      expect(get: '/chat_rooms/1/messages').to route_to('messages#index', chat_room_id: '1')
    end

    it 'routes to #show' do
      expect(get: '/chat_rooms/1/messages/1').to \
route_to('messages#show', chat_room_id: '1', id: '1')
    end

    it 'routes to #create' do
      expect(post: '/chat_rooms/1/messages').to route_to('messages#create', chat_room_id: '1')
    end

    it 'routes to #update via PUT' do
      expect(put: '/chat_rooms/1/messages/1').to \
route_to('messages#update', chat_room_id: '1', id: '1')
    end

    it 'routes to #update via PATCH' do
      expect(patch: '/chat_rooms/1/messages/1').to \
route_to('messages#update', chat_room_id: '1', id: '1')
    end

    it 'routes to #destroy' do
      expect(delete: '/chat_rooms/1/messages/1').to \
route_to('messages#destroy', chat_room_id: '1', id: '1')
    end

  end
end