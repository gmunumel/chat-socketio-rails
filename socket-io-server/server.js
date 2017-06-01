/**
 * Created by gabrielmunumel on 3/31/17.
 */
 PORT = 5001;
console.log('Node Server Running... | PORT: ' + PORT);

var options = {
    port: 6379,
    url: 'redis://localhost:6379/0'
};
var io = require('socket.io').listen(PORT),
    redis = require('redis').createClient(options);

redis.subscribe('messages');

io.on('connection', function(socket){
  console.log('connected socket');
  
  socket.on('disconnect', function(){
    socket.disconnect();
    console.log('client disconnected');
  });

  redis.on('message', function(channel, message){
    var info = JSON.parse(message);
    socket.emit(channel, info);
    console.log('emit message');
  });
});
