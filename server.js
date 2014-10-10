// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var fs = require('fs');
var path = require('path');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {

  // when the client emits 'new message', this listens and executes
  socket.on('videoMessage', function (data) {
    // we tell the client to execute 'new message'
    console.log(data.video);

    var fileName = Math.floor((Math.random()*1000) + 1) + '.webm';
    var videoFile = path.join('public',fileName);
    fs.writeFileSync(videoFile, data.video, 'base64',function(err) {
      if (err) throw err;
      console.log('it\'s saved!');
    });
    // read from the local store

      socket.broadcast.emit('message', fileName);
      
      console.log('hello');
  });
  

  // when the client emits 'stop typing', we broadcast it to other

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
  
  });
});
