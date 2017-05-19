require 'rails_helper'

RSpec.describe 'Messages API', type: :request do
  # Initialize the test data
  let!(:sender) { create(:user) }
  let!(:recipient) { create(:user) }
  let!(:chat_room) { create(:chat_room, sender_id: sender.id, recipient_id: recipient.id) }
  let!(:user) { create(:user) }
  let!(:messages) { create_list(:message, 20, chat_room_id: chat_room.id, user_id: user.id) }
  let(:chat_room_id) { chat_room.id }
  let(:user_id) { user.id }
  let(:id) { messages.first.id }

  # Test suite for GET /chat_rooms/:chat_room_id/messages
  describe 'GET /chat_rooms/:chat_room_id/messages' do
    before { get "/chat_rooms/#{chat_room_id}/messages" }

    context 'when chat room exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns all chat room messages' do
        expect(json.size).to eq(20)
      end
    end

    context 'when chat room does not exist' do
      let(:chat_room_id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find ChatRoom/)
      end
    end
  end

  # Test suite for GET /chat_rooms/:chat_room_id/messages/search?user_id=Id
  describe 'GET /chat_rooms/:chat_room_id/messages/search' do
    # make HTTP get request before each example
    before { get "/chat_rooms/#{chat_room_id}/messages/search?user_id=#{user_id}" }

    context 'when the record exists' do
      it 'returns the message' do
        expect(json).not_to be_empty
      end

      it 'contains the mensag' do
        expect(json['id']).to eq(id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:user_id) { 99999 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Message/)
      end
    end
  end

  # Test suite for GET /chat_rooms/:chat_room_id/messages/:id
  describe 'GET /chat_rooms/:chat_room_id/messages/:id' do
    before { get "/chat_rooms/#{chat_room_id}/messages/#{id}" }

    context 'when chat room message exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns the message' do
        expect(json['id']).to eq(id)
      end
    end

    context 'when chat room message does not exist' do
      let(:id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Message/)
      end
    end
  end

  # Test suite for PUT /chat_rooms/:chat_room_id/messages
  describe 'POST /chat_rooms/:chat_room_id/messages' do
    let(:valid_attributes) { { body: 'Visit Narnia', user_id: user_id } }

    context 'when request attributes are valid' do
      before { post "/chat_rooms/#{chat_room_id}/messages", params: valid_attributes }

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when an invalid request' do
      before { post "/chat_rooms/#{chat_room_id}/messages", params: {} }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a failure message' do
        expect(response.body).to match(/Validation failed: Body can't be blank/)
      end
    end
  end

  # Test suite for PUT /chat_rooms/:chat_room_id/messages/:id
  describe 'PUT /chat_rooms/:chat_room_id/messages/:id' do
    let(:valid_attributes) { { body: 'Mozart', user_id: user_id } }

    before { put "/chat_rooms/#{chat_room_id}/messages/#{id}", params: valid_attributes }

    context 'when message exists' do
      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end

      it 'updates the message' do
        updated_message = Message.find(id)
        expect(updated_message.body).to match(/Mozart/)
      end
    end

    context 'when the message does not exist' do
      let(:id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Message/)
      end
    end
  end

  # Test suite for DELETE /chat_rooms/:id/messages/:id
  describe 'DELETE /chat_rooms/:id' do
    before { delete "/chat_rooms/#{chat_room_id}/messages/#{id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end