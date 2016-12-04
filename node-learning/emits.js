//16.12.4 
//这是in action 中的一个例子 3.2中的eventlistenner
var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function (id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = function (senderId, message) {
    if (id != senderId) 
      this.clients[id].write(message);
    
  }
  this.on('broadcast', this.subscriptions[id]);
});
channel.on('leave', function(id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, id + ' has left the chat.\n\r');
  delete channel.clients[id];
  delete channel.subscriptions[id];
});
channel.on('shut down', function() {
  channel.emit('broadcast', '', 'Chatroom has shut down.\n\r');
  channel.removeAllListeners('broadcast');
});
// channel.on('broadcast', function(sid, message){
//   for (var id in channel.clients) {
//     if(id != sid) 
//       channel.clients[id].write(message);
//   }

// });

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  channel.emit('join', id, client);

  client.on('close', function() {
    channel.emit('leave', id);
  });

  client.on('data', function (data) {
    data = data.toString();
    if (data == "q") {
      channel.emit('shut down');
    }
    channel.emit('broadcast', id, data);
  });
});
server.listen(8888);
console.log("ok~");