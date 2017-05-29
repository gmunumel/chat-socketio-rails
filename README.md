# README

# My Simple Chat App

This app is intended to show a simple chat functionality
using [Socket.io](https://socket.io/) in addition with 
[Ruby on Rails](http://rubyonrails.org/) and
[Angular2](http://www.angular2.com/).

The structure of the project is very simple:

* [client-side](https://github.com/gmunumel/chat-socketio-rails/blob/master/client-side/README.md): front-end side build in angular which allows users to interact with the application. Also communicate with socket-io-server to listen for incomming messages. All the information is send and request via
a Rails API. 
* [socket-io-server](https://github.com/gmunumel/chat-socketio-rails/blob/master/socket-io-server/README.md): listen and broadcast messages from [Redis](https://redis.io/), a in-memory database which storage keys with an optional durability.
* [rails-api-server](https://github.com/gmunumel/chat-socketio-rails/blob/master/rails-api-server/README.md): back-end side build in rails which send and request data via an API. It communicates with Redis to storage new messages.

Because Rails is not an event-based server is not recommended to use it having real time applications. That's why Redis is so important, give you the communication between your data and the socket-io-server. [This article](https://medium.com/wolox-driving-innovation/adding-a-realtime-module-to-your-rails-api-18bb562e6441) explain with more details. 

# How to run the app locally

Make sure you have all the components up and running. Please go to the readme pages in every case.

# Live example

TODO - use heroku

# License

Licensed under [MIT](LICENSE.md)