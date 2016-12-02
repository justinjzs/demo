//16.12.1
//emit 4个事件： nameResult,joinResult,message,rooms
//on   6个事件： connection，rooms，message，join，nameAttempt,disconnect
var socketio = require('socket.io');
var io;
var guestNumber = 1; //Guestname = Guest + guestNumber
var nickNames = {}; // socket.io ----> name
var namesUsed = []; //记录
var currentRoom = {}; //socket.io ----> room

exports.listen = function(server) {
  io = socketio.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function(socket) {  //监听“connection事件”--有人加入chatroom
    guestNumber = assignGuestName(socket,guestNumber, nickNames, namesUsed);  //给游客昵称
    joinRoom(socket, 'Lobby');  //游客进入大厅

    handleMessageBroadcasting(socket,nickNames);//处理发送信息
    handleNameChangeAttempts(socket, nickNames, namesUsed);//处理改名
    handleRoomJoining(socket);  //处理换/建房间

    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets.manager.rooms);
    });
    handleClientDisconnection(socket, nickNames, namesUsed);  //处理用户离开
  });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) { //给游客昵称
  var name = 'Guest' + guestNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', { //发给浏览器"nameResult"事件
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

function joinRoom(socket, room) {
  socket.join(room);  //加入房间
  currentRoom[socket.id] = room;  //把id和房间记录到currentroom
  socket.emit('joinResult', {room: room});  //发给浏览器"joinResult"事件
  socket.broadcast.to(room).emit('message', {text: nickNames[socket.id] + ' has joined ' + room + '.'});  //向房间所有人广播“”message
  var usersInRoom = io.sockets.clients(room); //获取房间内用户信息
  if (usersInRoom.length > 1) { //当前房间还有其他人
    var usersInRoomSummary = 'Users currently in ' + room +': '; //现在在房间的其他用户
    for (var index in usersInRoom) {
      var userSocketId = usersInRoom[index].id;
      if(userSocketId != socket.id) { //
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary}); //发给浏览器"message" 事件
  }
}

//-----------------------16.12.2---------------------------

function handleMessageBroadcasting(socket) { //把message广播给room中所有用户
  socket.on('message', function(message) {  //{"room"："Lobby", "text": "Hi"}
    socket.broadcast.to(message.room).emit('message', {text: nickNames[socket.id] + ': ' + message.text}); 
  });
}

function handleRoomJoining(socket) {  //离开原房间，进入新房间
  socket.on('join', function(room) {  //{"newroom": "dragonfly"}
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  })
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(name) { //  "justin.jin"
    if(name.indexOf('Guest') == 0) { //判断名字是否合法（不能以Guest开头）
      socket.emit('nameResult', {success: false, message: 'Names cannot begin with "Guest".'});
    } else {    //名字合法
      if (namesUsed.indexOf(name) == -1) {  //判断名字是否重复
        var previousName = nickNames[socket.id];  
        var previousNameIndex = namesUsed.indexOf(previousName); ////记下之前的昵称在namesUsed中的下标
        namesUsed.push(name);   //新昵称加入
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];  //删除原昵称
        socket.emit('nameResult', {success: true, name: name}); //返回浏览器
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {text: previousName + 'is now known as ' + name + '.'});
      } else {  //名字重复
        socket.emit('nameResult', {success: false, message: 'That name is already in use.'});
      }
    }
  })
}

function handleClientDisconnection(socket) {  //删除昵称记录和已用昵称
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}