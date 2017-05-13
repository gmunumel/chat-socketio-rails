require 'rails_helper'

RSpec.describe ChatRoomsController, type: :routing do
  describe 'routing' do

    it 'routes to #index' do
      expect(get: '/chat_rooms').to route_to('chat_rooms#index')
    end

    it 'routes to #search' do
      expect(get: '/chat_rooms/search').to route_to('chat_rooms#search')
    end

    it 'routes to #show' do
      expect(get: '/chat_rooms/1').to route_to('chat_rooms#show', id: '1')
    end

    it 'routes to #create' do
      expect(post: '/chat_rooms').to route_to('chat_rooms#create')
    end

    it 'routes to #update via PUT' do
      expect(put: '/chat_rooms/1').to route_to('chat_rooms#update', id: '1')
    end

    it 'routes to #update via PATCH' do
      expect(patch: '/chat_rooms/1').to route_to('chat_rooms#update', id: '1')
    end

    it 'routes to #destroy' do
      expect(delete: '/chat_rooms/1').to route_to('chat_rooms#destroy', id: '1')
    end

  end
end