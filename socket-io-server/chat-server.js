
PORT    = 5001;
CHANNEL = 'messages';

console.log('Node Server Running... | PORT: ' + PORT);

function GoChatServer() {
  var io = require('socket.io').listen(PORT);
  var redis = require('redis').createClient();

  redis.subscribe(CHANNEL);

  io.on('connection', function(socket){
    console.log('connected socket');
    
    socket.on('disconnect', function(){
      socket.disconnect();
      console.log('client disconnected');
    });

    redis.on('message', function(channel, message){
      socket.emit(channel, message);
      console.log('emit message: ' + message);
    });
  });
}

GoChatServer();
