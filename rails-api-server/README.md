# Rails app

This project provide the backend functionality for the chat. It will get requests 
from client-side and will generate data in response. Consists in three main parts: Users, 
Chat Room and Message.  


## Installation
```bundle install```

## Run App
``` rails s```

## Run Migration
```rake db:migration```

## Load Initial Data
```rake db:seed```

## Run Tests
```rspec spec```

_Notice before run the app or tests you must have redis server running first (`redis-server`)._

## Endpoints

### Users

#### Get Users
```curl http://localhost:3000/users```

#### Get Users sing Ids
```curl http://localhost:3000/users?ids=1,3,5```

#### Show User
```curl http://localhost:3000/users/1```

#### Search Users
This is use for asyncronous search of users. In case it doesn't find any user will return empty array `[]`.
```curl http://localhost:3000/users/search?name=admin&email=admin@admin.com```

#### Fetch User
This is use to search an user that is suppose to exists. If it doesn't find any will throw an exception.
```http://localhost:3000/users/fetch?name=admin&email=admin@admin.com```

#### Create User
```curl -i -X POST -H "Content-Type:application/json" http://localhost:3000/users -d '{"name": "test", "email": "test@test.com"}'``` 

#### Update User
```curl -i -X PUT -H "Content-Type:application/json" http://localhost:3000/users/1 -d '{"name": "test2", "email": "test2@test.com"}'``` 

#### Delete User
```curl -i -X DELETE http://localhost:3000/users/1``` 

### Chat Rooms

#### Get Chat Rooms
```curl http://localhost:3000/chat_rooms```

#### Show Chat Room
```curl http://localhost:3000/chat_rooms/1```

#### Search Chat Rooms
This is use for asyncronous search of users. In case it doesn't find any user will return empty array `[]`.
```curl http://localhost:3000/chat_rooms/search?title=Sport```

#### Create Chat Room
```curl -i -X POST -H "Content-Type:application/json" http://localhost:3000/chat_rooms -d '{"title": "games", "created_id": 1, "sender_id": 1, "recipient_id": 1}'``` 

#### Update Chat Room
```curl -i -X PUT -H "Content-Type:application/json" http://localhost:3000/chat_rooms/1 -d '{"title": "games", "created_id": 1, "sender_id": 1, "recipient_id": 1}'``` 

#### Delete Chat Room
```curl -i -X DELETE http://localhost:3000/chat_rooms/1``` 

### Messages

#### Get Messages
```http://localhost:3000/chat_rooms/1/messages```

#### Show Message
```http://localhost:3000/chat_rooms/1/messages/2```

#### Create Message
```curl -i -X POST -H "Content-Type:application/json" http://localhost:3000/chat_rooms/1/messages -d '{"body": "very long text", "user_id": 1}'``` 

#### Update Message
```curl -i -X PUT -H "Content-Type:application/json" http://localhost:3000/chat_rooms/1/messages/1 -d '{"body": "very long text", "user_id": 1}'``` 

#### Delete Message
```curl -i -X DELETE http://localhost:3000/chat_rooms/1/messages/1``` 

## License

Licensed under [MIT](../LICENSE.md)


Based on the following tutorials: 
* Models: https://www.sitepoint.com/create-a-chat-app-with-rails-5-actioncable-and-devise/
* Models - Routing: https://github.com/nerdyfactory/react-native-chat

Redis:
* Config: http://www.victorareba.com/tutorials/speed-your-rails-app-with-model-caching-using-redis
* General Idea: https://medium.com/wolox-driving-innovation/adding-a-realtime-module-to-your-rails-api-18bb562e6441
