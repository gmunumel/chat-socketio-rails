/**
 * Created by gabrielmunumel on 3/31/17.
 */
console.log("Hello world!");
// var http = require("http");
// http.createServer(function(request, response) {
//     response.writeHead(200, {"Content-Type": "text/html"});
//     //response.end("Hello World!");
//     response.sendFile(__dirname + '/index.html');
// }).listen(8080);


//var app = require('express')();
// var http = require('http').Server(app);
//
// app.get('/', function(req, res){
//     res.send('<h1>Hello world</h1>');
// });
//
// http.listen(3000, function(){
//     console.log('listening on *:3000');
// });

var redis = require("redis").createClient();
redis.subscribe('users-list');

console.log("PORT: " + process.env.PORT);

var io = require('socket.io').listen(process.env.PORT || 5001);
io.on('connection', function(socket){
    console.log('connected socket');
    socket.on('disconnect', function(){
        console.log('client disconnected');
        socket.disconnect();
    });
});

redis.on('message', function(channel, message){
    var info = JSON.parse(message);
    io.sockets.emit(channel, info);
    console.log('emit '+ channel);
});

// var app = require('http').createServer();
// var io = require('socket.io');
//
// io = io.listen(app);
// io.configure(function(){
//     io.set("transports", ["xhr-polling"]);
//     io.set("polling duration", 10);
//     io.set("close timeout", 10);
//     io.set("log level", 1);
// })
//
// io.sockets.on('connection', function (socket) {}
// var port = process.env.PORT || 5001;
// app.listen(port);