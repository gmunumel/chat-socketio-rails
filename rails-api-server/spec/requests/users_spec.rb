require 'rails_helper'

RSpec.describe 'Users API', type: :request do
  # initialize test data
  let!(:users) { create_list(:user, 10) }
  let(:user_id) { users.first.id }
  let(:user_name) { users.first.name }
  let(:user_email) { users.first.email }

  # Test suite for GET /users
  describe 'GET /users' do
    context 'when params ids is not defined' do
      # make HTTP get request before each example
      before { get '/users' }

      it 'returns users' do
        # Note `json` is a custom helper to parse JSON responses
        expect(json).not_to be_empty
        expect(json.size).to eq(10)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when params ids is defined' do
      # make HTTP get request before each example
      before { get '/users?ids=1,3,8' }

      it 'returns users' do
        # Note `json` is a custom helper to parse JSON responses
        expect(json).not_to be_empty
        expect(json.size).to eq(3)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end
  end

  # Test suite for GET /users/search?name=Name&email=Email
  describe 'GET /users/search' do
    # make HTTP get request before each example
    before { get "/users/search?name=#{user_name}&email=#{user_email}" }

    context 'when the record exists' do
      it 'returns the users' do
        expect(json).not_to be_empty
      end

      it 'contains the user' do
        expect(json.first['name']).to eq(user_name)
        expect(json.first['email']).to eq(user_email)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the params are uppercase' do
      let(:user_name) { users.first.name.upcase }
      let(:user_email) { users.first.email.upcase }

      it 'returns the users' do
        expect(json).not_to be_empty
      end

      it 'contains the user in uppercase' do
        expect(json.first['name'].upcase).to eq(user_name)
        expect(json.first['email'].upcase).to eq(user_email)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:user_name) { 'f4k3n4m3' }
      let(:user_email) { 'f4k3@email.com' }

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns an empty array' do
        expect(json).to be_empty
      end
    end
  end

  # Test suite for GET /users/fetch?name=Name&email=Email
  describe 'GET /users/fetch' do
    before { get "/users/fetch?name=#{user_name}&email=#{user_email}" }

    context 'when the record exists' do
      it 'returns the user' do
        expect(json).not_to be_empty
        expect(json['name']).to eq(user_name)
        expect(json['email']).to eq(user_email)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:user_name) { 'f4k3n4m3' }
      let(:user_email) { 'f4k3@email.com' }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find User/)
      end
    end
  end

  # Test suite for GET /users/:id
  describe 'GET /users/:id' do
    before { get "/users/#{user_id}" }

    context 'when the record exists' do
      it 'returns the user' do
        expect(json).not_to be_empty
        expect(json['id']).to eq(user_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:user_id) { 100 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find User/)
      end
    end
  end

  # Test suite for POST /users
  describe 'POST /users' do
    # valid payload
    let(:valid_attributes) { { name: 'Learn Elm', email: 'fake@email.com' } }

    context 'when the request is valid' do
      before { post '/users', params: valid_attributes }

      it 'creates a user' do
        expect(json['name']).to eq('Learn Elm')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is valid but user exists' do
      before { post '/users', params: { name: user_name, email: user_email } }

      it 'returns status code 409' do
        expect(response).to have_http_status(409)
      end

      it 'returns a validation failure message' do
        expect(response.body)
            .to match(/Validation failed: Unique constraint error/)
      end
    end

    context 'when the request is invalid' do
      before { post '/users', params: { name: 'Foobar' } }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a validation failure message' do
        expect(response.body)
            .to match(/Validation failed: Email can't be blank/)
      end
    end
  end

  # Test suite for PUT /users/:id
  describe 'PUT /users/:id' do
    let(:valid_attributes) { { name: 'Shopping' } }

    context 'when the record exists' do
      before { put "/users/#{user_id}", params: valid_attributes }

      it 'updates the record' do
        expect(response.body).to be_empty
      end

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end
    end
  end

  # Test suite for DELETE /users/:id
  describe 'DELETE /users/:id' do
    before { delete "/users/#{user_id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end