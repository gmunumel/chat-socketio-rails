var should = require('should');
var io = require('socket.io-client');
var redis = require('redis');
var redisJs = require('redis-js');

PORT    = 5001;
CHANNEL = 'messages';

var socketURL = 'http://0.0.0.0:' + PORT;

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var message1 = 'first';
var message2 = 'hello';
var message3 = 'hi';

describe('Chat Server',function(){

  it('should broadcast new message to all users', function(done){
    var client1 = io.connect(socketURL, options);
    var clientRedis = redis.createClient();

    client1.on('connect', function(data){
      client1.emit('message', message1);

      // Since first client is connected, we connect
      // the second client. 
      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        client2.emit('message', message2);
        clientRedis.publish(CHANNEL, message2);
      });

      client2.on('messages', function(message){
        message.should.equal(message2);
        client2.disconnect();
        done();
      });

    });

    var numMessages = 0;
    client1.on('messages', function(message){
      numMessages += 1;

      if(numMessages === 2){
        message.should.equal(message2);
        client1.disconnect();
        done();
      }
    });
  });

  it('should be able to broadcast messages', function(done){
    var client1, client2, client3;
    var message = 'Hello World';
    var messages = 0;
    var clientRedis = redisJs.createClient();

    clientRedis.subscribe(CHANNEL);

    var checkMessage = function(client){
      clientRedis.on('message', function(channel, msg){
        message.should.equal(msg);
        client.disconnect();
        messages++;
        if(messages === 3){
          done();
        };
      });
    };

    client1 = io.connect(socketURL, options);
    checkMessage(client1);

    client1.on('connect', function(data){
      client2 = io.connect(socketURL, options);
      checkMessage(client2);

      client2.on('connect', function(data){
        client3 = io.connect(socketURL, options);
        checkMessage(client3);

        client3.on('connect', function(data){
          clientRedis.publish(CHANNEL, message);
        });
      });
    });
  });
});


